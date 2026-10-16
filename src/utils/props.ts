import * as THREE from "three";
import { DecorKind, NpcDef } from "../game/world";

const box = (w: number, h: number, d: number, color: string) =>
  new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color }));

export interface HumanoidMesh {
  group: THREE.Group;
  head: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
}

/** Blocky person in a long robe. The group origin is at the feet. */
export function createHumanoidMesh(look: NpcDef["look"]): HumanoidMesh {
  const group = new THREE.Group();

  // Long robe covers the legs
  const robe = box(0.62, 1.1, 0.4, look.robe);
  robe.position.y = 0.55;
  group.add(robe);
  const torso = box(0.6, 0.55, 0.36, look.robe);
  torso.position.y = 1.37;
  group.add(torso);
  const belt = box(0.64, 0.08, 0.42, "#2b1d12");
  belt.position.y = 1.12;
  group.add(belt);

  const head = new THREE.Group();
  head.position.y = 1.65;
  const face = box(0.44, 0.44, 0.44, look.skin);
  face.position.y = 0.22;
  head.add(face);
  const hair = box(0.46, 0.14, 0.46, look.hair);
  hair.position.y = 0.38;
  head.add(hair);
  const beard = box(0.4, 0.18, 0.06, look.hair);
  beard.position.set(0, 0.05, 0.22);
  head.add(beard);
  for (const side of [-1, 1]) {
    const eye = box(0.07, 0.07, 0.02, "#1c1917");
    eye.position.set(side * 0.1, 0.26, 0.225);
    head.add(eye);
  }
  if (look.hat) {
    const brim = box(0.56, 0.06, 0.56, look.hat);
    brim.position.y = 0.47;
    head.add(brim);
    const crown = box(0.42, 0.2, 0.42, look.hat);
    crown.position.y = 0.6;
    head.add(crown);
  }
  group.add(head);

  const makeArm = (side: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.4, 1.6, 0);
    const sleeve = box(0.2, 0.6, 0.22, look.robe);
    sleeve.position.y = -0.3;
    pivot.add(sleeve);
    const hand = box(0.16, 0.12, 0.16, look.skin);
    hand.position.y = -0.64;
    pivot.add(hand);
    group.add(pivot);
    return pivot;
  };

  return { group, head, leftArm: makeArm(-1), rightArm: makeArm(1) };
}

/** Floating name label that always faces the camera. */
export function createNameTag(text: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = "bold 44px system-ui, sans-serif";
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width) + 48;
  canvas.width = width;
  canvas.height = 72;
  ctx.font = font;
  ctx.fillStyle = "rgba(28, 25, 23, 0.82)";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, 72, 20);
  ctx.fill();
  ctx.fillStyle = "#fde68a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, 38);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true }));
  sprite.scale.set((width / 72) * 0.24, 0.24, 1);
  sprite.renderOrder = 10;
  return sprite;
}

/**
 * Decorative props that sit on station blocks so they read as what they are.
 * The group origin is the bottom-center of the block.
 */
export function createDecor(kind: DecorKind): THREE.Group {
  const g = new THREE.Group();
  const wood = "#5b3a1e";
  const dark = "#3a2412";

  if (kind === "press") {
    // Two tall uprights, a head beam, the screw, the platen and the bar.
    for (const side of [-1, 1]) {
      const post = box(0.16, 2.4, 0.16, dark);
      post.position.set(side * 0.55, 1.2, 0);
      g.add(post);
    }
    const head = box(1.3, 0.22, 0.3, dark);
    head.position.y = 2.2;
    g.add(head);
    const screw = box(0.12, 0.7, 0.12, "#8a8a8a");
    screw.position.y = 1.75;
    g.add(screw);
    const platen = box(0.7, 0.1, 0.6, wood);
    platen.position.y = 1.35;
    g.add(platen);
    const bar = box(0.06, 0.06, 0.9, "#8a8a8a");
    bar.position.set(0, 1.7, 0.45);
    bar.rotation.y = 0.5;
    g.add(bar);
    const bed = box(1.1, 0.08, 1.2, "#2b2b2b");
    bed.position.y = 1.04;
    g.add(bed);
  } else if (kind === "typecase") {
    // Slanted tray of compartments on top of the cabinet.
    const tray = box(0.96, 0.06, 0.8, wood);
    tray.position.y = 1.18;
    tray.rotation.x = -0.35;
    g.add(tray);
    const back = new THREE.Group();
    back.position.y = 1.19;
    back.rotation.x = -0.35;
    for (let i = -2; i <= 2; i++) {
      const div = box(0.02, 0.06, 0.78, dark);
      div.position.set(i * 0.19, 0.05, 0);
      back.add(div);
    }
    for (let j = -1; j <= 1; j++) {
      const div = box(0.94, 0.06, 0.02, dark);
      div.position.set(0, 0.05, j * 0.26);
      back.add(div);
    }
    g.add(back);
  } else if (kind === "paper") {
    const sheet = box(0.8, 0.02, 0.6, "#fffaf0");
    sheet.position.y = 1.02;
    g.add(sheet);
  } else if (kind === "desk") {
    // Slanted writing surface with an open book and a quill pen.
    const top = box(0.9, 0.05, 0.7, wood);
    top.position.y = 1.12;
    top.rotation.x = -0.3;
    g.add(top);
    for (const side of [-1, 1]) {
      const page = box(0.32, 0.02, 0.42, "#f5ecd7");
      page.position.set(side * 0.17, 1.17, 0.02);
      page.rotation.x = -0.3;
      g.add(page);
    }
    const quill = box(0.02, 0.02, 0.4, "#f8fafc");
    quill.position.set(0.32, 1.3, 0.1);
    quill.rotation.set(0.6, 0.4, 0);
    g.add(quill);
  } else if (kind === "kiln") {
    // Brick dome with a glowing opening.
    const dome = box(0.8, 0.6, 0.8, "#7c2d12");
    dome.position.y = 1.3;
    g.add(dome);
    const cap = box(0.5, 0.25, 0.5, "#7c2d12");
    cap.position.y = 1.72;
    g.add(cap);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.02), new THREE.MeshBasicMaterial({ color: "#fb923c" }));
    glow.position.set(0, 1.22, 0.41);
    g.add(glow);
  } else if (kind === "furnace") {
    const chimney = box(0.4, 1.2, 0.4, "#292524");
    chimney.position.set(0, 1.6, -0.2);
    g.add(chimney);
    const pot = box(0.5, 0.2, 0.5, "#78716c");
    pot.position.y = 1.1;
    g.add(pot);
    const metal = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.4), new THREE.MeshBasicMaterial({ color: "#fdba74" }));
    metal.position.y = 1.21;
    g.add(metal);
  } else if (kind === "vat") {
    const water = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.02, 0.9),
      new THREE.MeshLambertMaterial({ color: "#cfe3ea", transparent: true, opacity: 0.85 })
    );
    water.position.y = 1.0;
    g.add(water);
    const mould = box(0.5, 0.04, 0.35, wood);
    mould.position.set(0, 1.08, 0.2);
    g.add(mould);
  } else if (kind === "counter") {
    // Account book, coins and a small balance.
    const book = box(0.4, 0.06, 0.3, "#7f1d1d");
    book.position.set(-0.2, 1.03, 0);
    g.add(book);
    for (let i = 0; i < 4; i++) {
      const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.015, 12), new THREE.MeshLambertMaterial({ color: "#eab308" }));
      coin.position.set(0.2 + (i % 2) * 0.12, 1.01 + Math.floor(i / 2) * 0.02, 0.05 * (i % 2));
      g.add(coin);
    }
  } else if (kind === "maptable") {
    const map = box(0.95, 0.02, 0.8, "#e9d8a6");
    map.position.y = 1.01;
    g.add(map);
    for (const [x, z] of [[-0.2, -0.1], [0.1, 0.15], [0.3, -0.2], [-0.05, 0.25]]) {
      const pin = box(0.04, 0.12, 0.04, "#b91c1c");
      pin.position.set(x, 1.08, z);
      g.add(pin);
    }
  } else if (kind === "claybench") {
    for (let i = 0; i < 6; i++) {
      const block = box(0.12, 0.12, 0.12, "#c2410c");
      block.position.set(-0.3 + (i % 3) * 0.3, 1.06, -0.15 + Math.floor(i / 3) * 0.3);
      g.add(block);
    }
  } else if (kind === "ink") {
    for (const side of [-1, 1]) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshLambertMaterial({ color: "#6b4a2b" }));
      ball.position.set(side * 0.22, 1.12, 0);
      g.add(ball);
      const handle = box(0.05, 0.25, 0.05, wood);
      handle.position.set(side * 0.22, 1.32, 0);
      g.add(handle);
    }
  }
  return g;
}
