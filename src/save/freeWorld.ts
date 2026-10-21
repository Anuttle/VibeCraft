import { readJson, removeKey, writeJson } from "./storage";

/**
 * A student's free-build world: the terrain seed, so the same land comes back,
 * and every block they placed or broke, by chunk ("cx,cz") then block index.
 */
export interface FreeWorld {
  seed: string;
  edits: Record<string, Record<number, number>>;
}

const key = (profileId: string) => `freeWorld.${profileId}`;

export function loadFreeWorld(profileId: string): FreeWorld {
  const saved = readJson<FreeWorld | null>(key(profileId), null);
  if (saved && typeof saved.seed === "string" && saved.edits && typeof saved.edits === "object") return saved;
  return { seed: `free_${profileId}`, edits: {} };
}

/**
 * Record one block change and save soon after. Saving waits for a pause in
 * building so a run of quick edits is written once.
 */
export function freeWorldRecorder(profileId: string, world: FreeWorld) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    writeJson(key(profileId), world);
  };
  return {
    record(chunkKey: string, index: number, block: number) {
      (world.edits[chunkKey] ??= {})[index] = block;
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, 1500);
    },
    flush,
  };
}

export function clearFreeWorld(profileId: string): void {
  removeKey(key(profileId));
}
