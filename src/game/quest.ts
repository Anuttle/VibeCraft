import { Band, Line } from "../i18n/types";
import { StationId, WorldSetup } from "./world";

/** Something the game world reports that objectives can react to. */
export type GameEvent =
  | { type: "walked"; distance: number }
  | { type: "looked"; angle: number }
  | { type: "collected"; itemId: string; count: number }
  | { type: "placed"; blockItemId: string }
  | { type: "inventory_opened" }
  | { type: "crafted"; itemId: string; count: number }
  | { type: "talked"; npcId: string }
  | { type: "station_done"; station: StationId };

export type Objective =
  | { type: "walk"; distance: number }
  | { type: "look"; angle: number }
  | { type: "collect"; itemId: string; count: number }
  | { type: "place"; count: number }
  | { type: "open_inventory" }
  | { type: "craft"; itemId: string; count: number }
  | { type: "talk"; npcId: string }
  | { type: "station"; station: StationId };

export interface ObjectiveText {
  /** What to do. May use {n} for the target amount. */
  goal: Line;
  /** How to do it with touch controls. */
  hintTouch?: Line;
  /** How to do it with a keyboard and mouse. */
  hintMouse?: Line;
}

export interface DialogueLine {
  /** Content id, used for audio file lookup. */
  id: string;
  speaker: Line;
  text: Line;
}

export interface Step {
  id: string;
  /** Grade bands that see this step. Omitted means every band. */
  bands?: Band[];
  dialogue?: DialogueLine[];
  objective?: Objective;
  objectiveText?: ObjectiveText;
}

export interface Chapter {
  id: string;
  world?: WorldSetup;
  steps: Step[];
}

export interface QuestState {
  stepIndex: number;
  dialogueIndex: number;
  progress: number;
  done: boolean;
}

export const INITIAL_QUEST_STATE: QuestState = {
  stepIndex: 0,
  dialogueIndex: 0,
  progress: 0,
  done: false,
};

export function stepsForBand(chapter: Chapter, band: Band): Step[] {
  return chapter.steps.filter((s) => !s.bands || s.bands.includes(band));
}

export function objectiveTarget(o: Objective): number {
  switch (o.type) {
    case "walk":
      return o.distance;
    case "look":
      return o.angle;
    case "collect":
    case "craft":
    case "place":
      return o.count;
    case "open_inventory":
    case "talk":
    case "station":
      return 1;
  }
}

/** How much an event advances an objective (0 if unrelated). */
function eventProgress(o: Objective, e: GameEvent): number {
  if (o.type === "walk" && e.type === "walked") return e.distance;
  if (o.type === "look" && e.type === "looked") return e.angle;
  if (o.type === "collect" && e.type === "collected" && e.itemId === o.itemId) return e.count;
  if (o.type === "place" && e.type === "placed") return 1;
  if (o.type === "open_inventory" && e.type === "inventory_opened") return 1;
  if (o.type === "craft" && e.type === "crafted" && e.itemId === o.itemId) return e.count;
  if (o.type === "talk" && e.type === "talked" && e.npcId === o.npcId) return 1;
  if (o.type === "station" && e.type === "station_done" && e.station === o.station) return 1;
  return 0;
}

export function isDialogueActive(steps: Step[], s: QuestState): boolean {
  if (s.done) return false;
  const step = steps[s.stepIndex];
  return !!step?.dialogue && s.dialogueIndex < step.dialogue.length;
}

/** Move past steps that have nothing left to do (no remaining dialogue, no objective). */
function settle(steps: Step[], s: QuestState): QuestState {
  let next = s;
  while (!next.done) {
    const step = steps[next.stepIndex];
    if (!step) return { ...next, done: true };
    const dialogueLeft = !!step.dialogue && next.dialogueIndex < step.dialogue.length;
    if (dialogueLeft || step.objective) return next;
    next = { stepIndex: next.stepIndex + 1, dialogueIndex: 0, progress: 0, done: false };
  }
  return next;
}

function completeStep(steps: Step[], s: QuestState): QuestState {
  const next = { stepIndex: s.stepIndex + 1, dialogueIndex: 0, progress: 0, done: false };
  if (next.stepIndex >= steps.length) return { ...next, stepIndex: steps.length, done: true };
  return settle(steps, next);
}

export function advanceDialogue(steps: Step[], s: QuestState): QuestState {
  if (!isDialogueActive(steps, s)) return s;
  const advanced = { ...s, dialogueIndex: s.dialogueIndex + 1 };
  const step = steps[s.stepIndex];
  if (advanced.dialogueIndex >= (step.dialogue?.length ?? 0) && !step.objective) {
    return completeStep(steps, advanced);
  }
  return advanced;
}

export function applyEvent(steps: Step[], s: QuestState, e: GameEvent): QuestState {
  if (s.done || isDialogueActive(steps, s)) return s;
  const step = steps[s.stepIndex];
  if (!step?.objective) return s;
  const gained = eventProgress(step.objective, e);
  if (gained <= 0) return s;
  const progress = s.progress + gained;
  if (progress >= objectiveTarget(step.objective)) return completeStep(steps, s);
  return { ...s, progress };
}

/** Clamp saved state to the current step list (the band may have changed since saving). */
export function normalizeState(steps: Step[], s: QuestState | undefined): QuestState {
  if (!s) return settle(steps, INITIAL_QUEST_STATE);
  if (s.done) return s;
  if (s.stepIndex >= steps.length) return { ...INITIAL_QUEST_STATE, stepIndex: steps.length, done: true };
  return settle(steps, s);
}
