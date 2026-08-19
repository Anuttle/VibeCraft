/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import InstructionOverlay from "./components/InstructionOverlay";
import InventoryMenu from "./components/InventoryMenu";
import { BlockType, InventorySlot } from "./types";
import { ITEM_REGISTRY } from "./utils/items";
import { playSoundEffect } from "./utils/mobs";

export default function App() {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [playerPosition, setPlayerPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 1.8, 5)
  );
  const [facingDirection, setFacingDirection] = useState<string>("South");
  const [biomeName, setBiomeName] = useState<string>("Plains");

  // Core combined inventory state: 9 hotbar slots, 27 main inventory slots
  const [playerInventory, setPlayerInventory] = useState<{
    hotbar: InventorySlot[];
    inventory: InventorySlot[];
  }>({
    hotbar: [
      { itemId: "stone_sword", count: 1, durability: 131 },
      { itemId: "cooked_porkchop", count: 8 },
      { itemId: "wooden_pickaxe", count: 1, durability: 60 },
      { itemId: "torch", count: 16 },
      { itemId: "grass_block", count: 64 },
      { itemId: "wood_log", count: 32 },
      { itemId: "wooden_axe", count: 1, durability: 60 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
    ],
    inventory: Array.from({ length: 27 }, (_, i) => {
      if (i === 0) return { itemId: "cobblestone", count: 64 };
      if (i === 1) return { itemId: "coal", count: 16 };
      if (i === 2) return { itemId: "dirt", count: 32 };
      if (i === 3) return { itemId: "raw_iron", count: 8 };
      if (i === 4) return { itemId: "stick", count: 12 };
      if (i === 5) return { itemId: "apple", count: 6 };
      return { itemId: "", count: 0 };
    }),
  });

  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isCraftingTableOpen, setIsCraftingTableOpen] = useState<boolean>(false);

  // Survival Mechanics State (Milestone 9)
  const [health, setHealth] = useState<number>(20);
  const [hunger, setHunger] = useState<number>(20);
  const [mobsKilled, setMobsKilled] = useState<number>(0);
  const [isHurtFlash, setIsHurtFlash] = useState<boolean>(false);
  const [isDead, setIsDead] = useState<boolean>(false);

  // Time of Day state
  const [timeInfo, setTimeInfo] = useState({
    timeVal: 0.5,
    phase: "Day",
    formatted: "12:00 PM",
  });
  const cycleTimeRef = useRef<(() => void) | null>(null);

  const handleTimeUpdate = useCallback((timeVal: number, phase: string, formatted: string) => {
    setTimeInfo({ timeVal, phase, formatted });
  }, []);

  const handleCycleTime = useCallback(() => {
    if (cycleTimeRef.current) {
      cycleTimeRef.current();
    }
  }, []);

  // Player Damage & Health Management
  const handlePlayerHurt = useCallback((damageAmount: number) => {
    playSoundEffect("player_hurt");
    setIsHurtFlash(true);
    setTimeout(() => setIsHurtFlash(false), 250);

    setHealth((prev) => {
      const nextHp = Math.max(0, prev - damageAmount);
      if (nextHp <= 0) {
        setIsDead(true);
        playSoundEffect("player_death");
        document.exitPointerLock();
      }
      return nextHp;
    });
  }, []);

  // Player Eating Food
  const handleEatFood = useCallback(() => {
    setPlayerInventory((prev) => {
      const hotbarCopy = prev.hotbar.map((slot) => ({ ...slot }));
      const activeSlot = hotbarCopy[activeSlotIndex];
      if (!activeSlot || !activeSlot.itemId) return prev;

      const itemDef = ITEM_REGISTRY[activeSlot.itemId];
      if (itemDef && itemDef.type === "food" && itemDef.foodRestore) {
        playSoundEffect("eat");
        
        // Restore hunger and health
        setHunger((h) => Math.min(20, h + itemDef.foodRestore!));
        setHealth((hp) => Math.min(20, hp + 3));

        // Consume 1 count of food item
        activeSlot.count--;
        if (activeSlot.count <= 0) {
          activeSlot.itemId = "";
        }
        return { ...prev, hotbar: hotbarCopy };
      }
      return prev;
    });
  }, [activeSlotIndex]);

  // Mob Kill counter
  const handleMobKilled = useCallback(() => {
    setMobsKilled((k) => k + 1);
  }, []);

  // Player Respawn
  const handleRespawn = useCallback(() => {
    setHealth(20);
    setHunger(20);
    setIsDead(false);
  }, []);

  // Reference to spawn physical world drops from the inventory screen
  const spawnDropExternalRef = useRef<((itemId: string, count: number) => void) | null>(null);

  const handleLockChange = useCallback((locked: boolean) => {
    setIsLocked(locked);
  }, []);

  const handlePositionChange = useCallback((pos: THREE.Vector3, dir: string, currentBiome?: string) => {
    setPlayerPosition(pos);
    setFacingDirection(dir);
    if (currentBiome) {
      setBiomeName(currentBiome);
    }
  }, []);

  const triggerLock = useCallback(() => {
    const canvasElement = document.getElementById("canvas-mount");
    if (canvasElement) {
      canvasElement.requestPointerLock();
    }
  }, []);

  const handleToggleInventory = useCallback(() => {
    setIsInventoryOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsCraftingTableOpen(false);
        // Re-lock cursor on close
        setTimeout(triggerLock, 10);
      } else {
        setIsCraftingTableOpen(false);
        // Unlock cursor on open
        document.exitPointerLock();
      }
      return next;
    });
  }, [triggerLock]);

  const handleOpenCraftingTable = useCallback(() => {
    setIsCraftingTableOpen(true);
    setIsInventoryOpen(true);
    document.exitPointerLock();
  }, []);

  // Place block action consummation
  const handleBlockPlaced = useCallback(() => {
    setPlayerInventory((prev) => {
      const hotbarCopy = prev.hotbar.map((slot) => ({ ...slot }));
      const activeSlot = hotbarCopy[activeSlotIndex];
      if (activeSlot && activeSlot.count > 0) {
        activeSlot.count--;
        if (activeSlot.count === 0) {
          activeSlot.itemId = "";
        }
      }
      return {
        ...prev,
        hotbar: hotbarCopy,
      };
    });
  }, [activeSlotIndex]);

  // Drop 1 held item (triggered by pressing Q in-game)
  const handleItemDroppedFromHotbar = useCallback(() => {
    setPlayerInventory((prev) => {
      const hotbarCopy = prev.hotbar.map((slot) => ({ ...slot }));
      const activeSlot = hotbarCopy[activeSlotIndex];
      if (activeSlot && activeSlot.count > 0) {
        activeSlot.count--;
        if (activeSlot.count === 0) {
          activeSlot.itemId = "";
        }
      }
      return {
        ...prev,
        hotbar: hotbarCopy,
      };
    });
  }, [activeSlotIndex]);

  // Pick up world item drop
  const handleItemPickedUp = useCallback((itemId: string, count: number): boolean => {
    let remaining = count;
    let success = false;

    setPlayerInventory((prev) => {
      const hotbarCopy = prev.hotbar.map((slot) => ({ ...slot }));
      const invCopy = prev.inventory.map((slot) => ({ ...slot }));
      const maxStack = ITEM_REGISTRY[itemId]?.maxStack ?? 64;

      // 1. Fill existing hotbar stacks
      for (let i = 0; i < hotbarCopy.length; i++) {
        if (hotbarCopy[i].itemId === itemId && hotbarCopy[i].count < maxStack) {
          const space = maxStack - hotbarCopy[i].count;
          const transfer = Math.min(space, remaining);
          hotbarCopy[i].count += transfer;
          remaining -= transfer;
          if (remaining === 0) break;
        }
      }

      // 2. Fill existing inventory stacks
      if (remaining > 0) {
        for (let i = 0; i < invCopy.length; i++) {
          if (invCopy[i].itemId === itemId && invCopy[i].count < maxStack) {
            const space = maxStack - invCopy[i].count;
            const transfer = Math.min(space, remaining);
            invCopy[i].count += transfer;
            remaining -= transfer;
            if (remaining === 0) break;
          }
        }
      }

      // 3. Put in empty hotbar slots
      if (remaining > 0) {
        for (let i = 0; i < hotbarCopy.length; i++) {
          if (hotbarCopy[i].itemId === "") {
            const itemDef = ITEM_REGISTRY[itemId];
            const dur = itemDef?.type === "tool" ? itemDef.maxDurability : undefined;
            hotbarCopy[i] = { itemId, count: remaining, durability: dur };
            remaining = 0;
            break;
          }
        }
      }

      // 4. Put in empty inventory slots
      if (remaining > 0) {
        for (let i = 0; i < invCopy.length; i++) {
          if (invCopy[i].itemId === "") {
            const itemDef = ITEM_REGISTRY[itemId];
            const dur = itemDef?.type === "tool" ? itemDef.maxDurability : undefined;
            invCopy[i] = { itemId, count: remaining, durability: dur };
            remaining = 0;
            break;
          }
        }
      }

      if (remaining === 0) {
        success = true;
      }

      return {
        hotbar: hotbarCopy,
        inventory: invCopy,
      };
    });

    return success;
  }, []);

  // Deduct 1 durability from held tool when mining blocks (Milestone 6 & 7)
  const handleToolUsed = useCallback((slotIndex: number) => {
    setPlayerInventory((prev) => {
      const hotbarCopy = prev.hotbar.map((slot) => ({ ...slot }));
      const activeSlot = hotbarCopy[slotIndex];
      if (activeSlot && activeSlot.itemId) {
        const itemDef = ITEM_REGISTRY[activeSlot.itemId];
        if (itemDef && itemDef.type === "tool") {
          const maxDur = itemDef.maxDurability || 60;
          const currentDur = activeSlot.durability ?? maxDur;
          const newDur = currentDur - 1;

          if (newDur <= 0) {
            // Tool breaks when durability reaches zero
            hotbarCopy[slotIndex] = { itemId: "", count: 0 };
          } else {
            hotbarCopy[slotIndex] = {
              ...activeSlot,
              durability: newDur,
            };
          }
        }
      }
      return {
        ...prev,
        hotbar: hotbarCopy,
      };
    });
  }, []);

  // Drop item from UI Inventory screen
  const handleDropItemFromUI = useCallback((itemId: string, count: number) => {
    if (spawnDropExternalRef.current) {
      spawnDropExternalRef.current(itemId, count);
    }
  }, []);

  // Set hotbar manually from Inventory UI
  const handleHotbarChange = useCallback((newHotbar: InventorySlot[]) => {
    setPlayerInventory((prev) => ({
      ...prev,
      hotbar: newHotbar,
    }));
  }, []);

  // Set inventory manually from Inventory UI
  const handleInventoryChange = useCallback((newInv: InventorySlot[]) => {
    setPlayerInventory((prev) => ({
      ...prev,
      inventory: newInv,
    }));
  }, []);

  // Resolve current active block based on held hotbar item
  const activeItem = playerInventory.hotbar[activeSlotIndex];
  const activeBlock = (activeItem && activeItem.itemId) ? (ITEM_REGISTRY[activeItem.itemId]?.blockType ?? BlockType.AIR) : BlockType.AIR;

  return (
    <div className="w-screen h-screen overflow-hidden relative font-sans bg-slate-950 flex flex-col">
      {/* 3D Game Canvas Engine */}
      <GameCanvas
        onLockChange={handleLockChange}
        isLocked={isLocked}
        onPositionChange={handlePositionChange}
        activeBlock={activeBlock}
        hotbar={playerInventory.hotbar}
        activeSlotIndex={activeSlotIndex}
        onActiveSlotIndexChange={setActiveSlotIndex}
        onBlockPlaced={handleBlockPlaced}
        onItemPickedUp={handleItemPickedUp}
        onItemDroppedFromHotbar={handleItemDroppedFromHotbar}
        onToggleInventory={handleToggleInventory}
        onToolUsed={handleToolUsed}
        onTimeUpdate={handleTimeUpdate}
        cycleTimeExternalRef={cycleTimeRef}
        spawnDropExternalRef={spawnDropExternalRef}
        onPlayerHurt={handlePlayerHurt}
        onMobKilled={handleMobKilled}
        onEatFood={handleEatFood}
        onOpenCraftingTable={handleOpenCraftingTable}
      />

      {/* Heads-Up Display (Coordinates, Compass, Celestial Clock & Hotbar) */}
      <HUD
        isLocked={isLocked}
        position={playerPosition}
        facing={facingDirection}
        activeSlotIndex={activeSlotIndex}
        onActiveSlotIndexChange={setActiveSlotIndex}
        hotbar={playerInventory.hotbar}
        timePhase={timeInfo.phase}
        timeFormatted={timeInfo.formatted}
        onCycleTime={handleCycleTime}
        health={health}
        hunger={hunger}
        mobsKilled={mobsKilled}
        isHurtFlash={isHurtFlash}
        isDead={isDead}
        onRespawn={handleRespawn}
        onEatFood={handleEatFood}
        biomeName={biomeName}
      />

      {/* Start Game & Pause Instruction Modal overlay */}
      <InstructionOverlay
        isLocked={isLocked}
        onStartClick={triggerLock}
      />

      {/* Interactive Inventory Screen Menu */}
      <InventoryMenu
        isOpen={isInventoryOpen}
        onClose={handleToggleInventory}
        inventory={playerInventory.inventory}
        hotbar={playerInventory.hotbar}
        onInventoryChange={handleInventoryChange}
        onHotbarChange={handleHotbarChange}
        onDropItem={handleDropItemFromUI}
        isCraftingTableOpen={isCraftingTableOpen}
      />
    </div>
  );
}
