// Shared, mutable input state written by the on-screen touch controls and read
// by the game loop every frame. Kept outside React so touch input never causes
// re-renders.

export type InputMode = "touch" | "mouse";

export const touchInput = {
  /** Joystick vector, -1..1. moveY > 0 is forward. */
  moveX: 0,
  moveY: 0,
  /** Look deltas in pixels, accumulated since the last frame. */
  lookDX: 0,
  lookDY: 0,
  jump: false,
};

/** Actions the game canvas registers so on-screen buttons can trigger them. */
export const gameActions: {
  primary: (() => void) | null;
  secondary: (() => void) | null;
  unstuck: (() => void) | null;
} = {
  primary: null,
  secondary: null,
  unstuck: null,
};

export function resetTouchInput() {
  touchInput.moveX = 0;
  touchInput.moveY = 0;
  touchInput.lookDX = 0;
  touchInput.lookDY = 0;
  touchInput.jump = false;
}

/**
 * Touch mode is used on any touch-capable device (iPad, Chromebook touchscreen,
 * phones). Keyboard movement still works in touch mode, so an iPad with a
 * keyboard case gets both. Can be forced with ?controls=touch or ?controls=mouse.
 */
export function detectInputMode(): InputMode {
  try {
    const forced = new URLSearchParams(window.location.search).get("controls");
    if (forced === "touch" || forced === "mouse") return forced;
    if (navigator.maxTouchPoints > 0) return "touch";
    if (window.matchMedia?.("(pointer: coarse)").matches) return "touch";
  } catch {
    // ignore
  }
  return "mouse";
}
