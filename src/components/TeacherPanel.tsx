import React, { useState } from "react";
import { Copy, X } from "lucide-react";
import { useApp } from "../AppContext";
import { BAND_DEFAULT_TIER, BANDS, Band, TIERS, TIER_LEXILE } from "../i18n/types";
import { ClassSettings, buildGroupLink, getTeacherPin, setTeacherPin } from "../settings/settings";
import { CHAPTERS } from "../content/chapters";
import { narrator } from "../audio/narrator";
import { LangToggle } from "./screens";

interface TeacherPanelProps {
  settings: ClassSettings;
  onSave: (s: ClassSettings) => void;
  onClearData: () => void;
  onClose: () => void;
}

function PinGate({ onUnlocked, onClose }: { onUnlocked: () => void; onClose: () => void }) {
  const app = useApp();
  const existing = getTeacherPin();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existing) {
      if (/^\d{4}$/.test(pin)) {
        setTeacherPin(pin);
        onUnlocked();
      } else setError(true);
    } else if (pin === existing) onUnlocked();
    else setError(true);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="teacher-pin" className="text-lg font-semibold text-stone-100">
        {existing ? app.ui("enterPin") : app.ui("createPin")}
      </label>
      <input
        id="teacher-pin"
        type="password"
        inputMode="numeric"
        pattern="\d*"
        maxLength={4}
        value={pin}
        onChange={(e) => {
          setPin(e.target.value.replace(/\D/g, ""));
          setError(false);
        }}
        autoFocus
        className="min-h-14 rounded-xl border border-stone-600 bg-stone-950 px-4 text-center font-mono text-2xl tracking-[0.5em] text-stone-100 outline-none focus:border-amber-400"
      />
      {error && <p className="text-sm text-rose-400">{app.ui("wrongPin")}</p>}
      <p className="text-xs text-stone-400">{app.ui("pinNote")}</p>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-xl border border-stone-700 text-stone-200">
          {app.ui("close")}
        </button>
        <button type="submit" className="min-h-12 flex-1 rounded-xl bg-amber-500 font-bold text-stone-950">
          {app.ui("unlock")}
        </button>
      </div>
    </form>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  render,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render: (v: T) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`min-h-14 rounded-xl border px-2 text-sm font-semibold ${
            value === o ? "border-amber-400 bg-amber-500/20 text-amber-100" : "border-stone-700 bg-stone-800 text-stone-300"
          }`}
        >
          {render(o)}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange, note }: { label: string; checked: boolean; onChange: (v: boolean) => void; note?: string }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border border-stone-700 bg-stone-800 px-4">
      <span className="flex flex-col">
        <span className="text-stone-100">{label}</span>
        {note && <span className="text-xs text-stone-400">{note}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-6 w-6 accent-amber-500" />
    </label>
  );
}

function Settings({ settings, onSave, onClearData, onClose }: TeacherPanelProps) {
  const app = useApp();
  const [draft, setDraft] = useState<ClassSettings>(settings);
  const [copied, setCopied] = useState(false);
  const link = buildGroupLink(draft);
  const update = (patch: Partial<ClassSettings>) => setDraft((d) => ({ ...d, ...patch }));

  const missingVoices = (["en", "es"] as const).filter((l) => narrator.speechSupported && !narrator.hasVoice(l));

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link is selectable in the field.
    }
  };

  const toggleChapter = (n: number) => {
    update({
      chapters: draft.chapters.includes(n)
        ? draft.chapters.filter((c) => c !== n)
        : [...draft.chapters, n].sort((a, b) => a - b),
    });
  };

  const changePin = () => {
    const pin = window.prompt(app.ui("createPin"));
    if (pin && /^\d{4}$/.test(pin)) setTeacherPin(pin);
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("gradeBand")}</h3>
        <Segmented
          options={BANDS}
          value={draft.band}
          onChange={(band: Band) => update({ band, tier: draft.band === band ? draft.tier : BAND_DEFAULT_TIER[band] })}
          render={(b) => b}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("readingLevel")}</h3>
        <Segmented
          options={TIERS}
          value={draft.tier}
          onChange={(tier) => update({ tier })}
          render={(t) => (
            <span className="flex flex-col">
              <span>{t}</span>
              <span className="text-xs font-normal opacity-80">{TIER_LEXILE[t]}</span>
            </span>
          )}
        />
        <p className="text-xs text-stone-400">{app.ui("lexileNote")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("startingLanguage")}</h3>
        <LangToggle lang={draft.lang} onChange={(lang) => update({ lang })} />
        <Toggle label={app.ui("allowSwitch")} checked={draft.allowLangSwitch} onChange={(allowLangSwitch) => update({ allowLangSwitch })} />
        <Toggle
          label={app.ui("audioDefault")}
          note={app.ui("k2AudioNote")}
          checked={draft.band === "K-2" || draft.audio}
          onChange={(audio) => update({ audio })}
        />
        {missingVoices.map((l) => (
          <p key={l} className="rounded-lg border border-amber-700/50 bg-amber-950/40 p-2 text-sm text-amber-200">
            ⚠️ {app.ui("voiceMissing", { lang: app.ui(l === "en" ? "langNameEn" : "langNameEs") })}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("chaptersEnabled")}</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHAPTERS.filter((c) => c.number !== null).map((c) => (
            <Toggle
              key={c.id}
              label={`${c.number}. ${app.pick(c.title)}`}
              checked={draft.chapters.includes(c.number!)}
              onChange={() => toggleChapter(c.number!)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("groupLink")}</h3>
        <p className="text-xs text-stone-400">{app.ui("groupLinkNote")}</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className="min-h-12 flex-1 rounded-xl border border-stone-700 bg-stone-950 px-3 font-mono text-xs text-stone-300"
          />
          <button type="button" onClick={copyLink} className="flex min-h-12 items-center gap-1 rounded-xl border border-stone-600 bg-stone-800 px-3 text-stone-100">
            <Copy className="h-4 w-4" />
            {copied ? app.ui("copied") : app.ui("copy")}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("studentData")}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(app.ui("confirmClear"))) onClearData();
            }}
            className="min-h-12 rounded-xl border border-rose-800 bg-rose-950/40 px-4 text-rose-200"
          >
            {app.ui("clearData")}
          </button>
          <button type="button" onClick={changePin} className="min-h-12 rounded-xl border border-stone-700 bg-stone-800 px-4 text-stone-200">
            {app.ui("changePin")}
          </button>
        </div>
      </section>

      <div className="sticky bottom-0 flex gap-3 bg-stone-900 pt-2">
        <button type="button" onClick={onClose} className="min-h-14 flex-1 rounded-xl border border-stone-700 text-stone-200">
          {app.ui("close")}
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(draft);
            onClose();
          }}
          className="min-h-14 flex-1 rounded-xl bg-amber-500 text-lg font-bold text-stone-950"
        >
          {app.ui("save")}
        </button>
      </div>
    </div>
  );
}

export default function TeacherPanel(props: TeacherPanelProps) {
  const app = useApp();
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="absolute inset-0 z-[60] overflow-y-auto bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto my-8 w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-stone-700 bg-stone-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-100">{app.ui("teacherSettings")}</h2>
          <button type="button" onClick={props.onClose} aria-label={app.ui("close")} className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-700 text-stone-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        {unlocked ? <Settings {...props} /> : <PinGate onUnlocked={() => setUnlocked(true)} onClose={props.onClose} />}
      </div>
    </div>
  );
}
