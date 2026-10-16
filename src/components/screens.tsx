import React, { useState } from "react";
import { BookOpen, CheckCircle2, ChevronLeft, GraduationCap, Lock, Play, Plus } from "lucide-react";
import { useApp } from "../AppContext";
import { Lang } from "../i18n/types";
import { Profile } from "../save/profiles";
import { CHAPTERS } from "../content/chapters";

// Full-screen menus shown outside of gameplay.

export function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-10">
        {children}
      </div>
    </div>
  );
}

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const app = useApp();
  return (
    <div className="flex rounded-xl border border-stone-700 bg-stone-900 p-1" role="group" aria-label={app.ui("language")}>
      {(["en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          lang={l}
          className={`min-h-11 rounded-lg px-4 font-bold ${
            lang === l ? "bg-amber-500 text-stone-950" : "text-stone-300"
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
      className="absolute right-4 top-4 flex min-h-11 items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/80 px-3 text-sm text-stone-300"
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
      <div className="mb-2 text-5xl" aria-hidden>
        📜
      </div>
      <h1 className="font-serif text-4xl font-black tracking-tight text-amber-100 sm:text-5xl">{app.ui("gameTitle")}</h1>
      <p className="mt-2 text-lg text-amber-300/80">{app.ui("gameSubtitle")}</p>
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

      <div className="w-full max-w-md rounded-2xl border border-stone-700 bg-stone-900/90 p-6 shadow-2xl">
        <h2 className="mb-4 text-center text-xl font-bold text-stone-100">{app.ui("whoIsPlaying")}</h2>

        {profiles.length > 0 && (
          <div className="mb-4 grid gap-2">
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProfile(p.id)}
                className="min-h-14 rounded-xl border border-stone-700 bg-stone-800 px-4 text-left text-lg font-semibold text-stone-100 active:scale-[0.98]"
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
              className="min-h-14 rounded-xl border border-stone-600 bg-stone-950 px-4 text-lg text-stone-100 outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-amber-500 text-lg font-bold text-stone-950 disabled:opacity-40"
            >
              <Play className="h-5 w-5" />
              {app.ui("start")}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-600 text-stone-300"
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
}

export function ChapterSelect({
  profile,
  enabledChapters,
  lang,
  canSwitchLang,
  onLangChange,
  onPlay,
  onSwitchProfile,
  onOpenTeacher,
}: ChapterSelectProps) {
  const app = useApp();
  const visible = CHAPTERS.filter((c) => c.number === null || enabledChapters.includes(c.number));

  return (
    <ScreenFrame>
      <TeacherButton onClick={onOpenTeacher} />
      <button
        type="button"
        onClick={onSwitchProfile}
        className="absolute left-4 top-4 flex min-h-11 items-center gap-1 rounded-xl border border-stone-700 bg-stone-900/80 px-3 text-sm text-stone-300"
      >
        <ChevronLeft className="h-5 w-5" />
        {app.ui("switchProfile")}
      </button>

      <Title />
      <p className="text-xl font-semibold text-stone-100">{app.ui("hello", { name: profile.name })}</p>
      {canSwitchLang && <LangToggle lang={lang} onChange={onLangChange} />}

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
              className={`flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition-transform active:scale-[0.98] ${
                playable ? "border-amber-700/60 bg-stone-900" : "border-stone-800 bg-stone-900/50 opacity-60"
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {c.icon}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                {c.number !== null && (
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
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
      </div>
    </ScreenFrame>
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
}

export function PauseMenu({
  clickToPlay,
  audio,
  canToggleAudio,
  onToggleAudio,
  onResume,
  onSafeSpot,
  onChapters,
}: PauseMenuProps) {
  const app = useApp();
  return (
    <ScreenFrame>
      <div className="w-full max-w-sm rounded-2xl border border-stone-700 bg-stone-900/95 p-6 shadow-2xl">
        <h2 className="mb-5 text-center text-2xl font-bold text-stone-100">
          {clickToPlay ? app.ui("gameTitle") : app.ui("paused")}
        </h2>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onResume}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-amber-500 text-lg font-bold text-stone-950"
          >
            <Play className="h-5 w-5" />
            {clickToPlay ? app.ui("clickToPlay") : app.ui("resume")}
          </button>
          {canToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              className="flex min-h-12 items-center justify-between rounded-xl border border-stone-700 bg-stone-800 px-4 text-stone-100"
            >
              <span>🔊 {app.ui("readAloud")}</span>
              <span className="font-bold text-amber-400">{audio ? app.ui("on") : app.ui("off")}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onSafeSpot}
            className="min-h-12 rounded-xl border border-stone-700 bg-stone-800 px-4 text-stone-100"
          >
            🧭 {app.ui("safeSpot")}
          </button>
          <button
            type="button"
            onClick={onChapters}
            className="min-h-12 rounded-xl border border-stone-700 bg-stone-800 px-4 text-stone-100"
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
      <div className="w-full max-w-sm rounded-2xl border border-amber-600/60 bg-stone-900/95 p-6 text-center shadow-2xl">
        <div className="mb-2 text-5xl" aria-hidden>
          🎉
        </div>
        <h2 className="mb-5 text-2xl font-bold text-amber-200">{app.ui("chapterComplete")}</h2>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onChapters}
            className="min-h-14 rounded-xl bg-amber-500 text-lg font-bold text-stone-950"
          >
            📚 {app.ui("backToChapters")}
          </button>
          <button
            type="button"
            onClick={onKeepExploring}
            className="min-h-12 rounded-xl border border-stone-700 bg-stone-800 text-stone-100"
          >
            🧭 {app.ui("keepExploring")}
          </button>
        </div>
      </div>
    </ScreenFrame>
  );
}
