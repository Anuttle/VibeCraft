// iPad Safari ignores `user-scalable=no` in the viewport tag, so a double tap
// or a pinch can zoom the whole game. Once zoomed, the game view takes every
// touch for looking around, so students can't pinch back out. Block page zoom
// in code instead.

const DOUBLE_TAP_MS = 350;

/** Text fields keep their normal behavior (double tap selects a word). */
const isTextField = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

/**
 * Controls are left alone so quick repeated taps (setting type letter by letter)
 * all register; `touch-action: manipulation` in the CSS already stops them zooming.
 */
const isControl = (target: EventTarget | null) =>
  target instanceof Element && target.closest("button, a, input, textarea, select, label, [role='button'], [role='radio']") !== null;

export function preventPageZoom() {
  // Safari's pinch gestures.
  for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
  }

  // Pinch in browsers that report it as a two-finger touch move.
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1 && (e as TouchEvent & { scale?: number }).scale !== undefined && (e as TouchEvent & { scale?: number }).scale !== 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Double-tap zoom on the page background or game view: cancel the second tap.
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = e.timeStamp;
      if (now - lastTouchEnd < DOUBLE_TAP_MS && e.changedTouches.length === 1 && !isControl(e.target)) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  document.addEventListener("dblclick", (e) => {
    if (!isTextField(e.target)) e.preventDefault();
  });
}
