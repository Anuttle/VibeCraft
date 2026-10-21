import React, { useRef, useState } from "react";
import { ArrowUp, Pause } from "lucide-react";
import { gameActions, touchInput } from "../game/input";
import { useApp } from "../AppContext";

interface TouchControlsProps {
  onOpenBag: () => void;
  onPause: () => void;
}

const STICK_RADIUS = 56;

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const update = (e: React.PointerEvent) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > STICK_RADIUS) {
      dx = (dx / len) * STICK_RADIUS;
      dy = (dy / len) * STICK_RADIUS;
    }
    setKnob({ x: dx, y: dy });
    // Small dead zone so a resting thumb doesn't drift.
    const nx = dx / STICK_RADIUS;
    const ny = -dy / STICK_RADIUS;
    const mag = Math.hypot(nx, ny);
    touchInput.moveX = mag < 0.15 ? 0 : nx;
    touchInput.moveY = mag < 0.15 ? 0 : ny;
  };

  const release = () => {
    pointerId.current = null;
    setKnob({ x: 0, y: 0 });
    touchInput.moveX = 0;
    touchInput.moveY = 0;
  };

  return (
    <div
      ref={baseRef}
      className="pointer-events-auto relative h-36 w-36 touch-none rounded-full border-2 border-white/30 bg-stone-900/40 backdrop-blur-sm"
      onPointerDown={(e) => {
        e.preventDefault();
        pointerId.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e);
      }}
      onPointerMove={(e) => {
        if (e.pointerId === pointerId.current) update(e);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        className="absolute left-1/2 top-1/2 h-16 w-16 rounded-full border-2 border-white/60 bg-white/30 shadow-lg"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}

function ActionButton({
  label,
  children,
  onPress,
  onRelease,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  onPress: () => void;
  onRelease?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`pointer-events-auto flex touch-none select-none items-center justify-center rounded-full border-2 border-white/40 bg-stone-900/60 text-3xl text-white shadow-lg backdrop-blur-sm active:scale-90 active:bg-amber-500/70 ${className}`}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
    >
      {children}
    </button>
  );
}

/**
 * On-screen controls for touch devices. Looking around is handled by dragging
 * on the game view itself (see GameCanvas); these controls sit above it.
 */
export default function TouchControls({ onOpenBag, onPause }: TouchControlsProps) {
  const app = useApp();

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      <div className="absolute right-4 top-4 flex gap-3">
        <ActionButton label={app.ui("bag")} onPress={onOpenBag} className="h-16 w-16 text-2xl">
          🎒
        </ActionButton>
        <ActionButton label={app.ui("pause")} onPress={onPause} className="h-16 w-16">
          <Pause className="h-7 w-7" />
        </ActionButton>
      </div>

      <div className="absolute bottom-28 left-8">
        <Joystick />
      </div>

      <div className="absolute bottom-28 right-8 grid grid-cols-2 gap-4">
        <ActionButton label={app.ui("placeBlock")} onPress={() => gameActions.secondary?.()} className="h-20 w-20">
          🧱
        </ActionButton>
        <ActionButton
          label={app.ui("breakBlock")}
          onPress={() => gameActions.breakStart?.()}
          onRelease={() => gameActions.breakStop?.()}
          className="h-20 w-20"
        >
          ⛏
        </ActionButton>
        <div />
        <ActionButton
          label={app.ui("jump")}
          onPress={() => {
            touchInput.jump = true;
          }}
          onRelease={() => {
            touchInput.jump = false;
          }}
          className="h-20 w-20"
        >
          <ArrowUp className="h-9 w-9" />
        </ActionButton>
      </div>
    </div>
  );
}
