import { CHAPTERS } from "../content/chapters";
import { Lang } from "../i18n/types";
import { Profile } from "../save/profiles";

// Class progress for every student profile on this device. Exported as CSV so
// a teacher can combine files from several iPads in one spreadsheet.

const STORY = CHAPTERS.filter((c) => c.chapter !== null);

export interface ChapterStatus {
  started: boolean;
  completed: boolean;
  correct: number | null;
  scored: number | null;
}

export function chapterStatus(p: Profile, chapterId: string): ChapterStatus {
  const prog = p.progress[chapterId];
  const j = p.journal?.[chapterId];
  return {
    started: !!prog,
    completed: !!prog?.completed,
    correct: j ? j.correct : null,
    scored: j ? j.scored : null,
  };
}

function cell(v: string | number | null | undefined): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Array<Array<string | number | null>>): string {
  // The byte-order mark lets Excel and Numbers read accented letters correctly.
  return "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}

/** One row per student: each chapter's status and journal score. */
export function summaryCsv(profiles: Profile[], lang: Lang): string {
  const header = [
    lang === "es" ? "Estudiante" : "Student",
    ...STORY.map((c) => c.title[lang]),
    lang === "es" ? "Capítulos completados" : "Chapters completed",
  ];
  const rows = profiles.map((p) => {
    const cells = STORY.map((c) => {
      const s = chapterStatus(p, c.id);
      if (!s.started) return "";
      const score = s.scored ? ` (${s.correct}/${s.scored})` : "";
      return (s.completed ? (lang === "es" ? "Completado" : "Completed") : lang === "es" ? "En curso" : "In progress") + score;
    });
    const done = STORY.filter((c) => chapterStatus(p, c.id).completed).length;
    return [p.name, ...cells, done];
  });
  return toCsv([header, ...rows]);
}

/** One row per journal answer, for reading students' written responses. */
export function responsesCsv(profiles: Profile[], lang: Lang): string {
  const header =
    lang === "es"
      ? ["Estudiante", "Capítulo", "Fecha", "Pregunta", "Respuesta", "Correcta"]
      : ["Student", "Chapter", "Date", "Question", "Answer", "Correct"];
  const rows: Array<Array<string | number | null>> = [];
  for (const p of profiles) {
    for (const c of STORY) {
      const j = p.journal?.[c.id];
      if (!j) continue;
      const date = new Date(j.date).toISOString().slice(0, 10);
      for (const r of j.responses) {
        const correct = r.correct === null ? "" : r.correct ? (lang === "es" ? "sí" : "yes") : "no";
        rows.push([p.name, c.title[lang], date, r.prompt, r.answer, correct]);
      }
    }
  }
  return toCsv([header, ...rows]);
}

/** Save a text file. On iPad this opens the share sheet / Files. */
export function downloadText(filename: string, text: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
