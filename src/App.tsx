/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import InventoryMenu from "./components/InventoryMenu";
import DialogueBox from "./components/DialogueBox";
import ObjectiveTracker from "./components/ObjectiveTracker";
import TouchControls from "./components/TouchControls";
import TeacherPanel from "./components/TeacherPanel";
import InteractPrompt from "./components/InteractPrompt";
import ActivityHost from "./components/minigames/ActivityHost";
import QuizGame from "./components/minigames/QuizGame";
import type { ActivityResult, QuizResult } from "./game/activities";
import { Interactable, StationId } from "./game/world";
import { ChapterComplete, ChapterSelect, JournalScreen, PauseMenu, ScreenFrame, TitleScreen } from "./components/screens";
import { GlossaryHost, GlossaryList } from "./components/Glossary";
import { PrintJob, PrintView } from "./components/Print";
import { AppContext, AppContextValue } from "./AppContext";
import { BlockType, InventorySlot } from "./types";
import { ITEM_REGISTRY } from "./utils/items";
import { playSoundEffect } from "./utils/mobs";
import { Lang } from "./i18n/types";
import { UI } from "./content/ui";
import { findChapter } from "./content/chapters";
import { narrator } from "./audio/narrator";
import { detectInputMode, gameActions } from "./game/input";
import { PlayerInventory, addItem, consumeHotbarItem, emptyInventory, wearTool } from "./game/inventory";
import {
  DialogueLine,
  GameEvent,
  INITIAL_QUEST_STATE,
  QuestState,
  advanceDialogue,
  applyEvent,
  isDialogueActive,
  normalizeState,
  stepsForBand,
} from "./game/quest";
import { ClassSettings, loadSettings, saveSettings } from "./settings/settings";
import {
  Profile,
  clearAllProfiles,
  createProfile,
  loadActiveProfileId,
  loadProfiles,
  saveActiveProfileId,
  saveProfiles,
} from "./save/profiles";

type Screen = "title" | "chapters" | "game" | "journal";

const journalCheckLabel = (lang: Lang) => UI.journalCheck[lang];

// Automated browser checks can skip activities with ?debug=1.
const DEBUG = new URLSearchParams(window.location.search).has("debug");

function lockPointer() {
  const canvas = document.getElementById("canvas-mount") as HTMLCanvasElement | null;
  if (!canvas?.requestPointerLock) return;
  try {
    // Newer browsers return a promise that rejects without a recent user gesture.
    const result = canvas.requestPointerLock() as unknown as Promise<void> | undefined;
    result?.catch?.(() => {});
  } catch {
    // The pause screen offers a click-to-play button as a fallback.
  }
}

function unlockPointer() {
  if (document.pointerLockElement) document.exitPointerLock();
}

export default function App() {
  const inputMode = useMemo(detectInputMode, []);
  const [settings, setSettings] = useState<ClassSettings>(loadSettings);
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    const id = loadActiveProfileId();
    return id && loadProfiles().some((p) => p.id === id) ? id : null;
  });
  const [langOverride, setLangOverride] = useState<Lang | null>(null);
  const [screen, setScreen] = useState<Screen>(() => (activeProfileId ? "chapters" : "title"));
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [printJob, setPrintJob] = useState<PrintJob | null>(null);
  const endPrint = useCallback(() => setPrintJob(null), []);

  const profile = profiles.find((p) => p.id === activeProfileId) ?? null;
  const lang: Lang = settings.allowLangSwitch ? profile?.lang ?? langOverride ?? settings.lang : settings.lang;
  const audio = settings.band === "K-2" ? true : profile?.audio ?? settings.audio;

  const ctx: AppContextValue = { lang, tier: settings.tier, band: settings.band, audio, inputMode };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI.gameTitle[lang];
  }, [lang]);

  // ---- Profiles -----------------------------------------------------------

  const updateProfile = useCallback((id: string, patch: (p: Profile) => Profile) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === id ? patch(p) : p));
      saveProfiles(next);
      return next;
    });
  }, []);

  const selectProfile = (id: string | null) => {
    setActiveProfileId(id);
    saveActiveProfileId(id);
    setScreen(id ? "chapters" : "title");
  };

  const handleCreateProfile = (name: string) => {
    narrator.unlock();
    const p = createProfile(name, settings.allowLangSwitch ? langOverride ?? undefined : undefined);
    const next = [...profiles, p];
    setProfiles(next);
    saveProfiles(next);
    selectProfile(p.id);
  };

  const handleLangChange = (l: Lang) => {
    if (profile) updateProfile(profile.id, (p) => ({ ...p, lang: l }));
    else setLangOverride(l);
  };

  // ---- Chapter and quest ----------------------------------------------------

  const [chapterId, setChapterId] = useState<string>("tutorial");
  const chapterInfo = findChapter(chapterId);
  const steps = useMemo(
    () => (chapterInfo?.chapter ? stepsForBand(chapterInfo.chapter, settings.band) : []),
    [chapterInfo, settings.band]
  );
  const [quest, setQuest] = useState<QuestState>(INITIAL_QUEST_STATE);
  const [completeDismissed, setCompleteDismissed] = useState(false);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const step = quest.done ? null : steps[quest.stepIndex] ?? null;
  const dialogueActive = screen === "game" && isDialogueActive(steps, quest);
  const currentLine = dialogueActive && step?.dialogue ? step.dialogue[quest.dialogueIndex] : null;
  const showComplete = screen === "game" && quest.done && !completeDismissed;

  // Save progress whenever the quest moves.
  useEffect(() => {
    if (screen !== "game" || !activeProfileId) return;
    updateProfile(activeProfileId, (p) => ({
      ...p,
      progress: {
        ...p.progress,
        [chapterId]: { quest, completed: (p.progress[chapterId]?.completed ?? false) || quest.done },
      },
    }));
  }, [quest, screen, activeProfileId, chapterId, updateProfile]);

  // Chime when a goal or the chapter is finished.
  const prevQuest = useRef(quest);
  useEffect(() => {
    const prev = prevQuest.current;
    prevQuest.current = quest;
    if (screen !== "game") return;
    const prevStep = steps[prev.stepIndex];
    const finishedObjective = prevStep?.objective && (quest.stepIndex !== prev.stepIndex || quest.done) && !prev.done;
    if (finishedObjective || (quest.done && !prev.done)) playSoundEffect("success");
  }, [quest, screen, steps]);

  const handleGameEvent = useCallback((e: GameEvent) => {
    setQuest((prev) => applyEvent(stepsRef.current, prev, e));
  }, []);

  // ---- Inventory --------------------------------------------------------------

  const [inv, setInvState] = useState<PlayerInventory>(emptyInventory);
  const invRef = useRef(inv);
  const setInv = useCallback((next: PlayerInventory) => {
    invRef.current = next;
    setInvState(next);
  }, []);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const activeSlotRef = useRef(activeSlotIndex);
  activeSlotRef.current = activeSlotIndex;
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCraftingTableOpen, setIsCraftingTableOpen] = useState(false);
  const spawnDropExternalRef = useRef<((itemId: string, count: number) => void) | null>(null);

  const handleItemPickedUp = useCallback(
    (itemId: string, count: number): boolean => {
      const { inv: next, remaining } = addItem(invRef.current, itemId, count);
      if (remaining === count) return false;
      setInv(next);
      return remaining === 0;
    },
    [setInv]
  );
  const handleBlockPlaced = useCallback(() => setInv(consumeHotbarItem(invRef.current, activeSlotRef.current)), [setInv]);
  const handleToolUsed = useCallback((slot: number) => setInv(wearTool(invRef.current, slot)), [setInv]);
  const handleHotbarChange = useCallback((hotbar: InventorySlot[]) => setInv({ ...invRef.current, hotbar }), [setInv]);
  const handleInventoryChange = useCallback(
    (inventory: InventorySlot[]) => setInv({ ...invRef.current, inventory }),
    [setInv]
  );
  const handleDropItemFromUI = useCallback((itemId: string, count: number) => {
    spawnDropExternalRef.current?.(itemId, count);
  }, []);

  // ---- Pausing, modals and pointer lock ---------------------------------------

  const [isLocked, setIsLocked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState<Interactable | null>(null);
  const [station, setStation] = useState<StationId | null>(null);
  const [adHocLine, setAdHocLine] = useState<DialogueLine | null>(null);
  const [typesetLines, setTypesetLines] = useState<string[] | null>(null);
  const [journalDismissed, setJournalDismissed] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const activity = station ? chapterInfo?.chapter?.activities?.[station] ?? null : null;
  const journalConfig = chapterInfo?.chapter?.journal?.[settings.band]?.[lang] ?? null;
  const journalDue = screen === "game" && !quest.done && !dialogueActive && step?.objective?.type === "journal";
  const journalOpen = journalDue && !journalDismissed && journalConfig !== null;

  const blockingModal =
    dialogueActive ||
    isInventoryOpen ||
    showComplete ||
    teacherOpen ||
    station !== null ||
    adHocLine !== null ||
    journalOpen;
  const showPause =
    screen === "game" && !blockingModal && (paused || (inputMode === "mouse" && !isLocked));
  const inputEnabled =
    screen === "game" && !blockingModal && !paused && (inputMode === "touch" || isLocked);

  const modalStateRef = useRef({ blockingModal, paused, screen });
  modalStateRef.current = { blockingModal, paused, screen };

  // Release the mouse when anything needs clicking.
  useEffect(() => {
    if (blockingModal) unlockPointer();
  }, [blockingModal]);

  // Resume pointer-locked play directly from the click that closes a modal.
  const resumeFromClick = useCallback(() => {
    if (inputMode === "mouse") lockPointer();
  }, [inputMode]);

  // Esc on a touch device with a keyboard pauses (mouse mode pauses on unlock).
  useEffect(() => {
    if (inputMode !== "touch") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" && modalStateRef.current.screen === "game") setPaused(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputMode]);

  const inventoryOpenRef = useRef(isInventoryOpen);
  inventoryOpenRef.current = isInventoryOpen;

  const handleToggleInventory = useCallback(() => {
    const { screen: s, paused: p, blockingModal: blocked } = modalStateRef.current;
    if (s !== "game" || p) return;
    if (inventoryOpenRef.current) {
      inventoryOpenRef.current = false;
      setIsInventoryOpen(false);
      setIsCraftingTableOpen(false);
      resumeFromClick();
      return;
    }
    // Don't open over dialogue, the teacher panel or the completion card.
    if (blocked) return;
    inventoryOpenRef.current = true;
    setIsInventoryOpen(true);
    setIsCraftingTableOpen(false);
    handleGameEvent({ type: "inventory_opened" });
  }, [handleGameEvent, resumeFromClick]);

  const handleOpenCraftingTable = useCallback(() => {
    inventoryOpenRef.current = true;
    setIsCraftingTableOpen(true);
    setIsInventoryOpen(true);
    handleGameEvent({ type: "inventory_opened" });
  }, [handleGameEvent]);

  /** Apply an event now and resume play unless it starts a conversation. */
  const applyAndResume = (event: GameEvent) => {
    const next = applyEvent(steps, quest, event);
    setQuest(next);
    if (!isDialogueActive(steps, next) && !(next.done && !quest.done)) resumeFromClick();
  };

  const handleUse = () => {
    if (!focus || !inputEnabled) return;
    narrator.unlock();
    if (focus.kind === "station" && focus.station) {
      setStation(focus.station);
      return;
    }
    const isGoal = step?.objective?.type === "talk" && step.objective.npcId === focus.id;
    if (isGoal) {
      handleGameEvent({ type: "talked", npcId: focus.id });
      return;
    }
    const npc = chapterInfo?.chapter?.world?.npcs?.find((n) => n.id === focus.id);
    if (npc?.idle) setAdHocLine({ id: `npc.${npc.id}.idle`, speaker: npc.name, text: npc.idle });
  };
  const handleUseRef = useRef(handleUse);
  handleUseRef.current = handleUse;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyF" && !e.repeat) handleUseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const finishStation = (id: StationId, result: ActivityResult) => {
    if (result.lines) setTypesetLines(result.lines);
    setStation(null);
    applyAndResume({ type: "station_done", station: id });
  };

  const finishJournal = (result: QuizResult) => {
    if (activeProfileId) {
      updateProfile(activeProfileId, (p) => ({
        ...p,
        journal: { ...(p.journal ?? {}), [chapterId]: { ...result, date: Date.now() } },
      }));
    }
    applyAndResume({ type: "journal_done" });
  };

  // A chapter without a journal check for this band skips straight past it.
  useEffect(() => {
    if (journalDue && journalConfig === null) setQuest((q) => applyEvent(steps, q, { type: "journal_done" }));
  }, [journalDue, journalConfig, steps]);

  const closeStation = () => {
    setStation(null);
    resumeFromClick();
  };

  const handleDialogueNext = () => {
    const next = advanceDialogue(steps, quest);
    setQuest(next);
    if (!isDialogueActive(steps, next) && !next.done) resumeFromClick();
  };

  const startChapter = (id: string) => {
    narrator.unlock();
    const info = findChapter(id);
    if (!info?.chapter || !profile) return;
    const chapterSteps = stepsForBand(info.chapter, settings.band);
    const saved = profile.progress[id];
    setChapterId(id);
    setQuest(saved && !saved.completed ? normalizeState(chapterSteps, saved.quest) : normalizeState(chapterSteps, undefined));
    prevQuest.current = INITIAL_QUEST_STATE;
    setCompleteDismissed(false);
    setInv(emptyInventory());
    setActiveSlotIndex(0);
    setIsInventoryOpen(false);
    setPaused(false);
    setStation(null);
    setAdHocLine(null);
    setFocus(null);
    setTypesetLines(null);
    setJournalDismissed(false);
    setScreen("game");
  };

  const leaveGame = () => {
    narrator.stop();
    unlockPointer();
    setPaused(false);
    setIsInventoryOpen(false);
    setScreen("chapters");
  };

  // ---- Teacher ----------------------------------------------------------------

  const handleSaveSettings = (next: ClassSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  const handleClearData = () => {
    clearAllProfiles();
    setProfiles([]);
    setActiveProfileId(null);
    setScreen("title");
  };

  // ---- Render -------------------------------------------------------------------

  const activeItem = inv.hotbar[activeSlotIndex];
  const activeBlock = activeItem?.itemId ? ITEM_REGISTRY[activeItem.itemId]?.blockType ?? BlockType.AIR : BlockType.AIR;
  const objectiveVisible = screen === "game" && !dialogueActive && !quest.done && step?.objective && step.objectiveText;

  const objective =
    objectiveVisible && step?.objective && step.objectiveText ? (
      <ObjectiveTracker
        stepId={`${chapterId}.${step.id}`}
        objective={step.objective}
        text={step.objectiveText}
        progress={quest.progress}
        compact={isInventoryOpen}
      />
    ) : null;

  return (
    <AppContext.Provider value={ctx}>
      <div className="screen-only relative flex h-[100dvh] w-screen flex-col overflow-hidden bg-stone-950 font-sans">
        {screen === "game" ? (
          <>
            <GameCanvas
              onLockChange={setIsLocked}
              inputEnabled={inputEnabled}
              inputMode={inputMode}
              activeBlock={activeBlock}
              hotbar={inv.hotbar}
              activeSlotIndex={activeSlotIndex}
              onActiveSlotIndexChange={setActiveSlotIndex}
              onBlockPlaced={handleBlockPlaced}
              onItemPickedUp={handleItemPickedUp}
              onItemDroppedFromHotbar={handleBlockPlaced}
              onToggleInventory={handleToggleInventory}
              onToolUsed={handleToolUsed}
              onGameEvent={handleGameEvent}
              spawnDropExternalRef={spawnDropExternalRef}
              onOpenCraftingTable={handleOpenCraftingTable}
              world={chapterInfo?.chapter?.world ?? {}}
              onFocusChange={setFocus}
              suspended={station !== null || teacherOpen}
            />

            <HUD
              showCrosshair={inputEnabled}
              activeSlotIndex={activeSlotIndex}
              onActiveSlotIndexChange={setActiveSlotIndex}
              hotbar={inv.hotbar}
            />

            {inputMode === "touch" && inputEnabled && (
              <TouchControls onOpenBag={handleToggleInventory} onPause={() => setPaused(true)} />
            )}

            {objective && !isInventoryOpen && station === null && <div className="absolute left-4 top-4 z-30">{objective}</div>}

            {focus && inputEnabled && <InteractPrompt target={focus} onUse={handleUse} />}

            {station && activity && (
              <ActivityHost
                key={station}
                activity={activity}
                typesetLines={typesetLines}
                onComplete={(result) => finishStation(station, result)}
                onClose={closeStation}
              />
            )}

            {DEBUG && (station || journalOpen) && (
              <button
                type="button"
                data-testid="debug-skip"
                onClick={() =>
                  station ? finishStation(station, {}) : finishJournal({ correct: 0, scored: 0, responses: [] })
                }
                className="absolute bottom-2 left-2 z-[80] rounded bg-fuchsia-700 px-2 py-1 text-xs text-white"
              >
                debug: skip
              </button>
            )}

            {/* Closing the journal only hides it, so reopening keeps the answers given so far. */}
            {journalDue && journalConfig && (
              <div className={journalOpen ? undefined : "hidden"}>
                <QuizGame
                  key={chapterId}
                  title={journalCheckLabel(lang)}
                  icon="📖"
                  cfg={journalConfig}
                  onComplete={finishJournal}
                  onClose={() => {
                    narrator.stop();
                    setJournalDismissed(true);
                    resumeFromClick();
                  }}
                />
              </div>
            )}
            {journalDue && journalDismissed && inputEnabled && (
              // Sits above the Use / Talk prompt when that is showing, instead of on top of it.
              <div
                className={`pointer-events-none absolute inset-x-0 z-30 flex justify-center px-4 ${focus ? "bottom-56" : "bottom-32"}`}
              >
                <button
                  type="button"
                  onClick={() => setJournalDismissed(false)}
                  className="pointer-events-auto flex min-h-16 items-center gap-3 rounded-2xl border-2 border-amber-300 bg-amber-500 px-6 text-xl font-bold text-stone-950 shadow-2xl active:scale-95"
                >
                  📖 {journalCheckLabel(lang)}
                </button>
              </div>
            )}

            {adHocLine && !currentLine && (
              <DialogueBox
                key={adHocLine.id}
                line={adHocLine}
                onNext={() => {
                  setAdHocLine(null);
                  resumeFromClick();
                }}
              />
            )}

            {currentLine && <DialogueBox key={`${quest.stepIndex}.${quest.dialogueIndex}`} line={currentLine} onNext={handleDialogueNext} />}

            <InventoryMenu
              isOpen={isInventoryOpen}
              onClose={handleToggleInventory}
              inventory={inv.inventory}
              hotbar={inv.hotbar}
              onInventoryChange={handleInventoryChange}
              onHotbarChange={handleHotbarChange}
              onDropItem={handleDropItemFromUI}
              isCraftingTableOpen={isCraftingTableOpen}
              onCrafted={(itemId, count) => handleGameEvent({ type: "crafted", itemId, count })}
              banner={objective}
            />

            {showComplete && (
              <ChapterComplete
                onChapters={leaveGame}
                onKeepExploring={() => {
                  setCompleteDismissed(true);
                  resumeFromClick();
                }}
              />
            )}

            {showPause && (
              <PauseMenu
                clickToPlay={!paused}
                audio={audio}
                canToggleAudio={settings.band !== "K-2"}
                onToggleAudio={() => profile && updateProfile(profile.id, (p) => ({ ...p, audio: !audio }))}
                onResume={() => {
                  narrator.unlock();
                  setPaused(false);
                  resumeFromClick();
                }}
                onSafeSpot={() => {
                  gameActions.unstuck?.();
                  setPaused(false);
                  resumeFromClick();
                }}
                onChapters={leaveGame}
                onGlossary={() => setGlossaryOpen(true)}
              />
            )}

            {glossaryOpen && (
              <ScreenFrame>
                <div className="flex w-full items-center justify-between">
                  <h2 className="text-2xl font-bold text-amber-100">🔤 {UI.glossary[lang]}</h2>
                  <button
                    type="button"
                    onClick={() => setGlossaryOpen(false)}
                    className="min-h-11 rounded-xl border border-stone-700 bg-stone-900 px-4 text-stone-200"
                  >
                    {UI.close[lang]}
                  </button>
                </div>
                <GlossaryList />
              </ScreenFrame>
            )}
          </>
        ) : screen === "chapters" && profile ? (
          <ChapterSelect
            profile={profile}
            enabledChapters={settings.chapters}
            lang={lang}
            canSwitchLang={settings.allowLangSwitch}
            onLangChange={handleLangChange}
            onPlay={startChapter}
            onSwitchProfile={() => selectProfile(null)}
            onOpenTeacher={() => setTeacherOpen(true)}
            onOpenJournal={() => setScreen("journal")}
          />
        ) : screen === "journal" && profile ? (
          <JournalScreen
            profile={profile}
            onBack={() => setScreen("chapters")}
            onPrint={() => setPrintJob({ kind: "journal", profileId: profile.id })}
          />
        ) : (
          <TitleScreen
            profiles={profiles}
            lang={lang}
            canSwitchLang={settings.allowLangSwitch}
            onLangChange={handleLangChange}
            onSelectProfile={(id) => {
              narrator.unlock();
              selectProfile(id);
            }}
            onCreateProfile={handleCreateProfile}
            onOpenTeacher={() => setTeacherOpen(true)}
          />
        )}

        <GlossaryHost />

        {teacherOpen && (
          <TeacherPanel
            settings={settings}
            profiles={profiles}
            onPrint={setPrintJob}
            onSave={handleSaveSettings}
            onClearData={handleClearData}
            onClose={() => setTeacherOpen(false)}
          />
        )}
      </div>
      {printJob && <PrintView job={printJob} profiles={profiles} onDone={endPrint} />}
    </AppContext.Provider>
  );
}
