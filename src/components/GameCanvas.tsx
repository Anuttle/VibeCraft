import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { BlockType, InventorySlot } from "../types";
import { TerrainGenerator, CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z } from "../utils/terrain";
import { buildChunkGeometry } from "../utils/meshing";
import { ITEM_REGISTRY, BLOCK_DROP_TABLE } from "../utils/items";
import { MobEntity, MobType, createPigMesh, createZombieMesh, playSoundEffect } from "../utils/mobs";

interface GameCanvasProps {
  onLockChange: (isLocked: boolean) => void;
  isLocked: boolean;
  onPositionChange: (pos: THREE.Vector3, dir: string, biomeName?: string) => void;
  activeBlock: BlockType;
  hotbar: InventorySlot[];
  activeSlotIndex: number;
  onActiveSlotIndexChange: (idx: number) => void;
  onBlockPlaced: () => void;
  onItemPickedUp: (itemId: string, count: number) => boolean;
  onItemDroppedFromHotbar: () => void;
  onToggleInventory: () => void;
  onToolUsed?: (slotIndex: number) => void;
  onTimeUpdate?: (timeVal: number, phase: string, formatted: string) => void;
  cycleTimeExternalRef?: React.MutableRefObject<(() => void) | null>;
  spawnDropExternalRef: React.MutableRefObject<((itemId: string, count: number) => void) | null>;
  onPlayerHurt?: (damageAmount: number) => void;
  onMobKilled?: () => void;
  onEatFood?: () => void;
  onOpenCraftingTable?: () => void;
}

export default function GameCanvas({
  onLockChange,
  isLocked,
  onPositionChange,
  activeBlock,
  hotbar,
  activeSlotIndex,
  onActiveSlotIndexChange,
  onBlockPlaced,
  onItemPickedUp,
  onItemDroppedFromHotbar,
  onToggleInventory,
  onToolUsed,
  onTimeUpdate,
  cycleTimeExternalRef,
  spawnDropExternalRef,
  onPlayerHurt,
  onMobKilled,
  onEatFood,
  onOpenCraftingTable,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync inventory refs to avoid stale closures in event listeners
  const hotbarRef = useRef<InventorySlot[]>(hotbar);
  const activeSlotIndexRef = useRef<number>(activeSlotIndex);

  // Sync callbacks via refs to prevent resetting Three.js on prop changes
  const onLockChangeRef = useRef(onLockChange);
  const onPositionChangeRef = useRef(onPositionChange);
  const onActiveSlotIndexChangeRef = useRef(onActiveSlotIndexChange);
  const onBlockPlacedRef = useRef(onBlockPlaced);
  const onItemPickedUpRef = useRef(onItemPickedUp);
  const onItemDroppedFromHotbarRef = useRef(onItemDroppedFromHotbar);
  const onToggleInventoryRef = useRef(onToggleInventory);
  const onToolUsedRef = useRef(onToolUsed);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onPlayerHurtRef = useRef(onPlayerHurt);
  const onMobKilledRef = useRef(onMobKilled);
  const onEatFoodRef = useRef(onEatFood);
  const onOpenCraftingTableRef = useRef(onOpenCraftingTable);

  // Time of Day state: 0.5 = Noon, 0.75 = Sunset, 0.0/1.0 = Midnight, 0.25 = Sunrise
  const timeOfDayRef = useRef<number>(0.5);
  // Torch point lights registry
  const torchLightsRef = useRef<Map<string, { group: THREE.Group; light: THREE.PointLight }>>(new Map());

  // Milestone 9: Active Mob Entities & Particle Systems
  const mobsRef = useRef<MobEntity[]>([]);
  const particlesRef = useRef<{ mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; maxLife: number }[]>([]);

  useEffect(() => {
    hotbarRef.current = hotbar;
  }, [hotbar]);

  useEffect(() => {
    activeSlotIndexRef.current = activeSlotIndex;
  }, [activeSlotIndex]);

  useEffect(() => { onLockChangeRef.current = onLockChange; }, [onLockChange]);
  useEffect(() => { onPositionChangeRef.current = onPositionChange; }, [onPositionChange]);
  useEffect(() => { onActiveSlotIndexChangeRef.current = onActiveSlotIndexChange; }, [onActiveSlotIndexChange]);
  useEffect(() => { onBlockPlacedRef.current = onBlockPlaced; }, [onBlockPlaced]);
  useEffect(() => { onItemPickedUpRef.current = onItemPickedUp; }, [onItemPickedUp]);
  useEffect(() => { onItemDroppedFromHotbarRef.current = onItemDroppedFromHotbar; }, [onItemDroppedFromHotbar]);
  useEffect(() => { onToggleInventoryRef.current = onToggleInventory; }, [onToggleInventory]);
  useEffect(() => { onToolUsedRef.current = onToolUsed; }, [onToolUsed]);
  useEffect(() => { onTimeUpdateRef.current = onTimeUpdate; }, [onTimeUpdate]);
  useEffect(() => { onPlayerHurtRef.current = onPlayerHurt; }, [onPlayerHurt]);
  useEffect(() => { onMobKilledRef.current = onMobKilled; }, [onMobKilled]);
  useEffect(() => { onEatFoodRef.current = onEatFood; }, [onEatFood]);
  useEffect(() => { onOpenCraftingTableRef.current = onOpenCraftingTable; }, [onOpenCraftingTable]);


  // References for game loop & controls
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Movement physics variables
  const keysPressed = useRef<{ [key: string]: boolean }>({
    w: false,
    a: false,
    s: false,
    d: false,
    Space: false,
  });

  const playerVelocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const playerPosition = useRef<THREE.Vector3>(new THREE.Vector3(0.5, 32, 0.5)); // Spawn position resolved dynamically below
  const isGrounded = useRef<boolean>(true);

  // World Item Drops list
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


  // Constants for movement
  const SPEED = 8.0; // Units per second
  const JUMP_FORCE = 8.5;
  const GRAVITY = 24.0;
  const PLAYER_HEIGHT = 1.8; // Eyes level height

  const activeBlockRef = useRef<BlockType>(activeBlock);
  useEffect(() => {
    activeBlockRef.current = activeBlock;
  }, [activeBlock]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#87CEEB"); // Beautiful Sky Blue
    scene.fog = new THREE.FogExp2("#87CEEB", 0.015);
    sceneRef.current = scene;

    // Helper to generate a 3D mini-cube representing a world item drop
    const createItemDropMesh = (itemId: string, itemColor: string): THREE.Mesh => {
      const geom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const mat = new THREE.MeshLambertMaterial({
        color: new THREE.Color(itemColor),
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // Helper to spawn 3D physical item drops (Milestone 6 / 7)
    const spawnItemDrop = (itemId: string, pos: THREE.Vector3, velocity: THREE.Vector3) => {
      const itemDef = ITEM_REGISTRY[itemId];
      if (!itemDef) return;

      const itemMesh = createItemDropMesh(itemId, itemDef.color);
      itemMesh.position.copy(pos);
      scene.add(itemMesh);

      itemDropsRef.current.push({
        id: `${Date.now()}_${Math.random()}`,
        itemId: itemId,
        mesh: itemMesh,
        position: pos.clone(),
        velocity: velocity.clone(),
        onGround: false,
        spawnTime: performance.now(),
      });
    };

    // Connect external spawn bridge (for drops from chest/inventory overlay)
    spawnDropExternalRef.current = (itemId: string, count: number) => {
      if (!cameraRef.current) return;
      const spawnDir = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion);
      const dropPos = playerPosition.current.clone().addScaledVector(spawnDir, 1.2);
      dropPos.y = cameraRef.current.position.y - 0.3; // eye level height

      for (let i = 0; i < count; i++) {
        const scatterVel = spawnDir.clone().multiplyScalar(3.5).add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          1.5 + Math.random() * 1.5,
          (Math.random() - 0.5) * 1.5
        ));
        spawnItemDrop(itemId, dropPos, scatterVel);
      }
    };


    // 2. Create Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.rotation.order = "YXZ"; // Standard FPS camera order
    cameraRef.current = camera;

    // 3. Create Renderer using the canvasRef
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Add Lights & Celestial Objects (Sun, Moon, Star Field)
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

    // Celestials Group: Sun, Moon, and Star Field
    const celestialsGroup = new THREE.Group();
    scene.add(celestialsGroup);

    // Sun Mesh & Glow Halo
    const sunGeom = new THREE.BoxGeometry(16, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff5cc, fog: false });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    celestialsGroup.add(sunMesh);

    const sunHaloGeom = new THREE.PlaneGeometry(36, 36);
    const sunHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      fog: false,
    });
    const sunHalo = new THREE.Mesh(sunHaloGeom, sunHaloMat);
    sunMesh.add(sunHalo);

    // Moon Mesh & Glow Halo
    const moonGeom = new THREE.BoxGeometry(14, 14, 14);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, fog: false });
    const moonMesh = new THREE.Mesh(moonGeom, moonMat);
    celestialsGroup.add(moonMesh);

    const moonHaloGeom = new THREE.PlaneGeometry(30, 30);
    const moonHaloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      fog: false,
    });
    const moonHalo = new THREE.Mesh(moonHaloGeom, moonHaloMat);
    moonMesh.add(moonHalo);

    // Star Field Dome
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 350;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 10;
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      transparent: true,
      opacity: 0,
      fog: false,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Torch Light Entity Helper Functions
    const createTorchEntity = (wx: number, wy: number, wz: number) => {
      const key = `${wx},${wy},${wz}`;
      if (torchLightsRef.current.has(key)) return;

      const group = new THREE.Group();
      group.position.set(wx + 0.5, wy, wz + 0.5);

      // Wood stick
      const stickGeom = new THREE.BoxGeometry(0.12, 0.5, 0.12);
      const stickMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
      const stickMesh = new THREE.Mesh(stickGeom, stickMat);
      stickMesh.position.set(0, 0.25, 0);
      group.add(stickMesh);

      // Glowing flame tip
      const flameGeom = new THREE.BoxGeometry(0.14, 0.16, 0.14);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, fog: false });
      const flameMesh = new THREE.Mesh(flameGeom, flameMat);
      flameMesh.position.set(0, 0.52, 0);
      group.add(flameMesh);

      // Point light emission
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

    // External cycle time reference trigger
    const handleCycleTime = () => {
      if (timeOfDayRef.current >= 0.24 && timeOfDayRef.current < 0.65) {
        timeOfDayRef.current = 0.72; // Sunset
      } else if (timeOfDayRef.current >= 0.65 && timeOfDayRef.current < 0.85) {
        timeOfDayRef.current = 0.95; // Midnight
      } else if (timeOfDayRef.current >= 0.85 || timeOfDayRef.current < 0.15) {
        timeOfDayRef.current = 0.22; // Sunrise
      } else {
        timeOfDayRef.current = 0.45; // Day
      }
    };
    if (cycleTimeExternalRef) {
      cycleTimeExternalRef.current = handleCycleTime;
    }

    // 5. Initialize Procedural Voxel World (Seeded with a random string for procedurally randomized worlds)
    const seedId = "voxel_minecraft_clone_" + Math.floor(Math.random() * 10000000);
    const generator = new TerrainGenerator(seedId);
    const loadedChunks = new Map<string, Uint8Array>();
    const chunkMeshes = new Map<string, THREE.Mesh>();

    // Selection box for targeted block outline (Milestone 4)
    const selectionGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002));
    const selectionMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const selectionBox = new THREE.LineSegments(selectionGeometry, selectionMaterial);
    selectionBox.visible = false;
    scene.add(selectionBox);

    const raycaster = new THREE.Raycaster();

    // Pre-populate 5x5 grid of chunks around cx=0, cz=0 (80x80 world coordinates)
    const viewRadius = 2;
    for (let cx = -viewRadius; cx <= viewRadius; cx++) {
      for (let cz = -viewRadius; cz <= viewRadius; cz++) {
        const key = `${cx},${cz}`;
        const blocks = generator.generateChunk(cx, cz);
        loadedChunks.set(key, blocks);
      }
    }

    // Dynamic Spawning Height resolution based on the terrain
    const spawnChunk = loadedChunks.get("0,0");
    let spawnY = 24; // safe default fallback
    if (spawnChunk) {
      const spawnLx = 8;
      const spawnLz = 8;
      for (let y = CHUNK_SIZE_Y - 1; y >= 0; y--) {
        const idx = spawnLx + spawnLz * CHUNK_SIZE_X + y * CHUNK_SIZE_X * CHUNK_SIZE_Z;
        if (spawnChunk[idx] !== BlockType.AIR) {
          spawnY = y + 1;
          break;
        }
      }
    }
    playerPosition.current.set(8.5, spawnY + PLAYER_HEIGHT, 8.5); // Spawn in center of chunk (0,0)
    camera.position.copy(playerPosition.current);

    // Track last known player chunk coordinate to optimize infinite loading
    let lastPlayerChunkX = Math.floor(playerPosition.current.x / CHUNK_SIZE_X);
    let lastPlayerChunkZ = Math.floor(playerPosition.current.z / CHUNK_SIZE_Z);

    // Helper to fetch block type at absolute world coordinates (wx, wy, wz)
    const getBlockAtWorld = (wx: number, wy: number, wz: number): BlockType => {
      const cx = Math.floor(wx / CHUNK_SIZE_X);
      const cz = Math.floor(wz / CHUNK_SIZE_Z);
      const key = `${cx},${cz}`;
      const blocks = loadedChunks.get(key);
      if (!blocks) return BlockType.AIR;

      const lx = ((Math.floor(wx) % CHUNK_SIZE_X) + CHUNK_SIZE_X) % CHUNK_SIZE_X;
      const lz = ((Math.floor(wz) % CHUNK_SIZE_Z) + CHUNK_SIZE_Z) % CHUNK_SIZE_Z;
      const ly = Math.floor(wy);

      if (ly < 0 || ly >= CHUNK_SIZE_Y) return BlockType.AIR;

      const idx = lx + lz * CHUNK_SIZE_X + ly * CHUNK_SIZE_X * CHUNK_SIZE_Z;
      return blocks[idx];
    };

    // Helper to spawn a mob at world coordinates (wx, wz)
    const spawnMob = (mobType: MobType, wx: number, wz: number) => {
      let sy = 0;
      for (let y = CHUNK_SIZE_Y - 2; y >= 1; y--) {
        if (getBlockAtWorld(wx, y, wz) !== BlockType.AIR) {
          sy = y + 1;
          break;
        }
      }

      if (sy > 2) {
        const mobMesh = mobType === MobType.PIG ? createPigMesh() : createZombieMesh();
        mobMesh.group.position.set(wx + 0.5, sy, wz + 0.5);
        scene.add(mobMesh.group);

        const dropItems = mobType === MobType.PIG
          ? [{ itemId: "cooked_porkchop", count: Math.floor(Math.random() * 2) + 1 }]
          : [
              { itemId: "rotten_flesh", count: Math.floor(Math.random() * 2) + 1 },
              ...(Math.random() < 0.3 ? [{ itemId: "raw_iron", count: 1 }] : [])
            ];

        const leftLegBack = "leftLegBack" in mobMesh ? mobMesh.leftLegBack : undefined;
        const rightLegBack = "rightLegBack" in mobMesh ? mobMesh.rightLegBack : undefined;
        const leftArm = "leftArm" in mobMesh ? mobMesh.leftArm : undefined;
        const rightArm = "rightArm" in mobMesh ? mobMesh.rightArm : undefined;

        mobsRef.current.push({
          id: `mob_${Date.now()}_${Math.random()}`,
          type: mobType,
          group: mobMesh.group,
          head: mobMesh.head,
          leftLegFront: mobMesh.leftLegFront,
          rightLegFront: mobMesh.rightLegFront,
          leftLegBack,
          rightLegBack,
          leftArm,
          rightArm,
          position: mobMesh.group.position,
          velocity: new THREE.Vector3(),
          health: mobType === MobType.PIG ? 10 : 20,
          maxHealth: mobType === MobType.PIG ? 10 : 20,
          targetDirection: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(),
          rotationY: Math.random() * Math.PI * 2,
          walkTimer: Math.random() * 3,
          isHostile: mobType !== MobType.PIG,
          attackCooldown: 0,
          hitTimer: 0,
          isGrounded: true,
          dropItems,
        });
      }
    };

    const PLAYER_RADIUS = 0.3;

    // Helper to check if a specific position collides with the world
    const isColliding = (pos: THREE.Vector3): boolean => {
      const radius = PLAYER_RADIUS - 0.01;
      const minX = Math.floor(pos.x - radius);
      const maxX = Math.floor(pos.x + radius);
      const minY = Math.floor(pos.y - PLAYER_HEIGHT + 0.05); // Offset feet slightly up to prevent catching on small lips
      const maxY = Math.floor(pos.y + 0.15); // Offset head slightly down
      const minZ = Math.floor(pos.z - radius);
      const maxZ = Math.floor(pos.z + radius);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          for (let z = minZ; z <= maxZ; z++) {
            if (getBlockAtWorld(x, y, z) !== BlockType.AIR) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // Helper to check if there is ground block immediately below player's footprint
    const checkOnGround = (pos: THREE.Vector3): boolean => {
      const radius = PLAYER_RADIUS - 0.01;
      const minX = Math.floor(pos.x - radius);
      const maxX = Math.floor(pos.x + radius);
      const minZ = Math.floor(pos.z - radius);
      const maxZ = Math.floor(pos.z + radius);

      // Check the layer of blocks directly under the player's feet
      const feetY = Math.floor(pos.y - PLAYER_HEIGHT - 0.01);

      for (let x = minX; x <= maxX; x++) {
        for (let z = minZ; z <= maxZ; z++) {
          if (getBlockAtWorld(x, feetY, z) !== BlockType.AIR) {
            return true;
          }
        }
      }
      return false;
    };

    // 6. Define single custom chunk material supporting vertex colors (for Milestone 3 hidden face culling / meshing)
    const chunkMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.05,
    });

    const remeshChunk = (cx: number, cz: number) => {
      const key = `${cx},${cz}`;
      const oldMesh = chunkMeshes.get(key);
      if (oldMesh) {
        scene.remove(oldMesh);
        oldMesh.geometry.dispose();
        chunkMeshes.delete(key);
      }

      const geom = buildChunkGeometry(cx, cz, loadedChunks);
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
      const key = `${cx},${cz}`;

      const blocks = loadedChunks.get(key);
      if (!blocks) return;

      const lx = wx - cx * CHUNK_SIZE_X;
      const lz = wz - cz * CHUNK_SIZE_Z;

      const idx = lx + lz * CHUNK_SIZE_X + wy * CHUNK_SIZE_X * CHUNK_SIZE_Z;
      const oldType = blocks[idx];
      blocks[idx] = type;

      if (oldType === BlockType.TORCH) {
        removeTorchEntity(wx, wy, wz);
      }
      if (type === BlockType.TORCH) {
        createTorchEntity(wx, wy, wz);
      }

      // Remesh this chunk
      remeshChunk(cx, cz);

      // Remesh adjacent chunks if on boundaries
      if (lx === 0) remeshChunk(cx - 1, cz);
      if (lx === CHUNK_SIZE_X - 1) remeshChunk(cx + 1, cz);
      if (lz === 0) remeshChunk(cx, cz - 1);
      if (lz === CHUNK_SIZE_Z - 1) remeshChunk(cx, cz + 1);
    };

    // Infinite Voxel Generation & Dynamic Meshing Engine
    const updateDynamicChunks = (force = false) => {
      const pChunkX = Math.floor(playerPosition.current.x / CHUNK_SIZE_X);
      const pChunkZ = Math.floor(playerPosition.current.z / CHUNK_SIZE_Z);

      if (!force && pChunkX === lastPlayerChunkX && pChunkZ === lastPlayerChunkZ) {
        return;
      }

      lastPlayerChunkX = pChunkX;
      lastPlayerChunkZ = pChunkZ;

      const dynamicRadius = 2; // radius of chunks loaded around the player (5x5 grid)
      const dynamicUnloadRadius = 3; // unload radius beyond which we clean up WebGL geometries to save GPU memory

      // 1. First Pass: Generate / load chunk data if they don't exist yet
      for (let cx = pChunkX - dynamicRadius; cx <= pChunkX + dynamicRadius; cx++) {
        for (let cz = pChunkZ - dynamicRadius; cz <= pChunkZ + dynamicRadius; cz++) {
          const key = `${cx},${cz}`;
          if (!loadedChunks.has(key)) {
            const blocks = generator.generateChunk(cx, cz);
            loadedChunks.set(key, blocks);
          }
        }
      }

      // 2. Second Pass: Build or remesh chunks in range
      for (let cx = pChunkX - dynamicRadius; cx <= pChunkX + dynamicRadius; cx++) {
        for (let cz = pChunkZ - dynamicRadius; cz <= pChunkZ + dynamicRadius; cz++) {
          const key = `${cx},${cz}`;
          if (!chunkMeshes.has(key)) {
            const geom = buildChunkGeometry(cx, cz, loadedChunks);
            if (geom) {
              const chunkMesh = new THREE.Mesh(geom, chunkMaterial);
              chunkMesh.castShadow = true;
              chunkMesh.receiveShadow = true;
              scene.add(chunkMesh);
              chunkMeshes.set(key, chunkMesh);
            }
          }
        }
      }

      // 3. Cleanup far away chunk meshes to preserve butter-smooth framerates infinitely
      chunkMeshes.forEach((mesh, key) => {
        const [cx, cz] = key.split(",").map(Number);
        if (Math.abs(cx - pChunkX) > dynamicUnloadRadius || Math.abs(cz - pChunkZ) > dynamicUnloadRadius) {
          scene.remove(mesh);
          mesh.geometry.dispose();
          chunkMeshes.delete(key);
        }
      });
    };

    // 7. Render initial voxel world using our dynamic meshing engine
    updateDynamicChunks(true);

    // Initial Mob Population (Passive Mobs randomly placed around spawn)
    for (let i = 0; i < 4; i++) {
      const rx = Math.floor(6 + (Math.random() - 0.5) * 20);
      const rz = Math.floor(6 + (Math.random() - 0.5) * 20);
      spawnMob(MobType.PIG, rx, rz);
    }

    // 8. Keyboard & Mouse Controls Hookup
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keysPressed.current.w = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keysPressed.current.a = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keysPressed.current.s = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keysPressed.current.d = true;
          break;
        case "Space":
          keysPressed.current.Space = true;
          break;
        case "Digit1":
          onActiveSlotIndexChangeRef.current(0);
          break;
        case "Digit2":
          onActiveSlotIndexChangeRef.current(1);
          break;
        case "Digit3":
          onActiveSlotIndexChangeRef.current(2);
          break;
        case "Digit4":
          onActiveSlotIndexChangeRef.current(3);
          break;
        case "Digit5":
          onActiveSlotIndexChangeRef.current(4);
          break;
        case "Digit6":
          onActiveSlotIndexChangeRef.current(5);
          break;
        case "Digit7":
          onActiveSlotIndexChangeRef.current(6);
          break;
        case "Digit8":
          onActiveSlotIndexChangeRef.current(7);
          break;
        case "Digit9":
          onActiveSlotIndexChangeRef.current(8);
          break;
        case "KeyE":
          onToggleInventoryRef.current();
          break;
        case "KeyT":
          handleCycleTime();
          break;
        case "KeyQ": {
          if (!document.pointerLockElement) break;
          const currentSlot = hotbarRef.current[activeSlotIndexRef.current];
          if (currentSlot && currentSlot.itemId !== "" && currentSlot.count > 0) {
            const spawnDir = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current!.quaternion);
            const dropPos = playerPosition.current.clone().addScaledVector(spawnDir, 1.2);
            dropPos.y = cameraRef.current!.position.y - 0.3; // eye level height
            const scatterVel = spawnDir.clone().multiplyScalar(4.0).add(new THREE.Vector3(
              (Math.random() - 0.5) * 1.0,
              1.5 + Math.random() * 1.5,
              (Math.random() - 0.5) * 1.0
            ));
            spawnItemDrop(currentSlot.itemId, dropPos, scatterVel);
            onItemDroppedFromHotbarRef.current();
          }
          break;
        }
        case "KeyR": {
          const currentX = Math.floor(playerPosition.current.x);
          const currentZ = Math.floor(playerPosition.current.z);
          let safeY = 24; // fallback
          for (let y = CHUNK_SIZE_Y - 1; y >= 0; y--) {
            if (getBlockAtWorld(currentX, y, currentZ) !== BlockType.AIR) {
              safeY = y + 1;
              break;
            }
          }
          playerPosition.current.y = safeY + PLAYER_HEIGHT;
          playerVelocity.current.set(0, 0, 0);
          break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keysPressed.current.w = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keysPressed.current.a = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keysPressed.current.s = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keysPressed.current.d = false;
          break;
        case "Space":
          keysPressed.current.Space = false;
          break;
      }
    };

    const sensitivity = 0.0022;
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      lastWheelTime = performance.now();
      if (!document.pointerLockElement) return;
      let nextIndex = activeSlotIndexRef.current;
      if (e.deltaY > 0) {
        nextIndex = (activeSlotIndexRef.current + 1) % 9;
      } else if (e.deltaY < 0) {
        nextIndex = (activeSlotIndexRef.current - 1 + 9) % 9;
      }
      onActiveSlotIndexChangeRef.current(nextIndex);
    };


    const spawnParticleBurst = (pos: THREE.Vector3, colorHex: number | string = 0xf59e0b, count: number = 10) => {
      const particleGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const particleMat = new THREE.MeshBasicMaterial({ color: colorHex });

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(particleGeom, particleMat);
        mesh.position.copy(pos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ));
        scene.add(mesh);

        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 4.5,
          Math.random() * 4.0 + 1.5,
          (Math.random() - 0.5) * 4.5
        );

        particlesRef.current.push({
          mesh,
          velocity,
          life: 0,
          maxLife: 0.35 + Math.random() * 0.25,
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        e.preventDefault();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target !== canvasRef.current) {
        return;
      }
      if (!document.pointerLockElement) {
        isMouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        return;
      }

      if (!cameraRef.current) return;

      const activeSlot = hotbarRef.current[activeSlotIndexRef.current];
      const activeItemDef = activeSlot && activeSlot.itemId ? ITEM_REGISTRY[activeSlot.itemId] : null;

      // Handle Food Consumption on Right Click or Click with Food
      if (e.button === 2 && activeItemDef && activeItemDef.type === "food") {
        if (onEatFoodRef.current) {
          onEatFoodRef.current();
          return;
        }
      }

      // 1. Raycast Mobs for Combat Attack
      if (e.button === 0) {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), cameraRef.current);
        const mobMeshGroups = mobsRef.current.map((m) => m.group);
        const mobHits = raycaster.intersectObjects(mobMeshGroups, true);

        if (mobHits.length > 0 && mobHits[0].distance <= 4.5) {
          const hitObject = mobHits[0].object;
          const mob = mobsRef.current.find((m) => {
            let curr: THREE.Object3D | null = hitObject;
            while (curr) {
              if (curr === m.group) return true;
              curr = curr.parent;
            }
            return false;
          });

          if (mob) {
            // Determine damage from held weapon/tool
            const attackDamage = activeItemDef?.attackDamage || (activeItemDef?.miningSpeedMultiplier ? 3 : 2);
            mob.health -= attackDamage;
            mob.hitTimer = 0.2;

            // Knockback impulse vector
            const camDir = cameraRef.current.getWorldDirection(new THREE.Vector3());
            mob.velocity.add(camDir.multiplyScalar(6.5));
            mob.velocity.y = 3.5;

            playSoundEffect("hit");

            // Combat spark particle burst
            spawnParticleBurst(mobHits[0].point, 0xef4444, 8);

            // Deduct weapon durability
            if (activeItemDef?.maxDurability && onToolUsedRef.current) {
              onToolUsedRef.current(activeSlotIndexRef.current);
            }

            // Defeated Mob check
            if (mob.health <= 0) {
              playSoundEffect("block_break");
              spawnParticleBurst(mob.position.clone().add(new THREE.Vector3(0, 0.5, 0)), 0xffffff, 16);

              // Spawn physical mob loot drops in world
              mob.dropItems.forEach((drop) => {
                const itemDef = ITEM_REGISTRY[drop.itemId];
                if (itemDef) {
                  for (let i = 0; i < drop.count; i++) {
                    const itemMesh = createItemDropMesh(drop.itemId, itemDef.color);
                    const spawnPos = mob.position.clone().add(new THREE.Vector3(0, 0.5, 0));
                    itemMesh.position.copy(spawnPos);
                    scene.add(itemMesh);

                    const vel = new THREE.Vector3(
                      (Math.random() - 0.5) * 2.5,
                      3.0 + Math.random() * 1.5,
                      (Math.random() - 0.5) * 2.5
                    );

                    itemDropsRef.current.push({
                      id: `${Date.now()}_${Math.random()}`,
                      itemId: drop.itemId,
                      mesh: itemMesh,
                      position: spawnPos,
                      velocity: vel,
                      onGround: false,
                      spawnTime: performance.now(),
                    });
                  }
                }
              });

              // Remove mob group from scene
              scene.remove(mob.group);
              mobsRef.current = mobsRef.current.filter((m) => m !== mob);

              if (onMobKilledRef.current) {
                onMobKilledRef.current();
              }
            }

            return; // Target hit! Skip block breaking behind mob
          }
        }
      }

      // 2. Raycast to find what block we clicked
      raycaster.setFromCamera(new THREE.Vector2(0, 0), cameraRef.current);
      const intersects = raycaster.intersectObjects(Array.from(chunkMeshes.values()));

      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (intersect.distance <= 5.5) {
          if (e.button === 0) {
            // Left click: Break block
            const targetBlockPos = intersect.point.clone().sub(intersect.face!.normal.clone().multiplyScalar(0.5));
            const bx = Math.floor(targetBlockPos.x);
            const by = Math.floor(targetBlockPos.y);
            const bz = Math.floor(targetBlockPos.z);

            // Prevent breaking bedrock at bottom (y === 0)
            if (by > 0) {
              const oldBlock = getBlockAtWorld(bx, by, bz);
              setBlockAtWorld(bx, by, bz, BlockType.AIR);

              playSoundEffect("block_break");
              // Spawn block particle burst
              spawnParticleBurst(new THREE.Vector3(bx + 0.5, by + 0.5, bz + 0.5), 0x94a3b8, 10);

              // Check active held item for tool requirements and durability
              const heldToolType = activeItemDef?.toolType || "none";

              // Spawn 3D floating & rotating item drops in the world (Milestone 6)
              const dropConfig = BLOCK_DROP_TABLE[oldBlock];
              const isToolSufficient = !dropConfig || dropConfig.requiredTool === "none" || dropConfig.requiredTool === heldToolType;

              if (dropConfig && dropConfig.itemId && isToolSufficient) {
                const count = Math.floor(Math.random() * (dropConfig.maxCount - dropConfig.minCount + 1)) + dropConfig.minCount;
                const itemDef = ITEM_REGISTRY[dropConfig.itemId];
                if (itemDef && count > 0) {
                  for (let i = 0; i < count; i++) {
                    const itemMesh = createItemDropMesh(dropConfig.itemId, itemDef.color);
                    const spawnPos = new THREE.Vector3(bx + 0.5, by + 0.5, bz + 0.5);
                    itemMesh.position.copy(spawnPos);
                    scene.add(itemMesh);

                    // Add slight random horizontal and upward dynamic pop velocity
                    const vel = new THREE.Vector3(
                      (Math.random() - 0.5) * 2.0,
                      2.5 + Math.random() * 1.5,
                      (Math.random() - 0.5) * 2.0
                    );

                    itemDropsRef.current.push({
                      id: `${Date.now()}_${Math.random()}`,
                      itemId: dropConfig.itemId,
                      mesh: itemMesh,
                      position: spawnPos,
                      velocity: vel,
                      onGround: false,
                      spawnTime: performance.now(),
                    });
                  }
                }
              }

              // Deduct tool durability if a tool was used (Milestone 6 & 7)
              if (activeItemDef?.type === "tool" && onToolUsedRef.current) {
                onToolUsedRef.current(activeSlotIndexRef.current);
              }
            }
          } else if (e.button === 2) {
            // Check if right-clicking an existing Crafting Table block in the world
            const targetBlockPos = intersect.point.clone().sub(intersect.face!.normal.clone().multiplyScalar(0.5));
            const tx = Math.floor(targetBlockPos.x);
            const ty = Math.floor(targetBlockPos.y);
            const tz = Math.floor(targetBlockPos.z);
            const targetBlockType = getBlockAtWorld(tx, ty, tz);

            if (targetBlockType === BlockType.CRAFTING_TABLE) {
              if (onOpenCraftingTableRef.current) {
                onOpenCraftingTableRef.current();
                return;
              }
            }

            // Right click: Place block
            const placeBlockPos = intersect.point.clone().add(intersect.face!.normal.clone().multiplyScalar(0.5));
            const px = Math.floor(placeBlockPos.x);
            const py = Math.floor(placeBlockPos.y);
            const pz = Math.floor(placeBlockPos.z);

            if (py >= 0 && py < CHUNK_SIZE_Y) {
              // Ensure we do not place a block overlapping with the player's collision box
              const playerMinX = playerPosition.current.x - PLAYER_RADIUS;
              const playerMaxX = playerPosition.current.x + PLAYER_RADIUS;
              const playerMinY = playerPosition.current.y - PLAYER_HEIGHT;
              const playerMaxY = playerPosition.current.y + 0.15;
              const playerMinZ = playerPosition.current.z - PLAYER_RADIUS;
              const playerMaxZ = playerPosition.current.z + PLAYER_RADIUS;

              const overlapsPlayer = (
                px + 1 > playerMinX && px < playerMaxX &&
                py + 1 > playerMinY && py < playerMaxY &&
                pz + 1 > playerMinZ && pz < playerMaxZ
              );

              if (!overlapsPlayer && activeBlockRef.current !== BlockType.AIR) {
                setBlockAtWorld(px, py, pz, activeBlockRef.current);
                onBlockPlacedRef.current();
              }

            }
          }
        }
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cameraRef.current) return;
      if (performance.now() - lastWheelTime < 400) return;

      if (document.pointerLockElement) {
        cameraRef.current.rotation.y -= e.movementX * sensitivity;
        cameraRef.current.rotation.x -= e.movementY * sensitivity;
      } else {
        if (e.buttons === 0) {
          isMouseDown = false;
        }
        if (isMouseDown) {
          const deltaX = e.clientX - lastMouseX;
          const deltaY = e.clientY - lastMouseY;
          lastMouseX = e.clientX;
          lastMouseY = e.clientY;

          cameraRef.current.rotation.y -= deltaX * sensitivity;
          cameraRef.current.rotation.x -= deltaY * sensitivity;
        } else {
          return;
        }
      }

      // Clamp looking up and down to 85 degrees to prevent roll
      cameraRef.current.rotation.x = Math.max(
        -Math.PI / 2.1,
        Math.min(Math.PI / 2.1, cameraRef.current.rotation.x)
      );
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("contextmenu", handleContextMenu);

    // 9. Resize Handling
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 10. Pointer Lock status changes
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === canvasRef.current;
      onLockChangeRef.current(locked);
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);

    // 11. Physics and Game Loop
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const time = performance.now();
      const delta = Math.min((time - lastTime) / 1000, 0.1); // Clamp delta to stabilize frame rate fluctuations
      lastTime = time;

      if (cameraRef.current) {
        // Infinite dynamic chunk updates (generates and builds meshes as player moves)
        updateDynamicChunks();

        // Update Day-Night Cycle & Celestial Orbits
        timeOfDayRef.current = (timeOfDayRef.current + delta * 0.0025) % 1.0;
        const timeVal = timeOfDayRef.current;

        const sunAngle = timeVal * 2 * Math.PI - Math.PI / 2;
        const orbitRadius = 220;

        const px = playerPosition.current.x;
        const py = playerPosition.current.y;
        const pz = playerPosition.current.z;

        // Sun position
        const sunX = px + Math.cos(sunAngle) * orbitRadius;
        const sunY = Math.sin(sunAngle) * orbitRadius;
        const sunZ = pz + Math.sin(sunAngle * 0.5) * 60;
        sunMesh.position.set(sunX, sunY, sunZ);
        sunMesh.lookAt(px, py, pz);

        // Moon position
        const moonX = px - Math.cos(sunAngle) * orbitRadius;
        const moonY = -Math.sin(sunAngle) * orbitRadius;
        const moonZ = pz - Math.sin(sunAngle * 0.5) * 60;
        moonMesh.position.set(moonX, moonY, moonZ);
        moonMesh.lookAt(px, py, pz);

        starField.position.set(px, 0, pz);

        // Sun Height (-1 to 1)
        const sunHeight = Math.sin(sunAngle);

        if (sunHeight > 0) {
          sunLight.position.set(sunX, Math.max(10, sunY), sunZ);
          sunLight.intensity = Math.max(0.05, sunHeight * 1.35);
          sunLight.color.setHSL(0.1, 0.6, 0.9);
        } else {
          sunLight.position.set(moonX, Math.max(10, moonY), moonZ);
          sunLight.intensity = Math.max(0.05, -sunHeight * 0.35);
          sunLight.color.setHSL(0.6, 0.7, 0.8);
        }

        // Sky & Fog Colors
        const dayColor = new THREE.Color("#60a5fa");
        const sunsetColor = new THREE.Color("#f97316");
        const nightColor = new THREE.Color("#090d16");

        const dayFog = new THREE.Color("#93c5fd");
        const sunsetFog = new THREE.Color("#fdba74");
        const nightFog = new THREE.Color("#0f172a");

        const currentSky = new THREE.Color();
        const currentFog = new THREE.Color();

        if (sunHeight > 0.2) {
          currentSky.copy(dayColor);
          currentFog.copy(dayFog);
          starMaterial.opacity = 0;
        } else if (sunHeight >= -0.2) {
          const t = (sunHeight + 0.2) / 0.4;
          if (t > 0.5) {
            const factor = (t - 0.5) * 2;
            currentSky.lerpColors(sunsetColor, dayColor, factor);
            currentFog.lerpColors(sunsetFog, dayFog, factor);
          } else {
            const factor = t * 2;
            currentSky.lerpColors(nightColor, sunsetColor, factor);
            currentFog.lerpColors(nightFog, sunsetFog, factor);
          }
          starMaterial.opacity = (1 - t) * 0.8;
        } else {
          currentSky.copy(nightColor);
          currentFog.copy(nightFog);
          starMaterial.opacity = 0.85;
        }

        scene.background = currentSky;
        if (scene.fog) {
          (scene.fog as THREE.FogExp2).color.copy(currentFog);
        }

        ambientLight.intensity = THREE.MathUtils.lerp(0.18, 0.65, Math.max(0, sunHeight));

        // Animate torch light flickering
        frameCount++;
        if (frameCount % 2 === 0) {
          const nowSec = performance.now() * 0.005;
          torchLightsRef.current.forEach(({ light }, key) => {
            const hash = key.length;
            light.intensity = 1.4 + Math.sin(nowSec * 3 + hash) * 0.25;
          });
        }

        // Throttled React callback to update HUD time state
        if (frameCount % 15 === 0 && onTimeUpdateRef.current) {
          const currentHours = Math.floor(timeVal * 24);
          const currentMins = Math.floor((timeVal * 24 % 1) * 60);
          const displayHours = currentHours % 12 === 0 ? 12 : currentHours % 12;
          const ampm = currentHours >= 12 ? "PM" : "AM";
          const formattedClock = `${displayHours.toString().padStart(2, "0")}:${currentMins.toString().padStart(2, "0")} ${ampm}`;

          let phaseName = "Day";
          if (timeVal >= 0.20 && timeVal < 0.28) phaseName = "Sunrise";
          else if (timeVal >= 0.28 && timeVal < 0.70) phaseName = "Day";
          else if (timeVal >= 0.70 && timeVal < 0.78) phaseName = "Sunset";
          else phaseName = "Night";

          onTimeUpdateRef.current(timeVal, phaseName, formattedClock);
        }

        // Update 3D World Item Drops physics and animation (Milestone 6)
        const currentTicks = performance.now();
        itemDropsRef.current.forEach((item) => {
          if (!item.onGround) {
            // Apply gravity
            item.velocity.y -= 9.8 * delta;
            // Update position with velocity
            item.position.addScaledVector(item.velocity, delta);

            // Check collision with the block they are in/landing on
            const ix = Math.floor(item.position.x);
            const iy = Math.floor(item.position.y);
            const iz = Math.floor(item.position.z);
            
            const currentBlock = getBlockAtWorld(ix, iy, iz);
            const belowBlock = getBlockAtWorld(ix, Math.floor(item.position.y - 0.05), iz);

            if (currentBlock !== BlockType.AIR) {
              // Inside a solid block, push up to the top of it
              item.position.y = Math.ceil(item.position.y);
              item.velocity.set(0, 0, 0);
              item.onGround = true;
            } else if (belowBlock !== BlockType.AIR && item.velocity.y <= 0) {
              // Land on block below
              item.position.y = Math.floor(item.position.y);
              item.velocity.set(0, 0, 0);
              item.onGround = true;
            }
          }

          // Once on ground or floating, apply nice visual effects
          // Rotate around Y-axis
          item.mesh.rotation.y += delta * 2.5;
          item.mesh.rotation.x += delta * 0.5; // slight tilt rotation makes it super dynamic!
          // Soft hovering up/down sine wave
          const sineOffset = Math.sin((currentTicks - item.spawnTime) * 0.004) * 0.08;
          item.mesh.position.copy(item.position);
          item.mesh.position.y += sineOffset;

          // Magnet/Proximity Sucking & Vacuum Logic (Milestone 7)
          const distToPlayer = item.mesh.position.distanceTo(playerPosition.current);
          if (distToPlayer < 2.5 && (currentTicks - item.spawnTime) > 600) {
            // Magnet pull towards player camera position
            const pullDir = playerPosition.current.clone().sub(item.mesh.position).normalize();
            item.position.addScaledVector(pullDir, delta * 8.0);
            item.mesh.position.copy(item.position);
            item.onGround = false;

            if (distToPlayer < 0.8) {
              const success = onItemPickedUpRef.current(item.itemId, 1);
              if (success) {
                item.toRemove = true;
              }
            }
          }
        });

        // Filter out and dispose of picked up items
        const remainingDrops: typeof itemDropsRef.current = [];
        itemDropsRef.current.forEach((item) => {
          if (item.toRemove) {
            scene.remove(item.mesh);
            item.mesh.geometry.dispose();
            if (Array.isArray(item.mesh.material)) {
              item.mesh.material.forEach((m: THREE.Material) => m.dispose());
            } else {
              item.mesh.material.dispose();
            }
          } else {
            remainingDrops.push(item);
          }
        });
        itemDropsRef.current = remainingDrops;

        // Limit maximum number of drops to avoid WebGL lag
        if (itemDropsRef.current.length > 60) {
          const removed = itemDropsRef.current.shift();
          if (removed) {
            scene.remove(removed.mesh);
            removed.mesh.geometry.dispose();
            if (Array.isArray(removed.mesh.material)) {
              removed.mesh.material.forEach((m: THREE.Material) => m.dispose());
            } else {
              removed.mesh.material.dispose();
            }
          }
        }


        // ==========================================
        // 12. PARTICLES & MOB ENTITIES UPDATE LOOP
        // ==========================================

        // Update Particle Bursts
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life += delta;
          p.velocity.y -= 15 * delta;
          p.mesh.position.addScaledVector(p.velocity, delta);
          p.mesh.scale.setScalar(Math.max(0, 1 - p.life / p.maxLife));

          if (p.life >= p.maxLife) {
            scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            if (Array.isArray(p.mesh.material)) {
              p.mesh.material.forEach((m) => m.dispose());
            } else {
              p.mesh.material.dispose();
            }
            particlesRef.current.splice(i, 1);
          }
        }

        // Periodic Mob Spawning (Max 10 active mobs)
        if (frameCount % 90 === 0 && mobsRef.current.length < 10) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = 10 + Math.random() * 12; // Spawn 10 to 22 blocks away
          const sx = Math.floor(px + Math.cos(spawnAngle) * spawnDist);
          const sz = Math.floor(pz + Math.sin(spawnAngle) * spawnDist);

          const isNight = sunHeight <= 0.10;
          if (isNight) {
            // Nighttime: Hostile Mobs (85% Zombie, 15% Pig)
            const mobType = Math.random() < 0.85 ? MobType.ZOMBIE : MobType.PIG;
            spawnMob(mobType, sx, sz);
          } else {
            // Daytime: Passive Mobs only (Pigs)
            spawnMob(MobType.PIG, sx, sz);
          }
        }

        // Mob AI, Physics & Despawn Simulation
        for (let i = mobsRef.current.length - 1; i >= 0; i--) {
          const mob = mobsRef.current[i];

          const mobDistToPlayer = mob.position.distanceTo(playerPosition.current);

          // Despawn mobs that wander or spawn too far away (> 38 blocks)
          if (mobDistToPlayer > 38) {
            scene.remove(mob.group);
            mobsRef.current.splice(i, 1);
            continue;
          }

          if (mob.attackCooldown > 0) mob.attackCooldown -= delta;

          // Red hit flash timer handling
          if (mob.hitTimer > 0) {
            mob.hitTimer -= delta;
            mob.group.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                if (!child.userData.origColor && child.material.color) {
                  child.userData.origColor = child.material.color.getHex();
                }
                if (mob.hitTimer > 0) {
                  child.material.color.setHex(0xef4444);
                } else if (child.userData.origColor !== undefined) {
                  child.material.color.setHex(child.userData.origColor);
                }
              }
            });
          }

          // Zombie Hostile Targeting
          if (mob.type === MobType.ZOMBIE) {
            // Zombie daylight burn check
            if (sunHeight > 0.35 && Math.random() < 0.05) {
              mob.health -= 0.5;
              spawnParticleBurst(mob.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xf97316, 2);
              if (mob.health <= 0) {
                scene.remove(mob.group);
                mobsRef.current.splice(i, 1);
                continue;
              }
            }

            if (mobDistToPlayer <= 18) {
              const toPlayer = new THREE.Vector3().subVectors(playerPosition.current, mob.position).setY(0);
              if (toPlayer.lengthSq() > 0.1) {
                mob.targetDirection.copy(toPlayer.normalize());
                mob.rotationY = Math.atan2(mob.targetDirection.x, mob.targetDirection.z);
              }

              // Attack Player
              if (mobDistToPlayer <= 1.35 && mob.attackCooldown <= 0) {
                if (onPlayerHurtRef.current) {
                  onPlayerHurtRef.current(3);
                }
                mob.attackCooldown = 1.2;
              }
            }
          } else {
            // Pig Passive Wandering
            mob.walkTimer -= delta;
            if (mob.walkTimer <= 0) {
              mob.walkTimer = 2.5 + Math.random() * 3.5;
              if (Math.random() < 0.7) {
                mob.targetDirection.set((Math.random() - 0.5), 0, (Math.random() - 0.5)).normalize();
                mob.rotationY = Math.atan2(mob.targetDirection.x, mob.targetDirection.z);
              } else {
                mob.targetDirection.set(0, 0, 0); // Idle pause
              }
            }
          }

          // Move Mob Velocity
          const mobSpeed = mob.type === MobType.ZOMBIE ? 3.0 : 1.8;
          if (mob.targetDirection.lengthSq() > 0) {
            mob.velocity.x = mob.targetDirection.x * mobSpeed;
            mob.velocity.z = mob.targetDirection.z * mobSpeed;
          } else {
            mob.velocity.x = 0;
            mob.velocity.z = 0;
          }

          // Gravity
          mob.velocity.y -= GRAVITY * delta;
          mob.position.y += mob.velocity.y * delta;

          // Terrain Ground Collision Check
          const mobBx = Math.floor(mob.position.x);
          const mobBz = Math.floor(mob.position.z);
          const feetBlockY = Math.floor(mob.position.y - 0.05);

          const feetBlock = getBlockAtWorld(mobBx, feetBlockY, mobBz);
          if (feetBlock !== BlockType.AIR) {
            mob.position.y = feetBlockY + 1; // Stand on top surface of solid ground
            mob.velocity.y = 0;
            mob.isGrounded = true;
          } else {
            mob.isGrounded = false;
          }

          // Horizontal Position Update
          mob.position.x += mob.velocity.x * delta;
          mob.position.z += mob.velocity.z * delta;

          // Check obstacle wall in front -> trigger mob jump!
          const eyeBlock = getBlockAtWorld(mobBx, Math.floor(mob.position.y + 0.5), mobBz);
          if (eyeBlock !== BlockType.AIR && mob.isGrounded) {
            mob.velocity.y = JUMP_FORCE * 0.85;
            mob.isGrounded = false;
          }

          mob.group.rotation.y = mob.rotationY;

          // Procedural Limb Walking Animation
          const walkPhase = performance.now() * 0.008;
          const isMoving = mob.velocity.x !== 0 || mob.velocity.z !== 0;
          const swingAngle = Math.sin(walkPhase) * 0.6;

          if (mob.leftLegFront) mob.leftLegFront.rotation.x = isMoving ? swingAngle : 0;
          if (mob.rightLegFront) mob.rightLegFront.rotation.x = isMoving ? -swingAngle : 0;
          if (mob.leftLegBack) mob.leftLegBack.rotation.x = isMoving ? -swingAngle : 0;
          if (mob.rightLegBack) mob.rightLegBack.rotation.x = isMoving ? swingAngle : 0;

          if (mob.leftArm) mob.leftArm.rotation.x = isMoving ? swingAngle - Math.PI / 2.2 : -Math.PI / 2.2;
          if (mob.rightArm) mob.rightArm.rotation.x = isMoving ? -swingAngle - Math.PI / 2.2 : -Math.PI / 2.2;
        }


        // Horizontal direction vectors relative to looking angle (yaw only)
        const yaw = cameraRef.current.rotation.y;
        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

        const moveDirection = new THREE.Vector3();

        if (keysPressed.current.w) moveDirection.add(forward);
        if (keysPressed.current.s) moveDirection.add(forward.clone().negate());
        if (keysPressed.current.d) moveDirection.add(right);
        if (keysPressed.current.a) moveDirection.add(right.clone().negate());

        if (moveDirection.lengthSq() > 0) {
          moveDirection.normalize();
          playerVelocity.current.x = moveDirection.x * SPEED;
          playerVelocity.current.z = moveDirection.z * SPEED;
        } else {
          // Smoothly decelerate when keys are released
          playerVelocity.current.x = 0;
          playerVelocity.current.z = 0;
        }

        // Check if there is ground block immediately below the player
        const currentlyOnGround = checkOnGround(playerPosition.current);
        if (currentlyOnGround) {
          isGrounded.current = true;
          if (playerVelocity.current.y < 0) {
            playerVelocity.current.y = 0;
          }
        } else {
          isGrounded.current = false;
        }

        // Apply Gravity & Jump mechanics
        if (!isGrounded.current) {
          playerVelocity.current.y -= GRAVITY * delta;
        }

        if (keysPressed.current.Space && isGrounded.current) {
          playerVelocity.current.y = JUMP_FORCE;
          isGrounded.current = false;
        }

        // Axis-by-axis AABB collision resolution
        // 1. Move & resolve X
        if (playerVelocity.current.x !== 0) {
          playerPosition.current.x += playerVelocity.current.x * delta;
          if (isColliding(playerPosition.current)) {
            if (playerVelocity.current.x > 0) {
              playerPosition.current.x = Math.floor(playerPosition.current.x + PLAYER_RADIUS) - PLAYER_RADIUS - 0.001;
            } else {
              playerPosition.current.x = Math.floor(playerPosition.current.x - PLAYER_RADIUS) + 1.0 + PLAYER_RADIUS + 0.001;
            }
            playerVelocity.current.x = 0;
          }
        }

        // 2. Move & resolve Z
        if (playerVelocity.current.z !== 0) {
          playerPosition.current.z += playerVelocity.current.z * delta;
          if (isColliding(playerPosition.current)) {
            if (playerVelocity.current.z > 0) {
              playerPosition.current.z = Math.floor(playerPosition.current.z + PLAYER_RADIUS) - PLAYER_RADIUS - 0.001;
            } else {
              playerPosition.current.z = Math.floor(playerPosition.current.z - PLAYER_RADIUS) + 1.0 + PLAYER_RADIUS + 0.001;
            }
            playerVelocity.current.z = 0;
          }
        }

        // 3. Move & resolve Y
        if (playerVelocity.current.y !== 0) {
          playerPosition.current.y += playerVelocity.current.y * delta;
          if (isColliding(playerPosition.current)) {
            if (playerVelocity.current.y > 0) {
              // Hit ceiling
              playerPosition.current.y = Math.floor(playerPosition.current.y + 0.15) - 0.15 - 0.001;
              playerVelocity.current.y = 0;
            } else if (playerVelocity.current.y < 0) {
              // Hit ground
              playerPosition.current.y = Math.floor(playerPosition.current.y - PLAYER_HEIGHT + 0.05) + 1.0 + PLAYER_HEIGHT;
              playerVelocity.current.y = 0;
              isGrounded.current = true;
            }
          }
        }

        // Boundaries checks are completely removed to allow dynamic infinite exploration!

        // Update Camera Position directly to player coords
        cameraRef.current.position.copy(playerPosition.current);

        // RAYCASTING FOR SELECTION OUTLINE (Milestone 4)
        if (document.pointerLockElement) {
          raycaster.setFromCamera(new THREE.Vector2(0, 0), cameraRef.current);
          const intersects = raycaster.intersectObjects(Array.from(chunkMeshes.values()));
          if (intersects.length > 0) {
            const intersect = intersects[0];
            if (intersect.distance <= 5.5) {
              const targetBlockPos = intersect.point.clone().sub(intersect.face!.normal.clone().multiplyScalar(0.5));
              const bx = Math.floor(targetBlockPos.x);
              const by = Math.floor(targetBlockPos.y);
              const bz = Math.floor(targetBlockPos.z);
              selectionBox.position.set(bx + 0.5, by + 0.5, bz + 0.5);
              selectionBox.visible = true;
            } else {
              selectionBox.visible = false;
            }
          } else {
            selectionBox.visible = false;
          }
        } else {
          selectionBox.visible = false;
        }

        // Compute direction label for compass HUD
        const deg = (((yaw * 180) / Math.PI) % 360 + 360) % 360;
        let dirStr = "North";
        if (deg >= 315 || deg < 45) dirStr = "South";
        else if (deg >= 45 && deg < 135) dirStr = "West";
        else if (deg >= 135 && deg < 225) dirStr = "North";
        else if (deg >= 225 && deg < 315) dirStr = "East";

        // FAST DIRECT DOM HUD UPDATES: Bypass virtual DOM entirely for buttery-smooth updates
        const xEl = document.getElementById("hud-x");
        const yEl = document.getElementById("hud-y");
        const zEl = document.getElementById("hud-z");
        const facingEl = document.getElementById("hud-facing");
        if (xEl) xEl.textContent = playerPosition.current.x.toFixed(2);
        if (yEl) yEl.textContent = playerPosition.current.y.toFixed(2);
        if (zEl) zEl.textContent = playerPosition.current.z.toFixed(2);
        if (facingEl) facingEl.textContent = dirStr;

        // THROTTLED REACT STATE SYNCHRONIZATION (approx. 5 times per sec)
        frameCount++;
        if (frameCount >= 12) {
          const currentBiome = generator.getBiomeAt(
            Math.floor(playerPosition.current.x),
            Math.floor(playerPosition.current.z)
          );
          onPositionChangeRef.current(playerPosition.current.clone(), dirStr, currentBiome.name);
          frameCount = 0;
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Begin render and physics frame loop
    animate();

    // Comprehensive Resource Disposal Cleanup on Unmount
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      chunkMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
      });
      chunkMaterial.dispose();
      selectionGeometry.dispose();
      selectionMaterial.dispose();

      // Dispose of active item drops (Milestone 6)
      itemDropsRef.current.forEach((item) => {
        scene.remove(item.mesh);
        item.mesh.geometry.dispose();
        if (Array.isArray(item.mesh.material)) {
          item.mesh.material.forEach((m) => m.dispose());
        } else {
          item.mesh.material.dispose();
        }
      });
      itemDropsRef.current = [];
    };
  }, [spawnDropExternalRef]);

  const requestLock = () => {
    if (canvasRef.current) {
      canvasRef.current.requestPointerLock();
    }
  };

  return (
    <div
      id="game-container"
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-slate-900"
    >
      <canvas
        id="canvas-mount"
        ref={canvasRef}
        className="w-full h-full block cursor-pointer outline-none"
        onClick={requestLock}
      />
    </div>
  );
}
