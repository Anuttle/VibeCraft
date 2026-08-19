import React from "react";
import * as THREE from "three";
import { Compass, HelpCircle, Sun, Moon, Sunset, Clock } from "lucide-react";
import { InventorySlot } from "../types";
import { ITEM_REGISTRY } from "../utils/items";

interface HUDProps {
  isLocked: boolean;
  position: THREE.Vector3;
  facing: string;
  activeSlotIndex: number;
  onActiveSlotIndexChange: (idx: number) => void;
  hotbar: InventorySlot[];
  timePhase?: string;
  timeFormatted?: string;
  onCycleTime?: () => void;
  health?: number;
  maxHealth?: number;
  hunger?: number;
  maxHunger?: number;
  mobsKilled?: number;
  isHurtFlash?: boolean;
  isDead?: boolean;
  onRespawn?: () => void;
  onEatFood?: () => void;
  biomeName?: string;
}

export default function HUD({
  isLocked,
  position,
  facing,
  activeSlotIndex,
  onActiveSlotIndexChange,
  hotbar,
  timePhase = "Day",
  timeFormatted = "12:00 PM",
  onCycleTime,
  health = 20,
  maxHealth = 20,
  hunger = 20,
  maxHunger = 20,
  mobsKilled = 0,
  isHurtFlash = false,
  isDead = false,
  onRespawn,
  onEatFood,
  biomeName = "Plains",
}: HUDProps) {
  // Format position floats to 2 decimals
  const xStr = position.x.toFixed(2);
  const yStr = position.y.toFixed(2);
  const zStr = position.z.toFixed(2);

  const activeSlot = hotbar[activeSlotIndex];
  const activeItemDef = activeSlot && activeSlot.itemId ? ITEM_REGISTRY[activeSlot.itemId] : null;
  const activeItemName = activeItemDef ? activeItemDef.name : "Hand";

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Red Damage Vignette Flash Effect */}
      {isHurtFlash && (
        <div className="fixed inset-0 bg-rose-600/30 border-8 border-rose-600/60 pointer-events-none z-40 transition-opacity duration-150 animate-pulse" />
      )}

      {/* Death Screen Overlay */}
      {isDead && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center pointer-events-auto animate-fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-rose-900/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <span className="text-5xl mb-2">☠️</span>
            <h1 className="text-4xl font-black text-rose-500 font-sans uppercase tracking-wider">
              You Died!
            </h1>
            <p className="text-slate-400 text-sm font-mono">
              You fell in combat during your survival adventure.
            </p>
            
            <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex justify-around my-2 text-sm font-mono">
              <div className="flex flex-col items-center">
                <span className="text-slate-500 text-xs">MOBS DEFEATED</span>
                <span className="text-2xl font-black text-emerald-400">{mobsKilled}</span>
              </div>
            </div>

            <button
              onClick={onRespawn}
              className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-sm tracking-wider uppercase shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Respawn
            </button>
          </div>
        </div>
      )}

      {/* Top Bar: Game Info (Left) & Time/Celestial Widget (Right) */}
      <div className="flex justify-between items-start w-full">
        {/* Top Left: Engine Coordinates */}
        <div 
          id="coordinates-card"
          className="backdrop-blur-md bg-slate-900/80 border border-slate-700/60 rounded-xl p-3.5 w-fit flex flex-col gap-1 text-slate-100 shadow-xl pointer-events-auto animate-fade-in"
        >
          <div className="flex items-center gap-2 border-b border-slate-700/50 pb-1.5 mb-1">
            <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">Engine Coordinates</span>
          </div>
          <div className="grid grid-cols-3 gap-x-4 font-mono text-sm">
            <div>
              <span className="text-slate-500 font-bold mr-1">X:</span>
              <span id="hud-x" className="text-emerald-300 font-bold">{xStr}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold mr-1">Y:</span>
              <span id="hud-y" className="text-sky-300 font-bold">{yStr}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold mr-1">Z:</span>
              <span id="hud-z" className="text-rose-300 font-bold">{zStr}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-700/30 text-xs text-slate-300">
            <span className="text-slate-400 font-mono">Facing:</span>
            <span id="hud-facing" className="font-bold text-amber-400 font-mono tracking-wide">{facing}</span>
          </div>
          <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-700/20 text-xs text-slate-400">
            <span className="font-mono text-slate-400">Current Biome:</span>
            <span className="font-mono text-[11px] text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">🏞️ {biomeName}</span>
          </div>
          <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-700/20 text-xs text-slate-400">
            <span className="font-mono text-slate-400">Mobs Defeated:</span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">⚔️ {mobsKilled}</span>
          </div>
        </div>

        {/* Top Right: Time of Day & Lighting Widget */}
        <div 
          onClick={onCycleTime}
          title="Click or press [T] to cycle time of day"
          className="backdrop-blur-md bg-slate-900/80 border border-slate-700/60 hover:border-amber-500/50 rounded-xl p-3 flex items-center gap-3 text-slate-100 shadow-xl pointer-events-auto cursor-pointer transition-all hover:scale-105 select-none"
        >
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            {timePhase === "Night" ? (
              <Moon className="w-5 h-5 text-indigo-300 animate-pulse" />
            ) : timePhase === "Sunset" || timePhase === "Sunrise" ? (
              <Sunset className="w-5 h-5 text-orange-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            )}
          </div>
          <div className="flex flex-col pr-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-sm font-black text-amber-300">{timeFormatted}</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              {timePhase} • Press [T]
            </span>
          </div>
        </div>
      </div>

      {/* Center Screen: Precision Crosshair */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Horizontal Bar */}
            <div className="absolute w-5 h-[2px] bg-white opacity-80 rounded-full mix-blend-difference" />
            {/* Vertical Bar */}
            <div className="absolute h-5 w-[2px] bg-white opacity-80 rounded-full mix-blend-difference" />
            {/* Center Dot */}
            <div className="w-[4px] h-[4px] bg-white rounded-full mix-blend-difference" />
          </div>
        </div>
      )}

      {/* Bottom Layout: Hotbar and Guide */}
      <div className="w-full flex justify-between items-end pointer-events-none gap-6">
        {/* Empty left spacer for layout balance */}
        <div className="w-[220px]" />

        {/* Center: Minecraft Hotbar (Interactive & Synced) */}
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* Survival Bars: Health Hearts & Hunger Shanks */}
          <div className="flex justify-between items-center w-full px-2 gap-8 text-sm select-none">
            {/* Health Hearts (10 Hearts = 20 HP) */}
            <div className="flex items-center gap-0.5" title={`Health: ${health}/${maxHealth}`}>
              {Array.from({ length: 10 }).map((_, i) => {
                const heartHp = (i + 1) * 2;
                if (health >= heartHp) {
                  return <span key={i} className="text-rose-500 text-xs drop-shadow">❤️</span>;
                } else if (health >= heartHp - 1) {
                  return <span key={i} className="text-rose-400 text-xs drop-shadow">💔</span>;
                } else {
                  return <span key={i} className="text-slate-700 text-xs opacity-60">🖤</span>;
                }
              })}
            </div>

            {/* Hunger Shanks (10 Shanks = 20 Hunger) */}
            <div className="flex items-center gap-0.5 cursor-pointer" onClick={onEatFood} title={`Hunger: ${hunger}/${maxHunger}`}>
              {Array.from({ length: 10 }).map((_, i) => {
                const shankVal = (i + 1) * 2;
                if (hunger >= shankVal) {
                  return <span key={i} className="text-amber-500 text-xs drop-shadow">🥩</span>;
                } else if (hunger >= shankVal - 1) {
                  return <span key={i} className="text-amber-600 text-xs drop-shadow opacity-80">🍖</span>;
                } else {
                  return <span key={i} className="text-slate-700 text-xs opacity-60">🦴</span>;
                }
              })}
            </div>
          </div>

          {/* Selected Block/Tool Name Label */}
          <div className="bg-slate-950/85 border border-slate-800 rounded-full px-3 py-1 shadow-md backdrop-blur-sm transition-all duration-300">
            <span className="text-xs font-bold font-mono tracking-wide text-slate-200">
              {activeItemName}
            </span>
          </div>

          {/* Slots Container */}
          <div 
            id="hotbar-slots"
            className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-md"
          >
            {hotbar.map((slot, idx) => {
              const isSelected = idx === activeSlotIndex;
              const itemDef = slot.itemId ? ITEM_REGISTRY[slot.itemId] : null;

              return (
                <button
                  key={idx}
                  onClick={() => onActiveSlotIndexChange(idx)}
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-slate-800 border-2 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/10 -translate-y-1"
                      : "bg-slate-950/50 border border-slate-800 hover:bg-slate-800/40 hover:border-slate-700"
                  }`}
                  title={itemDef ? itemDef.name : "Empty Slot"}
                >
                  {itemDef ? (
                    <div className="relative w-8 h-8 flex items-center justify-center select-none text-xl">
                      {/* Emoji Icon representation */}
                      {itemDef.emoji}
                      {/* Count Badge */}
                      {slot.count > 1 && (
                        <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[9px] font-black text-white bg-slate-950 border border-slate-700 px-1 rounded-sm shadow-md">
                          {slot.count}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-6 h-6 border border-dashed border-slate-800/40 rounded-md" />
                  )}

                  {/* Tool Durability Bar */}
                  {itemDef && itemDef.maxDurability && (
                    <div className="absolute bottom-1 left-1.5 right-1.5 h-1 bg-slate-950/90 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          ((slot.durability ?? itemDef.maxDurability) / itemDef.maxDurability) > 0.5
                            ? "bg-emerald-400"
                            : ((slot.durability ?? itemDef.maxDurability) / itemDef.maxDurability) > 0.2
                            ? "bg-amber-400"
                            : "bg-rose-500"
                        }`}
                        style={{
                          width: `${Math.max(0, Math.min(100, ((slot.durability ?? itemDef.maxDurability) / itemDef.maxDurability) * 100))}%`
                        }}
                      />
                    </div>
                  )}

                  {/* Hotkey Number in Corner */}
                  <span className="absolute top-0.5 left-1 font-mono text-[8px] font-bold text-slate-500">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Right: Miniature Movement & Block Guide Overlay */}
        <div 
          id="mini-controls-overlay"
          className="pointer-events-auto backdrop-blur-md bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 w-[220px] flex flex-col gap-2 shadow-lg"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Controls Guide
          </span>
          <div className="flex flex-col gap-1.5 text-xs text-slate-300 font-medium font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">WASD</span>
              <span className="text-slate-100 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px]">Move</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">SPACE</span>
              <span className="text-slate-100 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px]">Jump</span>
            </div>
            {isLocked && (
              <>
                <div className="flex justify-between items-center border-t border-slate-800/60 pt-1.5 mt-0.5">
                  <span className="text-slate-500">LEFT CLICK</span>
                  <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Break</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">RIGHT CLICK</span>
                  <span className="text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Place</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">1 - 9 / Scroll</span>
                  <span className="text-slate-100 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px]">Hotbar</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/60 pt-1.5 mt-0.5">
                  <span className="text-slate-500">E</span>
                  <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Inventory</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Q</span>
                  <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Drop Item</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">R</span>
                  <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Unstuck</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center border-t border-slate-800/60 pt-1.5 mt-0.5">
              <span className="text-slate-500">ESC</span>
              <span className="text-slate-100 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px]">Unlock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
