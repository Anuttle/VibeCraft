import * as THREE from "three";

export enum MobType {
  PIG = "pig",
}

export interface MobEntity {
  id: string;
  type: MobType;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotationY: number;
  group: THREE.Group;
  head: THREE.Object3D;
  leftLegFront?: THREE.Object3D;
  rightLegFront?: THREE.Object3D;
  leftLegBack?: THREE.Object3D;
  rightLegBack?: THREE.Object3D;

  // Wandering state
  walkTimer: number;
  targetDirection: THREE.Vector3;
  isGrounded: boolean;
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

export function playSoundEffect(type: "block_break" | "pickup" | "success") {
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
    } else if (type === "success") {
      // Rising three-note chime for a completed goal
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.11;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      });
    }
  } catch {
    // Ignore audio context errors if blocked by browser autoplay policy
  }
}
