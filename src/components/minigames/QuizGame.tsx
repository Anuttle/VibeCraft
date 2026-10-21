import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useApp } from "../../AppContext";
import type { QuizConfig, QuizItem, QuizResult } from "../../game/activities";
import { seededShuffle } from "../../game/typesetting";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { OrderPicker } from "./SequenceGame";
import { Feedback, FinishPanel, Panel, PrimaryButton, useShuffleSeed } from "./shared";

interface QuizGameProps {
  cfg: QuizConfig;
  title: string;
  icon: string;
  onComplete: (result: QuizResult) => void;
  onClose: () => void;
}

type Response = QuizResult["responses"][number];

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function ExplainBox({ correct, explain }: { correct: boolean | null; explain: string }) {
  const app = useApp();
  return (
    <div
      className={`flex items-start gap-3 rounded-md border p-4 text-lg ${
        correct === false ? "border-amber-700 bg-amber-950/40" : "border-emerald-700 bg-emerald-950/40"
      }`}
      role="status"
    >
      {correct === false ? <XCircle className="mt-1 h-6 w-6 shrink-0 text-amber-300" /> : <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-300" />}
      <span className="text-stone-100">
        {correct !== null && <strong>{correct ? app.ui("correct") : app.ui("notQuite")} </strong>}
        {explain}
      </span>
    </div>
  );
}

function WriteBox({ value, onChange, starters }: { value: string; onChange: (v: string) => void; starters?: string[] }) {
  const app = useApp();
  return (
    <div className="flex flex-col gap-2">
      {starters && starters.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-stone-400">{app.ui("starters")}</span>
          <div className="flex flex-wrap gap-2">
            {starters.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange(value ? `${value} ${s}` : s)}
                className="min-h-11 rounded-full border border-stone-600 bg-stone-800 px-4 text-stone-100"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={app.ui("typeAnswer")}
        lang={app.lang}
        className="w-full rounded-md border border-stone-600 bg-stone-950 p-3 text-lg text-stone-100 outline-none focus:border-amber-400"
      />
    </div>
  );
}

/** One quiz item; reports its response when the student moves on. */
function ItemView({ item, onNext }: { item: QuizItem; onNext: (r: Response) => void }) {
  const app = useApp();
  const isK2 = app.band === "K-2";
  const [chosen, setChosen] = useState<number | null>(null);
  const [numberText, setNumberText] = useState("");
  const [checked, setChecked] = useState(false);
  const [text, setText] = useState("");
  const [orderMistakes, setOrderMistakes] = useState<number | null>(null);
  // Evidence items
  const [claim, setClaim] = useState<number | null>(null);
  const [evidence, setEvidence] = useState<number[]>([]);
  const [evidenceFirstTry, setEvidenceFirstTry] = useState<boolean | null>(null);
  const [evidenceOk, setEvidenceOk] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Show choices in a new order each time, so the right answer isn't always in
  // the same spot. Indexes still refer to the order the content was written in.
  const seed = useShuffleSeed();
  const shown = useMemo(() => {
    const count = item.kind === "choice" ? item.options.length : item.kind === "evidence" ? item.evidence.length : 0;
    return seededShuffle(Array.from({ length: count }, (_, i) => i), item.prompt + seed);
  }, [item, seed]);
  const claimOrder = useMemo(
    () => (item.kind === "evidence" ? seededShuffle(item.claims.map((_, i) => i), item.prompt + "claims" + seed) : []),
    [item, seed]
  );

  const next = (r: Response) => onNext(r);

  if (item.kind === "choice") {
    const answered = chosen !== null;
    const right = chosen === item.answer;
    return (
      <Panel>
        <div className={`grid gap-3 ${item.options.length <= 3 && isK2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {shown.map((i) => [i, item.options[i]] as const).map(([i, o]) => (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => {
                setChosen(i);
                playSoundEffect(i === item.answer ? "success" : "block_break");
              }}
              className={`flex min-h-16 items-center gap-3 rounded-md border-2 p-3 text-left text-lg active:scale-[0.98] ${
                answered && i === item.answer
                  ? "border-emerald-500 bg-emerald-950/50 text-stone-100"
                  : answered && i === chosen
                    ? "border-amber-600 bg-amber-950/40 text-stone-100"
                    : "border-stone-600 bg-stone-800 text-stone-100"
              } ${isK2 ? "flex-col justify-center text-center" : ""}`}
            >
              {o.emoji && (
                <span className={isK2 ? "text-5xl" : "text-3xl"} aria-hidden>
                  {o.emoji}
                </span>
              )}
              {o.text}
            </button>
          ))}
        </div>
        {answered && (
          <>
            <ExplainBox correct={right} explain={item.explain} />
            <PrimaryButton className="self-center" onClick={() => next({ prompt: item.prompt, answer: item.options[chosen!].text, correct: right })}>
              {app.ui("next")}
            </PrimaryButton>
          </>
        )}
      </Panel>
    );
  }

  if (item.kind === "number") {
    const value = parseFloat(numberText.replace(",", "."));
    const right = Math.abs(value - item.answer) < 0.01;
    return (
      <Panel>
        <input
          type="text"
          inputMode="decimal"
          value={numberText}
          disabled={checked}
          onChange={(e) => setNumberText(e.target.value.replace(/[^\d.,-]/g, ""))}
          aria-label={app.ui("typeAnswer")}
          className="mx-auto w-48 rounded-md border border-stone-600 bg-stone-950 p-3 text-center font-mono text-3xl text-stone-100 outline-none focus:border-amber-400"
        />
        {!checked ? (
          <PrimaryButton
            className="self-center"
            disabled={!numberText}
            onClick={() => {
              setChecked(true);
              playSoundEffect(right ? "success" : "block_break");
            }}
          >
            {app.ui("check")}
          </PrimaryButton>
        ) : (
          <>
            <ExplainBox correct={right} explain={item.explain} />
            <PrimaryButton className="self-center" onClick={() => next({ prompt: item.prompt, answer: numberText, correct: right })}>
              {app.ui("next")}
            </PrimaryButton>
          </>
        )}
      </Panel>
    );
  }

  if (item.kind === "order") {
    return (
      <Panel>
        {orderMistakes === null ? (
          <OrderPicker
            items={item.items.map((t) => ({ text: t }))}
            hintAfter={2}
            onDone={(m) => {
              setOrderMistakes(m);
              playSoundEffect("success");
            }}
          />
        ) : (
          <>
            <ol className="flex flex-col gap-1 text-lg text-stone-100">
              {item.items.map((t, i) => (
                <li key={i}>
                  {i + 1}. {t}
                </li>
              ))}
            </ol>
            <ExplainBox correct={orderMistakes === 0} explain={item.explain} />
            <PrimaryButton
              className="self-center"
              onClick={() => next({ prompt: item.prompt, answer: item.items.join(" → "), correct: orderMistakes === 0 })}
            >
              {app.ui("next")}
            </PrimaryButton>
          </>
        )}
      </Panel>
    );
  }

  if (item.kind === "write") {
    return (
      <Panel>
        <WriteBox value={text} onChange={setText} starters={item.starters} />
        <Feedback text={feedback} />
        <PrimaryButton
          className="self-center"
          onClick={() => {
            if (wordCount(text) < 3) return setFeedback(app.ui("writeMore"));
            next({ prompt: item.prompt, answer: text.trim(), correct: null });
          }}
        >
          {app.ui("next")}
        </PrimaryButton>
      </Panel>
    );
  }

  // Evidence: claim → evidence → (reasoning)
  const supports = (claimIdx: number, evIdx: number) => item.evidence[evIdx].supports.includes(claimIdx);
  const checkEvidence = () => {
    const ok = claim !== null && evidence.length === item.pick && evidence.every((e) => supports(claim, e));
    if (evidenceFirstTry === null) setEvidenceFirstTry(ok);
    if (!ok) {
      setFeedback(app.ui("evidenceMismatch"));
      playSoundEffect("block_break");
      return;
    }
    setFeedback(app.ui("evidenceGood"));
    playSoundEffect("success");
    setEvidenceOk(true);
  };
  const finishEvidence = () => {
    if (item.reasoning && wordCount(text) < 3) return setFeedback(app.ui("writeMore"));
    const answer = [
      item.claims[claim!],
      ...evidence.map((e) => `• ${item.evidence[e].text}`),
      ...(item.reasoning ? [text.trim()] : []),
    ].join("\n");
    next({ prompt: item.prompt, answer, correct: evidenceFirstTry });
  };

  return (
    <Panel>
      <p className="font-semibold text-amber-300">{app.ui("pickClaim")}</p>
      <div className="grid gap-2">
        {claimOrder.map((i) => [i, item.claims[i]] as const).map(([i, c]) => (
          <button
            key={i}
            type="button"
            disabled={evidenceOk}
            onClick={() => {
              setClaim(i);
              setFeedback(null);
            }}
            className={`min-h-14 rounded-md border-2 p-3 text-left text-lg ${
              claim === i ? "border-amber-400 bg-amber-500/20 text-amber-50" : "border-stone-600 bg-stone-800 text-stone-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {claim !== null && (
        <>
          <p className="font-semibold text-amber-300">{app.ui("pickEvidence", { n: item.pick })}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {shown.map((i) => {
              const e = item.evidence[i];
              const on = evidence.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={evidenceOk}
                  aria-pressed={on}
                  onClick={() => {
                    setFeedback(null);
                    setEvidence((ev) => (on ? ev.filter((x) => x !== i) : ev.length < item.pick ? [...ev, i] : ev));
                  }}
                  className={`min-h-16 rounded-md border-2 p-3 text-left ${
                    on ? "border-sky-400 bg-sky-500/15 text-sky-50" : "border-stone-600 bg-stone-800 text-stone-100"
                  }`}
                >
                  📄 {e.text}
                </button>
              );
            })}
          </div>
          <Feedback text={feedback} good={evidenceOk} />
          {!evidenceOk ? (
            <PrimaryButton className="self-center" disabled={evidence.length !== item.pick} onClick={checkEvidence}>
              {app.ui("check")}
            </PrimaryButton>
          ) : (
            <>
              {item.reasoning && (
                <>
                  <p className="font-semibold text-amber-300">{app.ui("writeReasoning")}</p>
                  <WriteBox value={text} onChange={setText} />
                </>
              )}
              <PrimaryButton className="self-center" onClick={finishEvidence}>
                {app.ui("next")}
              </PrimaryButton>
            </>
          )}
        </>
      )}
    </Panel>
  );
}

export default function QuizGame({ cfg, title, icon, onComplete, onClose }: QuizGameProps) {
  const app = useApp();
  const [index, setIndex] = useState(-1); // -1 = intro
  const [responses, setResponses] = useState<Response[]>([]);
  const item = index >= 0 ? cfg.items[index] : null;
  const finished = index >= cfg.items.length;

  const scored = responses.filter((r) => r.correct !== null).length;
  const correct = responses.filter((r) => r.correct === true).length;

  const speakText =
    item && app.band === "K-2" && item.kind === "choice"
      ? `${item.prompt} ${item.options.map((o) => o.text).join(". ")}`
      : undefined;

  return (
    <MinigameFrame
      title={title}
      icon={icon}
      instruction={finished ? app.ui("quizDone") : item ? item.prompt : cfg.intro}
      speakText={speakText}
      onClose={onClose}
    >
      {index === -1 && (
        <PrimaryButton className="self-center" onClick={() => setIndex(0)}>
          {app.ui("start")}
        </PrimaryButton>
      )}
      {item && !finished && (
        <>
          <p className="text-sm font-bold text-amber-200">
            {index + 1} / {cfg.items.length}
          </p>
          <ItemView
            key={index}
            item={item}
            onNext={(r) => {
              setResponses((rs) => [...rs, r]);
              setIndex((i) => i + 1);
            }}
          />
        </>
      )}
      {finished && (
        <FinishPanel message={app.ui("quizDone")} onFinish={() => onComplete({ correct, scored, responses })}>
          {scored > 0 && <p className="text-lg text-stone-200">{app.ui("score", { n: correct, total: scored })}</p>}
        </FinishPanel>
      )}
    </MinigameFrame>
  );
}
