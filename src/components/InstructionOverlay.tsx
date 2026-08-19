import React from "react";
import { Play, MousePointer, Move, ShieldAlert } from "lucide-react";

interface InstructionOverlayProps {
  isLocked: boolean;
  onStartClick: () => void;
}

export default function InstructionOverlay({
  isLocked,
  onStartClick,
}: InstructionOverlayProps) {
  if (isLocked) return null;

  return (
    <div
      id="start-overlay"
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300"
    >
      <div 
        id="modal-box"
        className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        {/* Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />

        {/* Header */}
        <h1 className="text-3xl font-black tracking-tight text-slate-100 font-sans uppercase">
          Minecraft Clone
        </h1>
        <p className="text-rose-400 font-mono text-xs uppercase tracking-widest mt-1.5 font-bold">
          Survival Expansion • Milestone 9 Complete
        </p>

        {/* Feature status */}
        <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-md">
          Welcome to Milestone 9 of the Voxel Engine!
          Features procedural Passive Mobs (Pigs) & Hostile Mobs (Zombies), melee combat with swords/tools, knockback physics, particle sparks, health & hunger systems, food eating, and mob loot drops!
        </p>

        {/* Controls Grid */}
        <div className="w-full grid grid-cols-2 gap-4 my-6 text-left">
          <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-200">Melee Combat & Attack</h3>
              <p className="text-xs text-slate-400 mt-1">
                Equip a <strong className="text-slate-300 font-mono">Sword/Tool</strong> and <strong className="text-rose-400 font-mono">Left-Click</strong> mobs to attack, trigger knockback, and earn mob loot!
              </p>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <MousePointer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-200">Survival & Eating</h3>
              <p className="text-xs text-slate-400 mt-1">
                Select food items (Cooked Porkchop, Apples) and press <strong className="text-amber-400 font-mono">F</strong> or <strong className="text-slate-300 font-mono">Right-Click</strong> to restore Hunger and Health!
              </p>
            </div>
          </div>
        </div>

        {/* Physics Warning */}
        <div className="w-full bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 mb-6 text-left flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-xs text-rose-400 font-sans">Hostile Mob Warning</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
              Zombies spawn during the night or in dark areas and will actively pursue and attack you! Defend yourself with swords or build shelter. Press <strong className="text-emerald-400 font-mono">R</strong> to teleport if stuck.
            </p>
          </div>
        </div>

        {/* Call To Action */}
        <button
          onClick={onStartClick}
          className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-rose-600/20 cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-5 h-5 fill-current" />
          Click to Play & Lock Cursor
        </button>

        {/* Milestone Indicator */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 w-full flex justify-between items-center text-xs text-slate-500">
          <span>Active Phase</span>
          <span className="font-mono text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded">Milestone 9 / 10 • Mobs, Combat & Survival</span>
        </div>
      </div>
    </div>
  );
}
