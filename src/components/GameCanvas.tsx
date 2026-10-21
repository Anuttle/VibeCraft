import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { BLOCK_CONFIGS, BlockType, InventorySlot, STATION_BLOCKS } from "../types";
import { TerrainGenerator, CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z, SEA_LEVEL } from "../utils/terrain";
import { buildChunkGeometry } from "../utils/meshing";
import { ITEM_REGISTRY, BLOCK_DROP_TABLE, breakSeconds } from "../utils/items";
import { MobEntity, MobType, createPigMesh, playSoundEffect } from "../utils/mobs";
import { InputMode, gameActions, resetTouchInput, touchInput } from "../game/input";
import { GameEvent } from "../game/quest";
import { Interactable, WorldSetup } from "../game/world";
import { HeldItemView } from "../utils/heldItem";
import { BlockAtlas, loadBlockAtlas } from "../utils/textures";
import { HumanoidMesh, createDecor, createHumanoidMesh, createNameTag } from "../utils/props";

interface GameCanvasProps {
  onLockChange: (isLocked: boolean) => void;
  /** False while menus, dialogue or the bag are open; the world keeps rendering. */
  inputEnabled: boolean;
  inputMode: InputMode;
  activeBlock: BlockType;
  hotbar: InventorySlot[];
  activeSlotIndex: number;
  onActiveSlotIndexChange: (idx: number) => void;
  onBlockPlaced: () => void;
  onItemPickedUp: (itemId: string, count: number) => boolean;
  onItemDroppedFromHotbar: () => void;
  onToggleInventory: () => void;
  onToolUsed?: (slotIndex: number) => void;
  onGameEvent: (event: GameEvent) => void;
  spawnDropExternalRef: React.MutableRefObject<((itemId: string, count: number) => void) | null>;
  onOpenCraftingTable?: () => void;
  /** Chapter-specific scenery; read once when the world is created. */
  world: WorldSetup;
  /** Called when the player comes within reach of a station or character, or leaves it. */
  onFocusChange: (target: Interactable | null) => void;
  /** Skip simulation and rendering while a full-screen activity covers the world. */
  suspended?: boolean;
}

const INTERACT_RANGE = 2.6;

// Fixed late-morning light. Night made reading and navigation harder for young
// players; chapters can set their own time of day later.
const TIME_OF_DAY = 0.42;

// Trees stamped near spawn so the tutorial always has wood within reach.
const SPAWN_TREES: Array<[number, number]> = [
  [3, 4],
  [12, 11],
];

export default function GameCanvas({
  onLockChange,
  inputEnabled,
  inputMode,
  activeBlock,
  hotbar,
  activeSlotIndex,
  onActiveSlotIndexChange,
  onBlockPlaced,
  onItemPickedUp,
  onItemDroppedFromHotbar,
  onToggleInventory,
  onToolUsed,
  onGameEvent,
  spawnDropExternalRef,
  onOpenCraftingTable,
  world,
  onFocusChange,
  suspended = false,
}: GameCanvasProps) {
  const suspendedRef = useRef(suspended);
  useEffect(() => { suspendedRef.current = suspended; }, [suspended]);
  const worldRef = useRef(world);
  const onFocusChangeRef = useRef(onFocusChange);
  useEffect(() => { onFocusChangeRef.current = onFocusChange; }, [onFocusChange]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync props via refs so the Three.js setup runs once and never sees stale values.
  const hotbarRef = useRef<InventorySlot[]>(hotbar);
  const activeSlotIndexRef = useRef<number>(activeSlotIndex);
  const activeBlockRef = useRef<BlockType>(activeBlock);
  const inputEnabledRef = useRef(inputEnabled);
  const inputModeRef = useRef(inputMode);
  const onLockChangeRef = useRef(onLockChange);
  const onActiveSlotIndexChangeRef = useRef(onActiveSlotIndexChange);
  const onBlockPlacedRef = useRef(onBlockPlaced);
  const onItemPickedUpRef = useRef(onItemPickedUp);
  const onItemDroppedFromHotbarRef = useRef(onItemDroppedFromHotbar);
  const onToggleInventoryRef = useRef(onToggleInventory);
  const onToolUsedRef = useRef(onToolUsed);
  const onGameEventRef = useRef(onGameEvent);
  const onOpenCraftingTableRef = useRef(onOpenCraftingTable);

  useEffect(() => { hotbarRef.current = hotbar; }, [hotbar]);
  useEffect(() => { activeSlotIndexRef.current = activeSlotIndex; }, [activeSlotIndex]);
  useEffect(() => { activeBlockRef.current = activeBlock; }, [activeBlock]);
  useEffect(() => { inputModeRef.current = inputMode; }, [inputMode]);
  useEffect(() => { onLockChangeRef.current = onLockChange; }, [onLockChange]);
  useEffect(() => { onActiveSlotIndexChangeRef.current = onActiveSlotIndexChange; }, [onActiveSlotIndexChange]);
  useEffect(() => { onBlockPlacedRef.current = onBlockPlaced; }, [onBlockPlaced]);
  useEffect(() => { onItemPickedUpRef.current = onItemPickedUp; }, [onItemPickedUp]);
  useEffect(() => { onItemDroppedFromHotbarRef.current = onItemDroppedFromHotbar; }, [onItemDroppedFromHotbar]);
  useEffect(() => { onToggleInventoryRef.current = onToggleInventory; }, [onToggleInventory]);
  useEffect(() => { onToolUsedRef.current = onToolUsed; }, [onToolUsed]);
  useEffect(() => { onGameEventRef.current = onGameEvent; }, [onGameEvent]);
  useEffect(() => { onOpenCraftingTableRef.current = onOpenCraftingTable; }, [onOpenCraftingTable]);

  // Movement and look state
  const keysPressed = useRef<{ [key: string]: boolean }>({ w: false, a: false, s: false, d: false, Space: false });

  useEffect(() => {
    inputEnabledRef.current = inputEnabled;
    if (!inputEnabled) {
      // Stop walking when a menu opens mid-step.
      keysPressed.current = { w: false, a: false, s: false, d: false, Space: false };
      resetTouchInput();
    }
  }, [inputEnabled]);

  const torchLightsRef = useRef<Map<string, { group: THREE.Group; light: THREE.PointLight }>>(new Map());
  const mobsRef = useRef<MobEntity[]>([]);
  const particlesRef = useRef<{ mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; maxLife: number }[]>([]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const playerVelocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const playerPosition = useRef<THREE.Vector3>(new THREE.Vector3(0.5, 32, 0.5));
  const isGrounded = useRef<boolean>(true);

  const itemDropsRef = useRef<Array<{
    id: string;
    itemId: string;
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    onGround: boolean;
    spawnTime: number;
    toRemove?: boolean;
  }>>([]);

  const SPEED = 6.0; // Units per second
  const JUMP_FORCE = 8.5;
  const GRAVITY = 24.0;
  const WATER_SPEED = 0.55; // Wading is slower than walking
  const WATER_SINK = 2.5; // Top speed sinking through water
  const SWIM_UP = 5.5; // Enough to climb out onto a bank one block higher
  const PLAYER_HEIGHT = 1.8; // Eye height
  const MOUSE_SENSITIVITY = 0.0022;
  const TOUCH_SENSITIVITY = 0.006;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#87CEEB");
    scene.fog = new THREE.FogExp2("#87CEEB", 0.015);
    sceneRef.current = scene;

    const createItemDropMesh = (itemColor: string): THREE.Mesh => {
      const geom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const mat = new THREE.MeshLambertMaterial({ color: new THREE.Color(itemColor), transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const spawnItemDrop = (itemId: string, pos: THREE.Vector3, velocity: THREE.Vector3) => {
      const itemDef = ITEM_REGISTRY[itemId];
      if (!itemDef) return;
      const itemMesh = createItemDropMesh(itemDef.color);
      itemMesh.position.copy(pos);
      scene.add(itemMesh);
      itemDropsRef.current.push({
        id: `${Date.now()}_${Math.random()}`,
        itemId,
        mesh: itemMesh,
        position: pos.clone(),
        velocity: velocity.clone(),
        onGround: false,
        spawnTime: performance.now(),
      });
    };

    // Bridge for dropping items from the bag screen into the world
    spawnDropExternalRef.current = (itemId: string, count: number) => {
      if (!cameraRef.current) return;
      const spawnDir = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion);
      const dropPos = playerPosition.current.clone().addScaledVector(spawnDir, 1.2);
      dropPos.y = cameraRef.current.position.y - 0.3;
      for (let i = 0; i < count; i++) {
        const scatterVel = spawnDir.clone().multiplyScalar(3.5).add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          1.5 + Math.random() * 1.5,
          (Math.random() - 0.5) * 1.5
        ));
        spawnItemDrop(itemId, dropPos, scatterVel);
      }
    };

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.rotation.order = "YXZ";
    cameraRef.current = camera;
    // The camera is in the scene so the held item, its child, gets drawn.
    scene.add(camera);
    const heldView = new HeldItemView(camera);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lights and sky
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.55);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#fff9e6", 1.25);
    sunLight.position.set(40, 80, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 250;
    const d = 60;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const sunGeom = new THREE.BoxGeometry(16, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff5cc, fog: false });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    scene.add(sunMesh);
    const sunHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.35, side: THREE.DoubleSide, fog: false })
    );
    sunMesh.add(sunHalo);

    const createTorchEntity = (wx: number, wy: number, wz: number) => {
      const key = `${wx},${wy},${wz}`;
      if (torchLightsRef.current.has(key)) return;
      const group = new THREE.Group();
      group.position.set(wx + 0.5, wy, wz + 0.5);
      const stickMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.5, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 })
      );
      stickMesh.position.set(0, 0.25, 0);
      group.add(stickMesh);
      const flameMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.16, 0.14),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, fog: false })
      );
      flameMesh.position.set(0, 0.52, 0);
      group.add(flameMesh);
      const pointLight = new THREE.PointLight(0xfbbf24, 1.6, 12, 1.8);
      pointLight.position.set(0, 0.6, 0);
      group.add(pointLight);
      scene.add(group);
      torchLightsRef.current.set(key, { group, light: pointLight });
    };

    const removeTorchEntity = (wx: number, wy: number, wz: number) => {
      const key = `${wx},${wy},${wz}`;
      const existing = torchLightsRef.current.get(key);
      if (existing) {
        scene.remove(existing.group);
        existing.light.dispose();
        torchLightsRef.current.delete(key);
      }
    };

    // 5. Procedural world
    const freeBuild = worldRef.current.freeBuild ?? null;
    const seedId = freeBuild?.seed ?? "printing_press_" + Math.floor(Math.random() * 10000000);
    const generator = new TerrainGenerator(seedId);
    /** Replay the free-build edits saved for one chunk onto its fresh terrain. */
    const applyEdits = (key: string, blocks: Uint8Array) => {
      const edits = freeBuild?.edits[key];
      if (edits) for (const [idx, block] of Object.entries(edits)) blocks[Number(idx)] = block;
      return blocks;
    };
    const loadedChunks = new Map<string, Uint8Array>();
    const chunkMeshes = new Map<string, THREE.Mesh>();

    const selectionGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002));
    const selectionMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const selectionBox = new THREE.LineSegments(selectionGeometry, selectionMaterial);
    selectionBox.visible = false;
    scene.add(selectionBox);

    // Darkens the block being broken as the player keeps holding.
    const crackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthWrite: false });
    const crackMesh = new THREE.Mesh(new THREE.BoxGeometry(1.004, 1.004, 1.004), crackMaterial);
    crackMesh.visible = false;
    scene.add(crackMesh);

    const raycaster = new THREE.Raycaster();
    const SCREEN_CENTER = new THREE.Vector2(0, 0);

    const viewRadius = 2;
    for (let cx = -viewRadius; cx <= viewRadius; cx++) {
      for (let cz = -viewRadius; cz <= viewRadius; cz++) {
        loadedChunks.set(`${cx},${cz}`, generator.generateChunk(cx, cz));
      }
    }

    const spawnChunk = loadedChunks.get("0,0")!;
    const setLocal = (x: number, y: number, z: number, block: BlockType) => {
      if (x < 0 || x >= CHUNK_SIZE_X || z < 0 || z >= CHUNK_SIZE_Z || y < 0 || y >= CHUNK_SIZE_Y) return;
      spawnChunk[x + z * CHUNK_SIZE_X + y * CHUNK_SIZE_X * CHUNK_SIZE_Z] = block;
    };
    const getLocal = (x: number, y: number, z: number) => spawnChunk[x + z * CHUNK_SIZE_X + y * CHUNK_SIZE_X * CHUNK_SIZE_Z];
    const groundTop = (x: number, z: number) => {
      for (let y = CHUNK_SIZE_Y - 1; y >= 0; y--) if (getLocal(x, y, z) !== BlockType.AIR) return y;
      return 0;
    };

    const setup = worldRef.current;
    if (setup.spawnTrees) {
      for (const [tx, tz] of SPAWN_TREES) {
        const { height } = generator.getTerrainHeight(tx, tz);
        generator.generateOakTree(spawnChunk, tx, height, tz);
      }
    }

    // Chapter structure: flatten its area to one floor height, then build it.
    const interactables: Interactable[] = [];
    let floorY = 0;
    if (setup.structure) {
      const { area } = setup.structure;
      const cx = Math.floor((area.x0 + area.x1) / 2);
      const cz = Math.floor((area.z0 + area.z1) / 2);
      floorY = Math.min(CHUNK_SIZE_Y - 12, Math.max(generator.getTerrainHeight(cx, cz).height, SEA_LEVEL + 1));
      for (let x = area.x0; x <= area.x1; x++) {
        for (let z = area.z0; z <= area.z1; z++) {
          for (let y = 1; y < CHUNK_SIZE_Y; y++) {
            const current = getLocal(x, y, z);
            if (y < floorY - 3) continue;
            if (y < floorY) {
              if (current === BlockType.AIR || current === BlockType.WATER || current === BlockType.WOOD || current === BlockType.LEAVES) {
                setLocal(x, y, z, BlockType.DIRT);
              }
            } else if (y === floorY) {
              setLocal(x, y, z, BlockType.GRASS);
            } else {
              setLocal(x, y, z, BlockType.AIR);
            }
          }
        }
      }
      setup.structure.build(setLocal, floorY);

      for (const d of setup.structure.decor ?? []) {
        const prop = createDecor(d.kind);
        prop.position.set(d.x + 0.5, floorY + d.dy, d.z + 0.5);
        scene.add(prop);
      }
      for (const st of setup.structure.stations) {
        interactables.push({
          id: st.id,
          kind: "station",
          station: st.station,
          label: st.label,
          x: st.x + 0.5,
          y: floorY + st.dy + 0.5,
          z: st.z + 0.5,
        });
      }
    }

    // Characters
    const npcs: Array<{ id: string; mesh: HumanoidMesh; x: number; z: number; tag: THREE.Sprite }> = [];
    for (const def of setup.npcs ?? []) {
      const mesh = createHumanoidMesh(def.look);
      const baseY = groundTop(def.x, def.z) + 1;
      mesh.group.position.set(def.x + 0.5, baseY, def.z + 0.5);
      const tag = createNameTag(def.name.en);
      tag.position.set(def.x + 0.5, baseY + 2.45, def.z + 0.5);
      scene.add(mesh.group);
      scene.add(tag);
      npcs.push({ id: def.id, mesh, x: def.x + 0.5, z: def.z + 0.5, tag });
      interactables.push({ id: def.id, kind: "npc", label: def.name, x: def.x + 0.5, y: baseY + 1, z: def.z + 0.5 });
    }

    // Spawn point and initial facing
    // The first chunks were generated before trees and buildings were stamped;
    // saved free-build edits go on top of all that (and before picking a spawn,
    // so a student lands on their build rather than inside it).
    if (freeBuild) loadedChunks.forEach((blocks, key) => applyEdits(key, blocks));

    // Without a set spawn, start on the dry ground nearest the middle of the
    // chunk, never in a lake or on a treetop.
    const dryGround = (x: number, z: number) => {
      const top = getLocal(x, groundTop(x, z), z);
      return top !== BlockType.WATER && top !== BlockType.LEAVES && top !== BlockType.ICE;
    };
    const nearestDry = () => {
      let best = { x: 8, z: 8 };
      let bestDist = Infinity;
      for (let x = 1; x < CHUNK_SIZE_X - 1; x++) {
        for (let z = 1; z < CHUNK_SIZE_Z - 1; z++) {
          const dist = Math.hypot(x - 8, z - 8);
          if (dist < bestDist && dryGround(x, z)) {
            best = { x, z };
            bestDist = dist;
          }
        }
      }
      return best;
    };
    const spawnAt = setup.spawn ?? nearestDry();
    const lookAt = setup.spawn?.lookAt ?? (setup.spawnTrees ? { x: SPAWN_TREES[0][0], z: SPAWN_TREES[0][1] } : null);
    playerPosition.current.set(spawnAt.x + 0.5, groundTop(spawnAt.x, spawnAt.z) + 1 + PLAYER_HEIGHT, spawnAt.z + 0.5);
    camera.position.copy(playerPosition.current);
    if (lookAt) {
      camera.rotation.y = Math.atan2(-(lookAt.x - spawnAt.x), -(lookAt.z - spawnAt.z));
    }

    let lastPlayerChunkX = Math.floor(playerPosition.current.x / CHUNK_SIZE_X);
    let lastPlayerChunkZ = Math.floor(playerPosition.current.z / CHUNK_SIZE_Z);

    const getBlockAtWorld = (wx: number, wy: number, wz: number): BlockType => {
      const cx = Math.floor(wx / CHUNK_SIZE_X);
      const cz = Math.floor(wz / CHUNK_SIZE_Z);
      const blocks = loadedChunks.get(`${cx},${cz}`);
      if (!blocks) return BlockType.AIR;
      const lx = ((Math.floor(wx) % CHUNK_SIZE_X) + CHUNK_SIZE_X) % CHUNK_SIZE_X;
      const lz = ((Math.floor(wz) % CHUNK_SIZE_Z) + CHUNK_SIZE_Z) % CHUNK_SIZE_Z;
      const ly = Math.floor(wy);
      if (ly < 0 || ly >= CHUNK_SIZE_Y) return BlockType.AIR;
      return blocks[lx + lz * CHUNK_SIZE_X + ly * CHUNK_SIZE_X * CHUNK_SIZE_Z];
    };

    const spawnPig = (wx: number, wz: number) => {
      let sy = 0;
      for (let y = CHUNK_SIZE_Y - 2; y >= 1; y--) {
        if (getBlockAtWorld(wx, y, wz) !== BlockType.AIR) {
          sy = y + 1;
          break;
        }
      }
      if (sy <= 2) return;
      const mobMesh = createPigMesh();
      mobMesh.group.position.set(wx + 0.5, sy, wz + 0.5);
      scene.add(mobMesh.group);
      mobsRef.current.push({
        id: `mob_${Date.now()}_${Math.random()}`,
        type: MobType.PIG,
        group: mobMesh.group,
        head: mobMesh.head,
        leftLegFront: mobMesh.leftLegFront,
        rightLegFront: mobMesh.rightLegFront,
        leftLegBack: mobMesh.leftLegBack,
        rightLegBack: mobMesh.rightLegBack,
        position: mobMesh.group.position,
        velocity: new THREE.Vector3(),
        targetDirection: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(),
        rotationY: Math.random() * Math.PI * 2,
        walkTimer: Math.random() * 3,
        isGrounded: true,
      });
    };

    const PLAYER_RADIUS = 0.3;

    /** Blocks the player can't walk through. Water can be waded through. */
    const isSolidAt = (x: number, y: number, z: number) => {
      const b = getBlockAtWorld(x, y, z);
      return b !== BlockType.AIR && b !== BlockType.WATER;
    };

    const isColliding = (pos: THREE.Vector3): boolean => {
      const radius = PLAYER_RADIUS - 0.01;
      const minX = Math.floor(pos.x - radius);
      const maxX = Math.floor(pos.x + radius);
      const minY = Math.floor(pos.y - PLAYER_HEIGHT + 0.05);
      const maxY = Math.floor(pos.y + 0.15);
      const minZ = Math.floor(pos.z - radius);
      const maxZ = Math.floor(pos.z + radius);
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          for (let z = minZ; z <= maxZ; z++) {
            if (isSolidAt(x, y, z)) return true;
          }
        }
      }
      return false;
    };

    const checkOnGround = (pos: THREE.Vector3): boolean => {
      const radius = PLAYER_RADIUS - 0.01;
      const minX = Math.floor(pos.x - radius);
      const maxX = Math.floor(pos.x + radius);
      const minZ = Math.floor(pos.z - radius);
      const maxZ = Math.floor(pos.z + radius);
      const feetY = Math.floor(pos.y - PLAYER_HEIGHT - 0.01);
      for (let x = minX; x <= maxX; x++) {
        for (let z = minZ; z <= maxZ; z++) {
          if (isSolidAt(x, feetY, z)) return true;
        }
      }
      return false;
    };

    // 6. Chunk meshing
    const chunkMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.05 });
    let atlas: BlockAtlas | null = null;

    const remeshChunk = (cx: number, cz: number) => {
      const key = `${cx},${cz}`;
      const oldMesh = chunkMeshes.get(key);
      if (oldMesh) {
        scene.remove(oldMesh);
        oldMesh.geometry.dispose();
        chunkMeshes.delete(key);
      }
      const geom = buildChunkGeometry(cx, cz, loadedChunks, atlas);
      if (geom) {
        const chunkMesh = new THREE.Mesh(geom, chunkMaterial);
        chunkMesh.castShadow = true;
        chunkMesh.receiveShadow = true;
        scene.add(chunkMesh);
        chunkMeshes.set(key, chunkMesh);
      }
    };

    const setBlockAtWorld = (wx: number, wy: number, wz: number, type: BlockType) => {
      const cx = Math.floor(wx / CHUNK_SIZE_X);
      const cz = Math.floor(wz / CHUNK_SIZE_Z);
      const blocks = loadedChunks.get(`${cx},${cz}`);
      if (!blocks) return;
      const lx = wx - cx * CHUNK_SIZE_X;
      const lz = wz - cz * CHUNK_SIZE_Z;
      const idx = lx + lz * CHUNK_SIZE_X + wy * CHUNK_SIZE_X * CHUNK_SIZE_Z;
      const oldType = blocks[idx];
      blocks[idx] = type;
      freeBuild?.onEdit(`${cx},${cz}`, idx, type);
      if (oldType === BlockType.TORCH) removeTorchEntity(wx, wy, wz);
      if (type === BlockType.TORCH) createTorchEntity(wx, wy, wz);
      remeshChunk(cx, cz);
      if (lx === 0) remeshChunk(cx - 1, cz);
      if (lx === CHUNK_SIZE_X - 1) remeshChunk(cx + 1, cz);
      if (lz === 0) remeshChunk(cx, cz - 1);
      if (lz === CHUNK_SIZE_Z - 1) remeshChunk(cx, cz + 1);
    };

    const updateDynamicChunks = (force = false) => {
      const pChunkX = Math.floor(playerPosition.current.x / CHUNK_SIZE_X);
      const pChunkZ = Math.floor(playerPosition.current.z / CHUNK_SIZE_Z);
      if (!force && pChunkX === lastPlayerChunkX && pChunkZ === lastPlayerChunkZ) return;
      lastPlayerChunkX = pChunkX;
      lastPlayerChunkZ = pChunkZ;

      const dynamicRadius = 2;
      const dynamicUnloadRadius = 3;

      for (let cx = pChunkX - dynamicRadius; cx <= pChunkX + dynamicRadius; cx++) {
        for (let cz = pChunkZ - dynamicRadius; cz <= pChunkZ + dynamicRadius; cz++) {
          const key = `${cx},${cz}`;
          if (!loadedChunks.has(key)) loadedChunks.set(key, applyEdits(key, generator.generateChunk(cx, cz)));
        }
      }
      for (let cx = pChunkX - dynamicRadius; cx <= pChunkX + dynamicRadius; cx++) {
        for (let cz = pChunkZ - dynamicRadius; cz <= pChunkZ + dynamicRadius; cz++) {
          if (!chunkMeshes.has(`${cx},${cz}`)) remeshChunk(cx, cz);
        }
      }
      chunkMeshes.forEach((mesh, key) => {
        const [cx, cz] = key.split(",").map(Number);
        if (Math.abs(cx - pChunkX) > dynamicUnloadRadius || Math.abs(cz - pChunkZ) > dynamicUnloadRadius) {
          scene.remove(mesh);
          mesh.geometry.dispose();
          chunkMeshes.delete(key);
        }
      });
    };

    updateDynamicChunks(true);

    // Textures load in the background; the world shows in plain colors until
    // they arrive, then every chunk is rebuilt with them.
    let disposed = false;
    loadBlockAtlas().then((loaded) => {
      if (disposed || !loaded) return;
      atlas = loaded;
      chunkMaterial.map = loaded.texture;
      chunkMaterial.alphaTest = 0.5; // see-through pixels in leaves
      chunkMaterial.needsUpdate = true;
      for (const key of [...chunkMeshes.keys()]) {
        const [cx, cz] = key.split(",").map(Number);
        remeshChunk(cx, cz);
      }
      // Box faces: +x, -x, +y, -y, +z, -z
      heldView.blockMaterial = (block) => {
        const faces: Array<"side" | "top" | "bottom"> = ["side", "side", "top", "bottom", "side", "side"];
        const tiles = faces.map((f) => loaded.tile(block, f));
        if (tiles.every((t) => t === 0)) return null;
        return tiles.map((t) =>
          t ? new THREE.MeshLambertMaterial({ map: loaded.tileTexture(t) }) : new THREE.MeshLambertMaterial({ color: BLOCK_CONFIGS[block as BlockType]?.color })
        );
      };
      heldView.refresh();
    });

    for (let i = 0; i < (setup.structure ? 0 : 4); i++) {
      spawnPig(Math.floor(6 + (Math.random() - 0.5) * 20), Math.floor(6 + (Math.random() - 0.5) * 20));
    }

    const spawnParticleBurst = (pos: THREE.Vector3, colorHex: number | string = 0xf59e0b, count: number = 10) => {
      const particleGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const particleMat = new THREE.MeshBasicMaterial({ color: colorHex });
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(particleGeom, particleMat);
        mesh.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4));
        scene.add(mesh);
        particlesRef.current.push({
          mesh,
          velocity: new THREE.Vector3((Math.random() - 0.5) * 4.5, Math.random() * 4.0 + 1.5, (Math.random() - 0.5) * 4.5),
          life: 0,
          maxLife: 0.35 + Math.random() * 0.25,
        });
      }
    };

    // 7. Actions shared by mouse clicks and on-screen buttons
    const targetedBlock = () => {
      if (!cameraRef.current) return null;
      raycaster.setFromCamera(SCREEN_CENTER, cameraRef.current);
      // Look through water, so blocks under or behind it can be reached.
      for (const hit of raycaster.intersectObjects(Array.from(chunkMeshes.values()))) {
        if (hit.distance > 5.5 || !hit.face) return null;
        const inside = hit.point.clone().sub(hit.face.normal.clone().multiplyScalar(0.5));
        if (getBlockAtWorld(Math.floor(inside.x), Math.floor(inside.y), Math.floor(inside.z)) !== BlockType.WATER) return hit;
      }
      return null;
    };

    /** The block under the crosshair, if any is within reach. */
    const blockUnderCrosshair = () => {
      const hit = targetedBlock();
      if (!hit) return null;
      const target = hit.point.clone().sub(hit.face!.normal.clone().multiplyScalar(0.5));
      const bx = Math.floor(target.x);
      const by = Math.floor(target.y);
      const bz = Math.floor(target.z);
      if (by <= 0) return null; // bedrock
      return { bx, by, bz, block: getBlockAtWorld(bx, by, bz) };
    };

    const heldItem = () => {
      const slot = hotbarRef.current[activeSlotIndexRef.current];
      return slot?.itemId ? ITEM_REGISTRY[slot.itemId] ?? null : null;
    };

    /** Remove a block and drop its item, if the held tool can harvest it. */
    const breakBlockAt = (bx: number, by: number, bz: number) => {
      const activeItemDef = heldItem();
      const oldBlock = getBlockAtWorld(bx, by, bz);
      if (!Number.isFinite(breakSeconds(oldBlock, activeItemDef, freeBuild !== null))) return; // bedrock, water, workshop
      setBlockAtWorld(bx, by, bz, BlockType.AIR);
      playSoundEffect("block_break");
      spawnParticleBurst(new THREE.Vector3(bx + 0.5, by + 0.5, bz + 0.5), 0x94a3b8, 10);

      const heldToolType = activeItemDef?.toolType || "none";
      const dropConfig = BLOCK_DROP_TABLE[oldBlock];
      const toolOk = !dropConfig || dropConfig.requiredTool === "none" || dropConfig.requiredTool === heldToolType;
      if (dropConfig && dropConfig.itemId && toolOk) {
        const count = Math.floor(Math.random() * (dropConfig.maxCount - dropConfig.minCount + 1)) + dropConfig.minCount;
        for (let i = 0; i < count; i++) {
          spawnItemDrop(
            dropConfig.itemId,
            new THREE.Vector3(bx + 0.5, by + 0.5, bz + 0.5),
            new THREE.Vector3((Math.random() - 0.5) * 2.0, 2.5 + Math.random() * 1.5, (Math.random() - 0.5) * 2.0)
          );
        }
      }
      if (activeItemDef?.type === "tool") onToolUsedRef.current?.(activeSlotIndexRef.current);
    };

    /**
     * Tapping an animal startles it: it squeals, hops and runs off for a moment.
     * There is no combat; animals can't be hurt. Returns whether one was tapped.
     */
    const ANIMAL_REACH = 4.5;
    const startleAnimal = () => {
      if (!cameraRef.current || mobsRef.current.length === 0) return false;
      raycaster.setFromCamera(SCREEN_CENTER, cameraRef.current);
      const hit = raycaster.intersectObjects(mobsRef.current.map((m) => m.group), true)[0];
      if (!hit || hit.distance > ANIMAL_REACH) return false;
      const block = targetedBlock();
      if (block && block.distance < hit.distance) return false;
      const mob = mobsRef.current.find((m) => {
        let o: THREE.Object3D | null = hit.object;
        while (o && o !== m.group) o = o.parent;
        return o === m.group;
      });
      if (!mob) return false;
      const away = mob.position.clone().sub(playerPosition.current).setY(0);
      if (away.lengthSq() < 1e-6) away.set(1, 0, 0);
      away.normalize();
      mob.targetDirection.copy(away);
      mob.rotationY = Math.atan2(away.x, away.z);
      mob.scared = 2.2;
      mob.walkTimer = 2.2;
      if (mob.isGrounded) {
        mob.velocity.y = 5;
        mob.isGrounded = false;
      }
      playSoundEffect("oink");
      return true;
    };

    // Breaking takes a hold: the game loop counts up while the button, mouse
    // button or finger stays down, and breaks the block when time is up.
    const breaking = { held: false, key: "", elapsed: 0 };
    const startBreaking = () => {
      if (!inputEnabledRef.current) return;
      if (startleAnimal()) return;
      breaking.held = true;
    };
    const stopBreaking = () => {
      breaking.held = false;
      breaking.key = "";
      breaking.elapsed = 0;
      crackMesh.visible = false;
    };

    const updateBreaking = (delta: number) => {
      const target = breaking.held && inputEnabledRef.current ? blockUnderCrosshair() : null;
      const seconds = target ? breakSeconds(target.block, heldItem(), freeBuild !== null) : Infinity;
      if (!target || !Number.isFinite(seconds)) {
        breaking.key = "";
        breaking.elapsed = 0;
        crackMesh.visible = false;
        if (!inputEnabledRef.current) breaking.held = false;
        return;
      }
      const key = `${target.bx},${target.by},${target.bz}`;
      if (key !== breaking.key) {
        breaking.key = key;
        breaking.elapsed = 0;
      }
      breaking.elapsed += delta;
      if (breaking.elapsed >= seconds) {
        breakBlockAt(target.bx, target.by, target.bz);
        breaking.key = "";
        breaking.elapsed = 0;
        crackMesh.visible = false;
        return;
      }
      crackMesh.position.set(target.bx + 0.5, target.by + 0.5, target.bz + 0.5);
      crackMaterial.opacity = 0.1 + 0.5 * (breaking.elapsed / seconds);
      crackMesh.visible = true;
    };

    /** Use the targeted block (crafting table) or place the held block. */
    const secondaryAction = () => {
      if (!inputEnabledRef.current) return;
      const hit = targetedBlock();
      if (!hit) return;
      const target = hit.point.clone().sub(hit.face!.normal.clone().multiplyScalar(0.5));
      const targetType = getBlockAtWorld(Math.floor(target.x), Math.floor(target.y), Math.floor(target.z));
      if (targetType === BlockType.CRAFTING_TABLE) {
        onOpenCraftingTableRef.current?.();
        return;
      }
      if (STATION_BLOCKS[targetType]) {
        // Stations are used through the on-screen prompt; never build on them.
        return;
      }

      const place = hit.point.clone().add(hit.face!.normal.clone().multiplyScalar(0.5));
      const px = Math.floor(place.x);
      const py = Math.floor(place.y);
      const pz = Math.floor(place.z);
      if (py < 0 || py >= CHUNK_SIZE_Y) return;

      const p = playerPosition.current;
      const overlapsPlayer =
        px + 1 > p.x - PLAYER_RADIUS && px < p.x + PLAYER_RADIUS &&
        py + 1 > p.y - PLAYER_HEIGHT && py < p.y + 0.15 &&
        pz + 1 > p.z - PLAYER_RADIUS && pz < p.z + PLAYER_RADIUS;
      if (overlapsPlayer || activeBlockRef.current === BlockType.AIR) return;

      setBlockAtWorld(px, py, pz, activeBlockRef.current);
      const heldId = hotbarRef.current[activeSlotIndexRef.current]?.itemId ?? "";
      onBlockPlacedRef.current();
      heldView.punch();
      onGameEventRef.current({ type: "placed", blockItemId: heldId });
    };

    /** Lift the player to the surface if they fall into a hole or get boxed in. */
    const unstuck = () => {
      const x = Math.floor(playerPosition.current.x);
      const z = Math.floor(playerPosition.current.z);
      let safeY = 24;
      for (let y = CHUNK_SIZE_Y - 1; y >= 0; y--) {
        if (getBlockAtWorld(x, y, z) !== BlockType.AIR) {
          safeY = y + 1;
          break;
        }
      }
      playerPosition.current.y = safeY + PLAYER_HEIGHT;
      playerVelocity.current.set(0, 0, 0);
    };

    // Test hook for automated browser checks; only exists with ?debug=1.
    const debug = new URLSearchParams(window.location.search).has("debug");
    if (debug) {
      (window as unknown as { __ppTeleport?: (x: number, z: number, yaw?: number) => void }).__ppTeleport = (x, z, yaw) => {
        playerPosition.current.set(x + 0.5, playerPosition.current.y + 1, z + 0.5);
        unstuck();
        if (yaw !== undefined && cameraRef.current) cameraRef.current.rotation.y = yaw;
      };
      (window as unknown as { __ppLook?: (yaw: number, pitch: number) => void }).__ppLook = (yaw, pitch) => {
        if (!cameraRef.current) return;
        cameraRef.current.rotation.y = yaw;
        cameraRef.current.rotation.x = pitch;
      };
      (window as unknown as { __ppTarget?: () => unknown }).__ppTarget = () => ({
        target: blockUnderCrosshair(),
        pitch: cameraRef.current?.rotation.x ?? 0,
        breaking: { ...breaking },
        player: playerPosition.current.toArray(),
        held: hotbarRef.current[activeSlotIndexRef.current]?.itemId ?? "",
        activeBlock: activeBlockRef.current,
      });
    }

    gameActions.breakStart = startBreaking;
    gameActions.breakStop = stopBreaking;
    gameActions.secondary = secondaryAction;
    gameActions.unstuck = unstuck;

    // Look rotation, accumulated so "look around" objectives can measure it.
    let lookAccum = 0;
    const applyLook = (dx: number, dy: number, sensitivity: number) => {
      if (!cameraRef.current) return;
      cameraRef.current.rotation.y -= dx * sensitivity;
      cameraRef.current.rotation.x -= dy * sensitivity;
      // Almost straight up or down; exactly 90 degrees would flip the view.
      const maxPitch = Math.PI / 2 - 0.01;
      cameraRef.current.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, cameraRef.current.rotation.x));
      lookAccum += Math.abs(dx * sensitivity);
    };

    // 8. Keyboard
    const setMoveKey = (code: string, down: boolean) => {
      switch (code) {
        case "KeyW":
        case "ArrowUp":
          keysPressed.current.w = down;
          return true;
        case "KeyA":
        case "ArrowLeft":
          keysPressed.current.a = down;
          return true;
        case "KeyS":
        case "ArrowDown":
          keysPressed.current.s = down;
          return true;
        case "KeyD":
        case "ArrowRight":
          keysPressed.current.d = down;
          return true;
        case "Space":
          keysPressed.current.Space = down;
          return true;
      }
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      // The bag key works whether or not the bag is open, so it can close it too.
      if (e.code === "KeyE") {
        onToggleInventoryRef.current();
        return;
      }
      if (!inputEnabledRef.current) return;
      if (setMoveKey(e.code, true)) {
        if (e.code === "Space") e.preventDefault();
        return;
      }
      if (e.code.startsWith("Digit")) {
        const n = parseInt(e.code.slice(5), 10);
        if (n >= 1 && n <= 9) onActiveSlotIndexChangeRef.current(n - 1);
        return;
      }
      if (e.code === "KeyR") {
        unstuck();
        return;
      }
      if (e.code === "KeyQ" && cameraRef.current) {
        const currentSlot = hotbarRef.current[activeSlotIndexRef.current];
        if (currentSlot && currentSlot.itemId !== "" && currentSlot.count > 0) {
          const spawnDir = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion);
          const dropPos = playerPosition.current.clone().addScaledVector(spawnDir, 1.2);
          dropPos.y = cameraRef.current.position.y - 0.3;
          const scatterVel = spawnDir.clone().multiplyScalar(4.0).add(new THREE.Vector3(
            (Math.random() - 0.5) * 1.0,
            1.5 + Math.random() * 1.5,
            (Math.random() - 0.5) * 1.0
          ));
          spawnItemDrop(currentSlot.itemId, dropPos, scatterVel);
          onItemDroppedFromHotbarRef.current();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setMoveKey(e.code, false);
    };

    // 9. Mouse: pointer-locked play on desktops; drag-to-look for a mouse on touch devices.
    let isMouseDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (!document.pointerLockElement || !inputEnabledRef.current) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      onActiveSlotIndexChangeRef.current((activeSlotIndexRef.current + dir + 9) % 9);
    };

    // In touch mode a mouse or trackpad (an iPad with a keyboard case) has no
    // pointer lock: hold the left button to break, drag to look around (which
    // cancels the break), and right-click or two-finger click to place.
    const DRAG_CANCELS_BREAK_PX = 8;
    let mouseDownX = 0;
    let mouseDownY = 0;
    let lastRightDown = -Infinity;

    const handleContextMenu = (e: MouseEvent) => {
      if (e.target !== canvas) return;
      e.preventDefault();
      // Some trackpads only send this, without a right-button mousedown.
      if (!document.pointerLockElement && inputModeRef.current === "touch" && e.timeStamp - lastRightDown > 400) {
        secondaryAction();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target !== canvas || !inputEnabledRef.current) return;
      if (document.pointerLockElement === canvas) {
        if (e.button === 0) startBreaking();
        else if (e.button === 2) secondaryAction();
        return;
      }
      if (inputModeRef.current !== "touch") return;
      if (e.button === 2) {
        lastRightDown = e.timeStamp;
        secondaryAction();
        return;
      }
      if (e.button !== 0) return;
      isMouseDragging = true;
      lastMouseX = mouseDownX = e.clientX;
      lastMouseY = mouseDownY = e.clientY;
      startBreaking();
    };

    const handleMouseUp = () => {
      isMouseDragging = false;
      stopBreaking();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!inputEnabledRef.current) return;
      if (document.pointerLockElement === canvas) {
        applyLook(e.movementX, e.movementY, MOUSE_SENSITIVITY);
      } else if (isMouseDragging && e.buttons !== 0) {
        applyLook(e.clientX - lastMouseX, e.clientY - lastMouseY, MOUSE_SENSITIVITY * 1.5);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        if (breaking.held && Math.hypot(e.clientX - mouseDownX, e.clientY - mouseDownY) > DRAG_CANCELS_BREAK_PX) stopBreaking();
      } else {
        isMouseDragging = false;
      }
    };

    // 10. Touch: drag anywhere on the game view to look around.
    let lookPointerId: number | null = null;
    let lastTouchX = 0;
    let lastTouchY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || lookPointerId !== null) return;
      e.preventDefault(); // also suppresses the emulated mouse events
      lookPointerId = e.pointerId;
      lastTouchX = e.clientX;
      lastTouchY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== lookPointerId) return;
      touchInput.lookDX += e.clientX - lastTouchX;
      touchInput.lookDY += e.clientY - lastTouchY;
      lastTouchX = e.clientX;
      lastTouchY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId === lookPointerId) lookPointerId = null;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    const handlePointerLockChange = () => {
      onLockChangeRef.current(document.pointerLockElement === canvas);
    };
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    // 11. Sky for the fixed time of day
    {
      const sunAngle = TIME_OF_DAY * 2 * Math.PI - Math.PI / 2;
      const sunHeight = Math.sin(sunAngle);
      sunLight.intensity = Math.max(0.05, sunHeight * 1.35);
      sunLight.color.setHSL(0.1, 0.6, 0.9);
      scene.background = new THREE.Color("#60a5fa");
      (scene.fog as THREE.FogExp2).color.set("#93c5fd");
      ambientLight.intensity = THREE.MathUtils.lerp(0.18, 0.65, Math.max(0, sunHeight));
    }

    // 12. Game loop
    let lastTime = performance.now();
    let frameCount = 0;
    let walkAccum = 0;
    let focusedId: string | null = null;

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const time = performance.now();
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      if (suspendedRef.current) return;
      frameCount++;

      const cam = cameraRef.current;
      if (!cam) return;

      updateDynamicChunks();

      const px = playerPosition.current.x;
      const pz = playerPosition.current.z;

      // Sun follows the player so it stays in the sky
      const sunAngle = TIME_OF_DAY * 2 * Math.PI - Math.PI / 2;
      const sunX = px + Math.cos(sunAngle) * 220;
      const sunY = Math.sin(sunAngle) * 220;
      const sunZ = pz + Math.sin(sunAngle * 0.5) * 60;
      sunMesh.position.set(sunX, sunY, sunZ);
      sunMesh.lookAt(px, playerPosition.current.y, pz);
      sunLight.position.set(sunX, Math.max(10, sunY), sunZ);
      sunLight.target.position.set(px, 0, pz);
      sunLight.target.updateMatrixWorld();

      if (frameCount % 2 === 0) {
        const nowSec = performance.now() * 0.005;
        torchLightsRef.current.forEach(({ light }, key) => {
          light.intensity = 1.4 + Math.sin(nowSec * 3 + key.length) * 0.25;
        });
      }

      // Item drops
      const currentTicks = performance.now();
      itemDropsRef.current.forEach((item) => {
        if (!item.onGround) {
          item.velocity.y -= 9.8 * delta;
          item.position.addScaledVector(item.velocity, delta);
          const ix = Math.floor(item.position.x);
          const iz = Math.floor(item.position.z);
          const currentBlock = getBlockAtWorld(ix, Math.floor(item.position.y), iz);
          const belowBlock = getBlockAtWorld(ix, Math.floor(item.position.y - 0.05), iz);
          if (currentBlock !== BlockType.AIR) {
            item.position.y = Math.ceil(item.position.y);
            item.velocity.set(0, 0, 0);
            item.onGround = true;
          } else if (belowBlock !== BlockType.AIR && item.velocity.y <= 0) {
            item.position.y = Math.floor(item.position.y);
            item.velocity.set(0, 0, 0);
            item.onGround = true;
          }
        }
        item.mesh.rotation.y += delta * 2.5;
        item.mesh.rotation.x += delta * 0.5;
        item.mesh.position.copy(item.position);
        item.mesh.position.y += Math.sin((currentTicks - item.spawnTime) * 0.004) * 0.08;

        // Pull nearby items toward the player and pick them up.
        // A wider radius than usual makes pickup forgiving on touch screens.
        const distToPlayer = item.mesh.position.distanceTo(playerPosition.current);
        if (distToPlayer < 3.5 && currentTicks - item.spawnTime > 500) {
          const pullDir = playerPosition.current.clone().sub(item.mesh.position).normalize();
          item.position.addScaledVector(pullDir, delta * 8.0);
          item.mesh.position.copy(item.position);
          item.onGround = false;
          if (distToPlayer < 0.9 && onItemPickedUpRef.current(item.itemId, 1)) {
            item.toRemove = true;
            playSoundEffect("pickup");
            onGameEventRef.current({ type: "collected", itemId: item.itemId, count: 1 });
          }
        }
      });

      const disposeMesh = (mesh: THREE.Mesh) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
        else mesh.material.dispose();
      };
      itemDropsRef.current = itemDropsRef.current.filter((item) => {
        if (item.toRemove) disposeMesh(item.mesh);
        return !item.toRemove;
      });
      while (itemDropsRef.current.length > 60) {
        const removed = itemDropsRef.current.shift();
        if (removed) disposeMesh(removed.mesh);
      }

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life += delta;
        p.velocity.y -= 15 * delta;
        p.mesh.position.addScaledVector(p.velocity, delta);
        p.mesh.scale.setScalar(Math.max(0, 1 - p.life / p.maxLife));
        if (p.life >= p.maxLife) {
          disposeMesh(p.mesh);
          particlesRef.current.splice(i, 1);
        }
      }

      // Ambient animals
      if (frameCount % 120 === 0 && mobsRef.current.length < 6) {
        const spawnAngle = Math.random() * Math.PI * 2;
        const spawnDist = 10 + Math.random() * 12;
        spawnPig(Math.floor(px + Math.cos(spawnAngle) * spawnDist), Math.floor(pz + Math.sin(spawnAngle) * spawnDist));
      }

      for (let i = mobsRef.current.length - 1; i >= 0; i--) {
        const mob = mobsRef.current[i];
        if (mob.position.distanceTo(playerPosition.current) > 38) {
          scene.remove(mob.group);
          mobsRef.current.splice(i, 1);
          continue;
        }

        mob.walkTimer -= delta;
        if (mob.scared) mob.scared = Math.max(0, mob.scared - delta);
        if (mob.walkTimer <= 0) {
          mob.walkTimer = 2.5 + Math.random() * 3.5;
          if (Math.random() < 0.7) {
            mob.targetDirection.set(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
            mob.rotationY = Math.atan2(mob.targetDirection.x, mob.targetDirection.z);
          } else {
            mob.targetDirection.set(0, 0, 0);
          }
        }

        const mobSpeed = mob.scared ? 4.5 : 1.8;
        mob.velocity.x = mob.targetDirection.x * mobSpeed;
        mob.velocity.z = mob.targetDirection.z * mobSpeed;
        mob.velocity.y -= GRAVITY * delta;
        mob.position.y += mob.velocity.y * delta;

        const mobBx = Math.floor(mob.position.x);
        const mobBz = Math.floor(mob.position.z);
        const feetBlockY = Math.floor(mob.position.y - 0.05);
        if (getBlockAtWorld(mobBx, feetBlockY, mobBz) !== BlockType.AIR) {
          mob.position.y = feetBlockY + 1;
          mob.velocity.y = 0;
          mob.isGrounded = true;
        } else {
          mob.isGrounded = false;
        }

        mob.position.x += mob.velocity.x * delta;
        mob.position.z += mob.velocity.z * delta;

        if (getBlockAtWorld(mobBx, Math.floor(mob.position.y + 0.5), mobBz) !== BlockType.AIR && mob.isGrounded) {
          mob.velocity.y = JUMP_FORCE * 0.85;
          mob.isGrounded = false;
        }

        mob.group.rotation.y = mob.rotationY;
        const isMoving = mob.velocity.x !== 0 || mob.velocity.z !== 0;
        const swingAngle = Math.sin(performance.now() * 0.008) * 0.6;
        if (mob.leftLegFront) mob.leftLegFront.rotation.x = isMoving ? swingAngle : 0;
        if (mob.rightLegFront) mob.rightLegFront.rotation.x = isMoving ? -swingAngle : 0;
        if (mob.leftLegBack) mob.leftLegBack.rotation.x = isMoving ? -swingAngle : 0;
        if (mob.rightLegBack) mob.rightLegBack.rotation.x = isMoving ? swingAngle : 0;
      }

      // Characters turn toward the player when nearby
      for (const npc of npcs) {
        const dx = playerPosition.current.x - npc.x;
        const dz = playerPosition.current.z - npc.z;
        const dist = Math.hypot(dx, dz);
        const target = dist < 8 ? Math.atan2(dx, dz) : npc.mesh.group.rotation.y;
        let diff = target - npc.mesh.group.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        npc.mesh.group.rotation.y += diff * Math.min(1, delta * 4);
        const idle = Math.sin(performance.now() * 0.002 + npc.x) * 0.06;
        npc.mesh.leftArm.rotation.x = idle;
        npc.mesh.rightArm.rotation.x = -idle;
      }

      // Nearest station or character within reach
      if (frameCount % 6 === 0 && interactables.length > 0) {
        let best: Interactable | null = null;
        let bestDist = INTERACT_RANGE;
        for (const it of interactables) {
          const dist = Math.hypot(playerPosition.current.x - it.x, playerPosition.current.z - it.z);
          const dy = Math.abs(playerPosition.current.y - PLAYER_HEIGHT - (it.y - 0.5));
          if (dist < bestDist && dy < 2.5) {
            best = it;
            bestDist = dist;
          }
        }
        if ((best?.id ?? null) !== focusedId) {
          focusedId = best?.id ?? null;
          onFocusChangeRef.current(best);
        }
      }

      // Player input
      const enabled = inputEnabledRef.current;
      if (enabled && (touchInput.lookDX !== 0 || touchInput.lookDY !== 0)) {
        applyLook(touchInput.lookDX, touchInput.lookDY, TOUCH_SENSITIVITY);
      }
      touchInput.lookDX = 0;
      touchInput.lookDY = 0;

      const yaw = cam.rotation.y;
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      const moveDirection = new THREE.Vector3();
      let speedScale = 1;

      if (enabled) {
        if (keysPressed.current.w) moveDirection.add(forward);
        if (keysPressed.current.s) moveDirection.sub(forward);
        if (keysPressed.current.d) moveDirection.add(right);
        if (keysPressed.current.a) moveDirection.sub(right);
        if (moveDirection.lengthSq() === 0 && (touchInput.moveX !== 0 || touchInput.moveY !== 0)) {
          moveDirection.addScaledVector(forward, touchInput.moveY).addScaledVector(right, touchInput.moveX);
          // Joystick tilt controls speed; full tilt matches keyboard speed.
          speedScale = Math.min(1, Math.hypot(touchInput.moveX, touchInput.moveY));
        }
      }

      // In water from the waist down, or with feet just above the surface (so a
      // swimmer can still push up onto the bank).
      const pp = playerPosition.current;
      const waterAt = (dy: number) =>
        getBlockAtWorld(Math.floor(pp.x), Math.floor(pp.y - PLAYER_HEIGHT + dy), Math.floor(pp.z)) === BlockType.WATER;
      const inWater = waterAt(0.6) || waterAt(-0.5);
      if (inWater) speedScale *= WATER_SPEED;

      if (moveDirection.lengthSq() > 0) {
        moveDirection.normalize();
        playerVelocity.current.x = moveDirection.x * SPEED * speedScale;
        playerVelocity.current.z = moveDirection.z * SPEED * speedScale;
      } else {
        playerVelocity.current.x = 0;
        playerVelocity.current.z = 0;
      }

      if (checkOnGround(playerPosition.current)) {
        isGrounded.current = true;
        if (playerVelocity.current.y < 0) playerVelocity.current.y = 0;
      } else {
        isGrounded.current = false;
      }
      if (inWater) {
        if (!isGrounded.current) playerVelocity.current.y = Math.max(playerVelocity.current.y - GRAVITY * 0.2 * delta, -WATER_SINK);
      } else if (!isGrounded.current) {
        playerVelocity.current.y -= GRAVITY * delta;
      }

      const wantsJump = enabled && (keysPressed.current.Space || touchInput.jump);
      if (wantsJump && inWater) {
        playerVelocity.current.y = SWIM_UP;
        isGrounded.current = false;
      } else if (wantsJump && isGrounded.current) {
        playerVelocity.current.y = JUMP_FORCE;
        isGrounded.current = false;
      }

      const beforeX = playerPosition.current.x;
      const beforeZ = playerPosition.current.z;

      // Axis-by-axis AABB collision
      if (playerVelocity.current.x !== 0) {
        playerPosition.current.x += playerVelocity.current.x * delta;
        if (isColliding(playerPosition.current)) {
          playerPosition.current.x = playerVelocity.current.x > 0
            ? Math.floor(playerPosition.current.x + PLAYER_RADIUS) - PLAYER_RADIUS - 0.001
            : Math.floor(playerPosition.current.x - PLAYER_RADIUS) + 1.0 + PLAYER_RADIUS + 0.001;
          playerVelocity.current.x = 0;
        }
      }
      if (playerVelocity.current.z !== 0) {
        playerPosition.current.z += playerVelocity.current.z * delta;
        if (isColliding(playerPosition.current)) {
          playerPosition.current.z = playerVelocity.current.z > 0
            ? Math.floor(playerPosition.current.z + PLAYER_RADIUS) - PLAYER_RADIUS - 0.001
            : Math.floor(playerPosition.current.z - PLAYER_RADIUS) + 1.0 + PLAYER_RADIUS + 0.001;
          playerVelocity.current.z = 0;
        }
      }
      if (playerVelocity.current.y !== 0) {
        playerPosition.current.y += playerVelocity.current.y * delta;
        if (isColliding(playerPosition.current)) {
          if (playerVelocity.current.y > 0) {
            playerPosition.current.y = Math.floor(playerPosition.current.y + 0.15) - 0.15 - 0.001;
          } else {
            playerPosition.current.y = Math.floor(playerPosition.current.y - PLAYER_HEIGHT + 0.05) + 1.0 + PLAYER_HEIGHT;
            isGrounded.current = true;
          }
          playerVelocity.current.y = 0;
        }
      }

      walkAccum += Math.hypot(playerPosition.current.x - beforeX, playerPosition.current.z - beforeZ);
      cam.position.copy(playerPosition.current);

      // Report movement a few times per second for objectives.
      if (frameCount % 15 === 0) {
        if (walkAccum > 0.01) onGameEventRef.current({ type: "walked", distance: walkAccum });
        if (lookAccum > 0.001) onGameEventRef.current({ type: "looked", angle: lookAccum });
        walkAccum = 0;
        lookAccum = 0;
      }

      updateBreaking(delta);
      heldView.update(hotbarRef.current[activeSlotIndexRef.current]?.itemId ?? "", delta, {
        touch: inputModeRef.current === "touch",
        walking: enabled && moveDirection.lengthSq() > 0 && isGrounded.current,
        breaking: breaking.held && crackMesh.visible,
      });

      // Outline the block under the crosshair
      if (enabled) {
        const hit = targetedBlock();
        if (hit) {
          const t = hit.point.clone().sub(hit.face!.normal.clone().multiplyScalar(0.5));
          selectionBox.position.set(Math.floor(t.x) + 0.5, Math.floor(t.y) + 0.5, Math.floor(t.z) + 0.5);
          selectionBox.visible = true;
        } else {
          selectionBox.visible = false;
        }
      } else {
        selectionBox.visible = false;
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cam);
      }
    };

    animate();

    return () => {
      disposed = true;
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);

      if (gameActions.breakStart === startBreaking) {
        gameActions.breakStart = null;
        gameActions.breakStop = null;
        gameActions.secondary = null;
        gameActions.unstuck = null;
      }
      resetTouchInput();
      onFocusChangeRef.current(null);

      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      rendererRef.current?.dispose();

      chunkMeshes.forEach((mesh) => mesh.geometry.dispose());
      chunkMaterial.dispose();
      selectionGeometry.dispose();
      selectionMaterial.dispose();

      itemDropsRef.current.forEach((item) => {
        scene.remove(item.mesh);
        item.mesh.geometry.dispose();
        if (Array.isArray(item.mesh.material)) item.mesh.material.forEach((m) => m.dispose());
        else item.mesh.material.dispose();
      });
      itemDropsRef.current = [];
      mobsRef.current = [];
      particlesRef.current = [];
      torchLightsRef.current.clear();
    };
  }, [spawnDropExternalRef]);

  return (
    <div id="game-container" ref={containerRef} className="relative h-full w-full touch-none select-none overflow-hidden bg-slate-900">
      <canvas id="canvas-mount" ref={canvasRef} className="block h-full w-full touch-none outline-none" />
    </div>
  );
}
