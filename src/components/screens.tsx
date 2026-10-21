import React, { useState } from "react";
import { BookOpen, CheckCircle2, ChevronLeft, GraduationCap, Lock, Play, Plus } from "lucide-react";
import { useApp } from "../AppContext";
import { Lang } from "../i18n/types";
import { Profile } from "../save/profiles";
import { CHAPTERS, FREE_BUILD, freeBuildUnlocked } from "../content/chapters";
import type { FreeMode } from "../settings/settings";
import { GlossaryList } from "./Glossary";

// Full-screen menus shown outside of gameplay.

export function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-stone-950/85">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-10">
        {children}
      </div>
    </div>
  );
}

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const app = useApp();
  return (
    <div className="flex rounded-md border border-stone-700 bg-stone-900 p-1" role="group" aria-label={app.ui("language")}>
      {(["en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          lang={l}
          className={`min-h-11 rounded-lg px-4 font-bold ${
            lang === l ? "bg-rubric-600 text-stone-50" : "text-stone-300"
          }`}
        >
          {l === "en" ? "English" : "Español"}
        </button>
      ))}
    </div>
  );
}

function TeacherButton({ onClick }: { onClick: () => void }) {
  const app = useApp();
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-4 top-4 flex min-h-11 items-center gap-2 rounded-md border border-stone-700 bg-stone-900/80 px-3 text-sm text-stone-300"
    >
      <GraduationCap className="h-5 w-5" />
      {app.ui("teacher")}
    </button>
  );
}

function Title() {
  const app = useApp();
  return (
    <div className="text-center">
      <h1 className="font-serif text-4xl font-bold text-stone-50 sm:text-6xl">{app.ui("gameTitle")}</h1>
      {/* A printer's rule with a red fleuron, under the title */}
      <div className="mx-auto mt-3 flex max-w-xs items-center gap-3 text-rubric-500" aria-hidden>
        <span className="h-px flex-1 bg-stone-500" />
        <span className="font-serif text-xl">❧</span>
        <span className="h-px flex-1 bg-stone-500" />
      </div>
      <p className="mt-3 font-serif text-lg italic text-stone-300">{app.ui("gameSubtitle")}</p>
    </div>
  );
}

interface TitleScreenProps {
  profiles: Profile[];
  lang: Lang;
  canSwitchLang: boolean;
  onLangChange: (l: Lang) => void;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string) => void;
  onOpenTeacher: () => void;
}

export function TitleScreen({
  profiles,
  lang,
  canSwitchLang,
  onLangChange,
  onSelectProfile,
  onCreateProfile,
  onOpenTeacher,
}: TitleScreenProps) {
  const app = useApp();
  const [adding, setAdding] = useState(profiles.length === 0);
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onCreateProfile(name.trim());
  };

  return (
    <ScreenFrame>
      <TeacherButton onClick={onOpenTeacher} />
      <Title />
      {canSwitchLang && <LangToggle lang={lang} onChange={onLangChange} />}

      <div className="w-full max-w-md rounded-lg border border-stone-700 bg-stone-900/90 p-6 shadow-2xl">
        <h2 className="mb-4 text-center text-xl font-bold text-stone-100">{app.ui("whoIsPlaying")}</h2>

        {profiles.length > 0 && (
          <div className="mb-4 grid gap-2">
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProfile(p.id)}
                className="min-h-14 rounded-md border border-stone-700 bg-stone-800 px-4 text-left text-lg font-semibold text-stone-100 active:scale-[0.98]"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {adding ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="text-sm text-stone-300" htmlFor="profile-name">
              {app.ui("typeName")}
            </label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              autoComplete="off"
              autoCapitalize="words"
              className="min-h-14 rounded-md border border-stone-600 bg-stone-950 px-4 text-lg text-stone-100 outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-rubric-600 text-lg font-bold text-stone-50 disabled:opacity-40"
            >
              <Play className="h-5 w-5" />
              {app.ui("start")}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-dashed border-stone-600 text-stone-300"
          >
            <Plus className="h-5 w-5" />
            {app.ui("addName")}
          </button>
        )}
      </div>
    </ScreenFrame>
  );
}

interface ChapterSelectProps {
  profile: Profile;
  enabledChapters: number[];
  lang: Lang;
  canSwitchLang: boolean;
  onLangChange: (l: Lang) => void;
  onPlay: (chapterId: string) => void;
  onSwitchProfile: () => void;
  onOpenTeacher: () => void;
  onOpenJournal: () => void;
  freeMode: FreeMode;
}

export function ChapterSelect({
  profile,
  enabledChapters,
  freeMode,
  lang,
  canSwitchLang,
  onLangChange,
  onPlay,
  onSwitchProfile,
  onOpenTeacher,
  onOpenJournal,
}: ChapterSelectProps) {
  const app = useApp();
  const visible = CHAPTERS.filter((c) => c.number === null || enabledChapters.includes(c.number));

  return (
    <ScreenFrame>
      <TeacherButton onClick={onOpenTeacher} />
      <button
        type="button"
        onClick={onSwitchProfile}
        className="absolute left-4 top-4 flex min-h-11 items-center gap-1 rounded-md border border-stone-700 bg-stone-900/80 px-3 text-sm text-stone-300"
      >
        <ChevronLeft className="h-5 w-5" />
        {app.ui("switchProfile")}
      </button>

      <Title />
      <p className="text-xl font-semibold text-stone-100">{app.ui("hello", { name: profile.name })}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {canSwitchLang && <LangToggle lang={lang} onChange={onLangChange} />}
        <button
          type="button"
          onClick={onOpenJournal}
          className="flex min-h-12 items-center gap-2 rounded-md border border-amber-700/60 bg-stone-900 px-4 font-semibold text-amber-100"
        >
          📖 {app.ui("journal")} · {app.ui("glossary")}
        </button>
      </div>

      <h2 className="flex items-center gap-2 text-lg font-bold text-amber-300">
        <BookOpen className="h-5 w-5" />
        {app.ui("chooseChapter")}
      </h2>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {visible.map((c) => {
          const progress = profile.progress[c.id];
          const playable = c.chapter !== null;
          const label = !playable
            ? app.ui("comingSoon")
            : progress?.completed
              ? app.ui("playAgain")
              : progress
                ? app.ui("continue")
                : app.ui("play");
          return (
            <button
              key={c.id}
              type="button"
              disabled={!playable}
              onClick={() => onPlay(c.id)}
              className={`flex min-h-24 items-start gap-3 rounded-lg border p-4 text-left transition-transform active:scale-[0.98] ${
                playable ? "border-amber-700/60 bg-stone-900" : "border-stone-800 bg-stone-900/50 opacity-60"
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {c.icon}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                {c.number !== null && (
                  <span className="text-xs font-bold text-stone-400">
                    {app.ui("chapterN", { n: c.number })}
                  </span>
                )}
                <span className="text-lg font-bold text-stone-100">{app.pick(c.title)}</span>
                <span className="text-sm text-stone-400">{app.pick(c.anchor)}</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                  {!playable ? (
                    <Lock className="h-4 w-4" />
                  ) : progress?.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {label}
                </span>
              </span>
            </button>
          );
        })}
        {freeMode !== "off" && <FreeBuildCard profile={profile} enabledChapters={enabledChapters} freeMode={freeMode} onPlay={onPlay} />}
      </div>
    </ScreenFrame>
  );
}

/** Free build, at the end of the list: locked until every enabled chapter is done (unless the teacher opened it). */
function FreeBuildCard({
  profile,
  enabledChapters,
  freeMode,
  onPlay,
}: {
  profile: Profile;
  enabledChapters: number[];
  freeMode: FreeMode;
  onPlay: (chapterId: string) => void;
}) {
  const app = useApp();
  const { unlocked, done, total } = freeBuildUnlocked(freeMode, enabledChapters, (id) => !!profile.progress[id]?.completed);
  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={() => onPlay(FREE_BUILD.id)}
      className={`flex min-h-24 items-start gap-3 rounded-lg border p-4 text-left transition-transform active:scale-[0.98] sm:col-span-2 ${
        unlocked ? "border-amber-700/60 bg-stone-900" : "border-stone-800 bg-stone-900/50 opacity-70"
      }`}
    >
      <span className="text-3xl" aria-hidden>
        {FREE_BUILD.icon}
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-lg font-bold text-stone-100">{app.pick(FREE_BUILD.title)}</span>
        <span className="text-sm text-stone-400">{app.pick(FREE_BUILD.anchor)}</span>
        <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-amber-400">
          {unlocked ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {unlocked ? app.ui("play") : app.ui("freeLocked", { n: done, total })}
        </span>
      </span>
    </button>
  );
}

interface PauseMenuProps {
  /** Mouse mode lost pointer lock without the student pausing; just ask for a click. */
  clickToPlay: boolean;
  audio: boolean;
  canToggleAudio: boolean;
  onToggleAudio: () => void;
  onResume: () => void;
  onSafeSpot: () => void;
  onChapters: () => void;
  onGlossary: () => void;
}

export function PauseMenu({
  clickToPlay,
  audio,
  canToggleAudio,
  onToggleAudio,
  onResume,
  onSafeSpot,
  onChapters,
  onGlossary,
}: PauseMenuProps) {
  const app = useApp();
  return (
    <ScreenFrame>
      <div className="w-full max-w-sm rounded-lg border border-stone-700 bg-stone-900/95 p-6 shadow-2xl">
        <h2 className="mb-5 text-center text-2xl font-bold text-stone-100">
          {clickToPlay ? app.ui("gameTitle") : app.ui("paused")}
        </h2>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onResume}
            className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-rubric-600 text-lg font-bold text-stone-50"
          >
            <Play className="h-5 w-5" />
            {clickToPlay ? app.ui("clickToPlay") : app.ui("resume")}
          </button>
          {canToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              className="flex min-h-12 items-center justify-between rounded-md border border-stone-700 bg-stone-800 px-4 text-stone-100"
            >
              <span>🔊 {app.ui("readAloud")}</span>
              <span className="font-bold text-amber-400">{audio ? app.ui("on") : app.ui("off")}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onGlossary}
            className="min-h-12 rounded-md border border-stone-700 bg-stone-800 px-4 text-stone-100"
          >
            🔤 {app.ui("glossary")}
          </button>
          <button
            type="button"
            onClick={onSafeSpot}
            className="min-h-12 rounded-md border border-stone-700 bg-stone-800 px-4 text-stone-100"
          >
            🧭 {app.ui("safeSpot")}
          </button>
          <button
            type="button"
            onClick={onChapters}
            className="min-h-12 rounded-md border border-stone-700 bg-stone-800 px-4 text-stone-100"
          >
            📚 {app.ui("backToChapters")}
          </button>
        </div>
      </div>
    </ScreenFrame>
  );
}

export function ChapterComplete({ onKeepExploring, onChapters }: { onKeepExploring: () => void; onChapters: () => void }) {
  const app = useApp();
  return (
    <ScreenFrame>
      <div className="w-full max-w-sm rounded-lg border border-amber-600/60 bg-stone-900/95 p-6 text-center shadow-2xl">
        <div className="mb-2 text-5xl" aria-hidden>
          🎉
        </div>
        <h2 className="mb-5 text-2xl font-bold text-amber-200">{app.ui("chapterComplete")}</h2>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onChapters}
            className="min-h-14 rounded-md bg-rubric-600 text-lg font-bold text-stone-50"
          >
            📚 {app.ui("backToChapters")}
          </button>
          <button
            type="button"
            onClick={onKeepExploring}
            className="min-h-12 rounded-md border border-stone-700 bg-stone-800 text-stone-100"
          >
            🧭 {app.ui("keepExploring")}
          </button>
        </div>
      </div>
    </ScreenFrame>
  );
}

interface JournalScreenProps {
  profile: Profile;
  startTab?: "journal" | "glossary";
  onBack: () => void;
  onPrint: () => void;
}

/** The student's Printer's Journal (saved checks) and the glossary. */
export function JournalScreen({ profile, startTab = "journal", onBack, onPrint }: JournalScreenProps) {
  const app = useApp();
  const [tab, setTab] = useState<"journal" | "glossary">(startTab);
  const entries = CHAPTERS.filter((c) => profile.journal?.[c.id]);

  return (
    <ScreenFrame>
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 flex min-h-11 items-center gap-1 rounded-md border border-stone-700 bg-stone-900/80 px-3 text-sm text-stone-300"
      >
        <ChevronLeft className="h-5 w-5" />
        {app.ui("back")}
      </button>
      <h1 className="font-serif text-3xl font-black text-amber-100">📖 {app.ui("journalTitle")}</h1>
      <p className="text-stone-300">{profile.name}</p>
      <div className="flex rounded-md border border-stone-700 bg-stone-900 p-1" role="tablist">
        {(["journal", "glossary"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`min-h-11 rounded-lg px-5 font-bold ${tab === t ? "bg-rubric-600 text-stone-50" : "text-stone-300"}`}
          >
            {app.ui(t)}
          </button>
        ))}
      </div>

      <div className="w-full">
        {tab === "glossary" ? (
          <GlossaryList />
        ) : entries.length === 0 ? (
          <p className="text-center text-lg text-stone-400">{app.ui("journalEmpty")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={onPrint}
              className="flex min-h-12 items-center gap-2 self-end rounded-md border border-stone-600 bg-stone-800 px-4 text-stone-100"
            >
              🖨️ {app.ui("printJournal")}
            </button>
            {entries.map((c) => {
              const e = profile.journal![c.id];
              return (
                <article key={c.id} className="rounded-lg border border-amber-800/50 bg-[#f3e9d2] p-5 text-stone-900 shadow">
                  <header className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-serif text-xl font-bold">
                      {c.icon} {app.pick(c.title)}
                    </h2>
                    <span className="text-sm text-stone-600">
                      {new Date(e.date).toLocaleDateString(app.lang === "es" ? "es-MX" : "en-US")}
                      {e.scored > 0 && ` · ${app.ui("score", { n: e.correct, total: e.scored })}`}
                    </span>
                  </header>
                  <ol className="flex flex-col gap-2">
                    {e.responses.map((r, i) => (
                      <li key={i} className="border-t border-amber-900/20 pt-2">
                        <p className="text-sm font-semibold text-stone-700">{r.prompt}</p>
                        <p className="whitespace-pre-line font-serif text-lg">
                          {r.correct === true ? "✅ " : r.correct === false ? "↺ " : "✍️ "}
                          {r.answer}
                        </p>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </ScreenFrame>
  );
}
