import * as THREE from "three";

export enum MobType {
  PIG = "pig",
  ZOMBIE = "zombie",
  SKELETON = "skeleton",
}

export interface MobEntity {
  id: string;
  type: MobType;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotationY: number;
  health: number;
  maxHealth: number;
  group: THREE.Group;
  head: THREE.Object3D;
  leftLegFront?: THREE.Object3D;
  rightLegFront?: THREE.Object3D;
  leftLegBack?: THREE.Object3D;
  rightLegBack?: THREE.Object3D;
  leftArm?: THREE.Object3D;
  rightArm?: THREE.Object3D;
  
  // AI & State
  walkTimer: number;
  targetDirection: THREE.Vector3;
  isHostile: boolean;
  attackCooldown: number;
  hitTimer: number;
  isGrounded: boolean;
  dropItems: { itemId: string; count: number }[];
}

// 1. Procedural Pig Mesh (Passive Mob)
export function createPigMesh(): {
  group: THREE.Group;
  head: THREE.Object3D;
  leftLegFront: THREE.Object3D;
  rightLegFront: THREE.Object3D;
  leftLegBack: THREE.Object3D;
  rightLegBack: THREE.Object3D;
} {
  const group = new THREE.Group();
  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 });
  const darkPinkMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.7 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Body
  const bodyGeom = new THREE.BoxGeometry(0.9, 0.7, 1.2);
  const bodyMesh = new THREE.Mesh(bodyGeom, pinkMat);
  bodyMesh.position.set(0, 0.65, 0);
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.85, 0.65);
  const headGeom = new THREE.BoxGeometry(0.65, 0.65, 0.65);
  const headMesh = new THREE.Mesh(headGeom, pinkMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Snout
  const snoutGeom = new THREE.BoxGeometry(0.3, 0.2, 0.15);
  const snoutMesh = new THREE.Mesh(snoutGeom, darkPinkMat);
  snoutMesh.position.set(0, -0.05, 0.35);
  headGroup.add(snoutMesh);

  // Eyes
  const eyeGeom = new THREE.BoxGeometry(0.1, 0.1, 0.02);
  const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
  leftEye.position.set(-0.2, 0.08, 0.33);
  const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
  rightEye.position.set(0.2, 0.08, 0.33);
  headGroup.add(leftEye, rightEye);

  group.add(headGroup);

  // Legs
  const legGeom = new THREE.BoxGeometry(0.25, 0.45, 0.25);
  
  const createLeg = (x: number, z: number) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(x, 0.45, z);
    const legMesh = new THREE.Mesh(legGeom, pinkMat);
    legMesh.position.set(0, -0.22, 0);
    legMesh.castShadow = true;
    legGroup.add(legMesh);
    group.add(legGroup);
    return legGroup;
  };

  const leftLegFront = createLeg(-0.3, 0.4);
  const rightLegFront = createLeg(0.3, 0.4);
  const leftLegBack = createLeg(-0.3, -0.4);
  const rightLegBack = createLeg(0.3, -0.4);

  return { group, head: headGroup, leftLegFront, rightLegFront, leftLegBack, rightLegBack };
}

// 2. Procedural Zombie Mesh (Hostile Mob)
export function createZombieMesh(): {
  group: THREE.Group;
  head: THREE.Object3D;
  leftLegFront: THREE.Object3D;
  rightLegFront: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
} {
  const group = new THREE.Group();
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }); // Dark Green
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 }); // Cyan/Blue shirt
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 }); // Dark blue pants
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 }); // Glowing red eyes

  // Body / Torso
  const torsoGeom = new THREE.BoxGeometry(0.7, 0.9, 0.4);
  const torsoMesh = new THREE.Mesh(torsoGeom, shirtMat);
  torsoMesh.position.set(0, 1.15, 0);
  torsoMesh.castShadow = true;
  group.add(torsoMesh);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.85, 0);
  const headGeom = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const headMesh = new THREE.Mesh(headGeom, skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Red Eyes
  const eyeGeom = new THREE.BoxGeometry(0.12, 0.08, 0.02);
  const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
  leftEye.position.set(-0.16, 0.05, 0.31);
  const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
  rightEye.position.set(0.16, 0.05, 0.31);
  headGroup.add(leftEye, rightEye);
  group.add(headGroup);

  // Legs
  const legGeom = new THREE.BoxGeometry(0.3, 0.8, 0.3);
  const createLeg = (x: number) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(x, 0.8, 0);
    const legMesh = new THREE.Mesh(legGeom, pantsMat);
    legMesh.position.set(0, -0.4, 0);
    legMesh.castShadow = true;
    legGroup.add(legMesh);
    group.add(legGroup);
    return legGroup;
  };
  const leftLegFront = createLeg(-0.2);
  const rightLegFront = createLeg(0.2);

  // Arms (outstretched forward for zombie posture)
  const armGeom = new THREE.BoxGeometry(0.28, 0.8, 0.28);
  const createArm = (x: number) => {
    const armGroup = new THREE.Group();
    armGroup.position.set(x, 1.5, 0);
    const armMesh = new THREE.Mesh(armGeom, skinMat);
    armMesh.position.set(0, -0.35, 0.25);
    armMesh.rotation.x = -Math.PI / 2.2; // Pointed forward
    armMesh.castShadow = true;
    armGroup.add(armMesh);
    group.add(armGroup);
    return armGroup;
  };
  const leftArm = createArm(-0.48);
  const rightArm = createArm(0.48);

  return { group, head: headGroup, leftLegFront, rightLegFront, leftArm, rightArm };
}

// 3. Web Audio Synth Sound Effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSoundEffect(type: "hit" | "block_break" | "pickup" | "eat" | "player_hurt" | "player_death") {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === "pickup") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "block_break") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "hit") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "player_hurt") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "eat") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.1);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "player_death") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch {
    // Ignore audio context errors if blocked by browser autoplay policy
  }
}
