import { useEffect } from "react";
import { useApp } from "../AppContext";
import { CHAPTERS } from "../content/chapters";
import { Profile } from "../save/profiles";
import { chapterStatus } from "../teacher/report";

export type PrintJob = { kind: "journal"; profileId: string } | { kind: "class" };

const STORY = CHAPTERS.filter((c) => c.chapter !== null);

function JournalPrint({ profile }: { profile: Profile }) {
  const app = useApp();
  const entries = STORY.filter((c) => profile.journal?.[c.id]);
  const dateFmt = (t: number) => new Date(t).toLocaleDateString(app.lang === "es" ? "es-MX" : "en-US");
  return (
    <div className="print-page">
      <h1 className="print-title">📖 {app.ui("journalTitle")}</h1>
      <p className="print-sub">
        {profile.name} · {app.ui("printedOn", { date: dateFmt(Date.now()) })}
      </p>
      {entries.length === 0 && <p>{app.ui("journalEmpty")}</p>}
      {entries.map((c) => {
        const e = profile.journal![c.id];
        return (
          <section key={c.id} className="print-entry">
            <h2>
              {c.number !== null ? `${app.ui("chapterN", { n: c.number })}: ` : ""}
              {app.pick(c.title)}
            </h2>
            <p className="print-meta">
              {dateFmt(e.date)}
              {e.scored > 0 && ` · ${app.ui("score", { n: e.correct, total: e.scored })}`}
            </p>
            <ol>
              {e.responses.map((r, i) => (
                <li key={i}>
                  <p className="print-q">{r.prompt}</p>
                  <p className="print-a">
                    {r.correct === true ? "✓ " : r.correct === false ? "○ " : ""}
                    {r.answer}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function ClassPrint({ profiles }: { profiles: Profile[] }) {
  const app = useApp();
  return (
    <div className="print-page">
      <h1 className="print-title">{app.ui("classProgress")}</h1>
      <p className="print-sub">{app.ui("printedOn", { date: new Date().toLocaleDateString(app.lang === "es" ? "es-MX" : "en-US") })}</p>
      <table className="print-table">
        <thead>
          <tr>
            <th>{app.ui("student")}</th>
            {STORY.map((c) => (
              <th key={c.id}>{c.number ?? "—"}</th>
            ))}
            <th>{app.ui("chaptersDone")}</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              {STORY.map((c) => {
                const s = chapterStatus(p, c.id);
                return (
                  <td key={c.id}>
                    {s.completed ? "✓" : s.started ? "…" : ""}
                    {s.scored ? ` ${s.correct}/${s.scored}` : ""}
                  </td>
                );
              })}
              <td>{STORY.filter((c) => chapterStatus(p, c.id).completed).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="print-key">
        {STORY.map((c) => `${c.number ?? "—"} = ${app.pick(c.title)}`).join(" · ")}
      </p>
      <p className="print-key">{app.ui("printKey")}</p>
    </div>
  );
}

/** Renders the print layout and opens the print dialog (on iPad: Print, or Save to Files as PDF). */
export function PrintView({ job, profiles, onDone }: { job: PrintJob; profiles: Profile[]; onDone: () => void }) {
  useEffect(() => {
    const after = () => onDone();
    window.addEventListener("afterprint", after);
    const t = setTimeout(() => window.print(), 150);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", after);
    };
  }, [onDone]);

  const profile = job.kind === "journal" ? profiles.find((p) => p.id === job.profileId) : null;
  return (
    <div className="print-only">
      {job.kind === "journal" && profile && <JournalPrint profile={profile} />}
      {job.kind === "class" && <ClassPrint profiles={profiles} />}
    </div>
  );
}
