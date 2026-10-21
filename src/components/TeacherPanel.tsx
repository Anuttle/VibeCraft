import React, { useState } from "react";
import { Copy, X } from "lucide-react";
import { useApp } from "../AppContext";
import { BAND_DEFAULT_TIER, BANDS, Band, TIERS, TIER_LEXILE } from "../i18n/types";
import {
  ClassSettings,
  FREE_MODES,
  FreeMode,
  buildGroupLink,
  getTeacherPin,
  isEasyPin,
  pinLockRemaining,
  recordPinAttempt,
  setTeacherPin,
} from "../settings/settings";
import { CHAPTERS } from "../content/chapters";
import { narrator } from "../audio/narrator";
import { LangToggle } from "./screens";
import { Profile } from "../save/profiles";
import { PrintJob } from "./Print";
import { chapterStatus, dateStamp, downloadText, responsesCsv, summaryCsv } from "../teacher/report";

interface TeacherPanelProps {
  settings: ClassSettings;
  profiles: Profile[];
  onPrint: (job: PrintJob) => void;
  onSave: (s: ClassSettings) => void;
  onClearData: () => void;
  onClose: () => void;
}

function PinGate({ onUnlocked, onClose }: { onUnlocked: () => void; onClose: () => void }) {
  const app = useApp();
  const existing = getTeacherPin();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existing) {
      if (!/^\d{4}$/.test(pin)) setError(app.ui("pinFourDigits"));
      else if (isEasyPin(pin)) setError(app.ui("easyPin"));
      else {
        setTeacherPin(pin);
        onUnlocked();
      }
      return;
    }
    const wait = pinLockRemaining();
    if (wait > 0) return setError(app.ui("pinLocked", { n: Math.ceil(wait / 1000) }));
    recordPinAttempt(pin === existing);
    if (pin === existing) onUnlocked();
    else setError(app.ui("wrongPin"));
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
          setError(null);
        }}
        autoFocus
        className="min-h-14 rounded-md border border-stone-600 bg-stone-950 px-4 text-center font-mono text-2xl tracking-[0.5em] text-stone-100 outline-none focus:border-amber-400"
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <p className="text-xs text-stone-400">{app.ui("pinNote")}</p>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-md border border-stone-700 text-stone-200">
          {app.ui("close")}
        </button>
        <button type="submit" className="min-h-12 flex-1 rounded-md bg-rubric-600 font-bold text-stone-50">
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
          className={`min-h-14 rounded-md border px-2 text-sm font-semibold ${
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
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-md border border-stone-700 bg-stone-800 px-4">
      <span className="flex flex-col">
        <span className="text-stone-100">{label}</span>
        {note && <span className="text-xs text-stone-400">{note}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-6 w-6 accent-amber-500" />
    </label>
  );
}

function ClassProgress({ profiles, onPrint }: { profiles: Profile[]; onPrint: (job: PrintJob) => void }) {
  const app = useApp();
  const story = CHAPTERS.filter((c) => c.chapter !== null);
  if (profiles.length === 0) return <p className="text-stone-400">{app.ui("noStudents")}</p>;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-stone-400">{app.ui("classProgressNote")}</p>
      <div className="overflow-x-auto rounded-md border border-stone-700">
        <table className="w-full text-left text-sm text-stone-200">
          <thead className="bg-stone-800 text-xs text-stone-400">
            <tr>
              <th className="px-3 py-2">{app.ui("student")}</th>
              {story.map((c) => (
                <th key={c.id} className="px-2 py-2 text-center" title={app.pick(c.title)}>
                  {c.icon}
                </th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-t border-stone-800">
                <td className="px-3 py-2 font-semibold">{p.name}</td>
                {story.map((c) => {
                  const st = chapterStatus(p, c.id);
                  return (
                    <td key={c.id} className="px-2 py-2 text-center font-mono text-xs">
                      {st.completed ? <span className="text-emerald-400">✓</span> : st.started ? "…" : ""}
                      {st.scored ? <div className="text-stone-400">{st.correct}/{st.scored}</div> : null}
                    </td>
                  );
                })}
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onPrint({ kind: "journal", profileId: p.id })}
                    className="min-h-10 whitespace-nowrap rounded-lg border border-stone-600 bg-stone-800 px-3 text-xs"
                  >
                    🖨️ {app.ui("printJournal")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => downloadText(`printing-press-summary-${dateStamp()}.csv`, summaryCsv(profiles, app.lang))}
          className="min-h-12 rounded-md border border-stone-600 bg-stone-800 px-4 text-stone-100"
        >
          ⬇️ {app.ui("downloadSummary")}
        </button>
        <button
          type="button"
          onClick={() => downloadText(`printing-press-journal-answers-${dateStamp()}.csv`, responsesCsv(profiles, app.lang))}
          className="min-h-12 rounded-md border border-stone-600 bg-stone-800 px-4 text-stone-100"
        >
          ⬇️ {app.ui("downloadAnswers")}
        </button>
        <button
          type="button"
          onClick={() => onPrint({ kind: "class" })}
          className="min-h-12 rounded-md border border-stone-600 bg-stone-800 px-4 text-stone-100"
        >
          🖨️ {app.ui("printReport")}
        </button>
      </div>
    </div>
  );
}

function Settings({ settings, profiles, onPrint, onSave, onClearData, onClose }: TeacherPanelProps) {
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

  const [pinIsEasy, setPinIsEasy] = useState(() => isEasyPin(getTeacherPin() ?? ""));
  const changePin = () => {
    const pin = window.prompt(app.ui("createPin"));
    if (pin === null) return;
    if (!/^\d{4}$/.test(pin)) return window.alert(app.ui("pinFourDigits"));
    if (isEasyPin(pin)) return window.alert(app.ui("easyPin"));
    setTeacherPin(pin);
    setPinIsEasy(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {pinIsEasy && (
        <section role="alert" className="flex flex-wrap items-center gap-3 rounded-md border border-amber-500 bg-amber-950/50 p-3 text-amber-100">
          <span className="flex-1">{app.ui("easyPinWarning")}</span>
          <button type="button" onClick={changePin} className="min-h-11 rounded-lg bg-rubric-600 px-4 font-bold text-stone-50">
            {app.ui("changePin")}
          </button>
        </section>
      )}
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
        <h3 className="font-bold text-amber-300">{app.ui("freeMode")}</h3>
        <Segmented
          options={FREE_MODES}
          value={draft.freeMode}
          onChange={(freeMode: FreeMode) => update({ freeMode })}
          render={(m) => app.ui(m === "earned" ? "freeEarned" : m === "open" ? "freeOpen" : "freeOff")}
        />
        <p className="text-xs text-stone-400">{app.ui("freeModeNote")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("groupLink")}</h3>
        <p className="text-xs text-stone-400">{app.ui("groupLinkNote")}</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className="min-h-12 flex-1 rounded-md border border-stone-700 bg-stone-950 px-3 font-mono text-xs text-stone-300"
          />
          <button type="button" onClick={copyLink} className="flex min-h-12 items-center gap-1 rounded-md border border-stone-600 bg-stone-800 px-3 text-stone-100">
            <Copy className="h-4 w-4" />
            {copied ? app.ui("copied") : app.ui("copy")}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("classProgress")}</h3>
        <ClassProgress profiles={profiles} onPrint={onPrint} />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-amber-300">{app.ui("studentData")}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(app.ui("confirmClear"))) onClearData();
            }}
            className="min-h-12 rounded-md border border-rose-800 bg-rose-950/40 px-4 text-rose-200"
          >
            {app.ui("clearData")}
          </button>
          <button type="button" onClick={changePin} className="min-h-12 rounded-md border border-stone-700 bg-stone-800 px-4 text-stone-200">
            {app.ui("changePin")}
          </button>
        </div>
      </section>

      <div className="sticky bottom-0 flex gap-3 bg-stone-900 pt-2">
        <button type="button" onClick={onClose} className="min-h-14 flex-1 rounded-md border border-stone-700 text-stone-200">
          {app.ui("close")}
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(draft);
            onClose();
          }}
          className="min-h-14 flex-1 rounded-md bg-rubric-600 text-lg font-bold text-stone-50"
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
    <div className="absolute inset-0 z-[60] overflow-y-auto bg-stone-950/90">
      <div className="mx-auto my-8 w-[calc(100%-2rem)] max-w-2xl rounded-lg border border-stone-700 bg-stone-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-100">{app.ui("teacherSettings")}</h2>
          <button type="button" onClick={props.onClose} aria-label={app.ui("close")} className="flex h-11 w-11 items-center justify-center rounded-md border border-stone-700 text-stone-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        {unlocked ? <Settings {...props} /> : <PinGate onUnlocked={() => setUnlocked(true)} onClose={props.onClose} />}
      </div>
    </div>
  );
}
