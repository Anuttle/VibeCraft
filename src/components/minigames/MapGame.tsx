import { useState } from "react";
import { useApp } from "../../AppContext";
import type { MapConfig, MapCity } from "../../game/activities";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { Feedback, FinishPanel } from "./shared";

interface MapGameProps {
  cfg: MapConfig;
  title: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

// Map window over western and central Europe (simple equirectangular projection).
const LON_MIN = -10;
const LON_MAX = 25;
const LAT_MIN = 36;
const LAT_MAX = 57;
const W = 700;
const H = 520;
const project = (c: { lat: number; lon: number }) => ({
  x: ((c.lon - LON_MIN) / (LON_MAX - LON_MIN)) * W,
  y: ((LAT_MAX - c.lat) / (LAT_MAX - LAT_MIN)) * H,
});

// Rough labels so the parchment reads as a map without needing coastline data.
const SEAS = [
  { label: { en: "Atlantic Ocean", es: "Océano Atlántico" }, lat: 46, lon: -7.5 },
  { label: { en: "North Sea", es: "Mar del Norte" }, lat: 55.5, lon: 3 },
  { label: { en: "Mediterranean Sea", es: "Mar Mediterráneo" }, lat: 38, lon: 5 },
];

export default function MapGame({ cfg, title, icon, onComplete, onClose }: MapGameProps) {
  const app = useApp();
  const ordered = [...cfg.cities].sort((a, b) => a.year - b.year);
  const [reached, setReached] = useState<string[]>([]);
  const [last, setLast] = useState<MapCity | null>(null);
  const [misses, setMisses] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const done = reached.length === cfg.cities.length;
  const origin = ordered[0];

  const tap = (city: MapCity) => {
    if (reached.includes(city.id)) return;
    if (cfg.mode === "order") {
      const next = ordered[reached.length];
      if (city.id !== next.id) {
        setMisses((m) => m + 1);
        setFeedback(misses >= 1 ? `${app.ui("mapWrong")} ${app.ui("mapHint")}` : app.ui("mapWrong"));
        return;
      }
    }
    setFeedback(null);
    setMisses(0);
    setLast(city);
    const now = [...reached, city.id];
    setReached(now);
    playSoundEffect(now.length === cfg.cities.length ? "success" : "pickup");
  };

  const nextInOrder = cfg.mode === "order" ? ordered[reached.length] : null;

  return (
    <MinigameFrame title={title} icon={icon} instruction={done ? cfg.success : cfg.instruction} onClose={onClose}>
      <p className="text-lg font-bold text-amber-200">{app.ui("citiesReached", { n: reached.length, total: cfg.cities.length })}</p>
      <div className="w-full overflow-hidden rounded-lg border-4 border-amber-900 bg-[#ead9b0] shadow-xl">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={title}>
          {/* Grid lines */}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`v${i}`} x1={(i * W) / 7} y1={0} x2={(i * W) / 7} y2={H} stroke="#c9b27e" strokeWidth={1} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={(i * H) / 5} x2={W} y2={(i * H) / 5} stroke="#c9b27e" strokeWidth={1} />
          ))}
          {SEAS.map((s) => {
            const p = project(s);
            return (
              <text key={s.label.en} x={p.x} y={p.y} fill="#7a6a45" fontSize={16} fontStyle="italic" textAnchor="middle">
                {s.label[app.lang]}
              </text>
            );
          })}
          {/* Spread lines from the first city */}
          {reached
            .filter((id) => id !== origin.id)
            .map((id) => {
              const c = cfg.cities.find((x) => x.id === id)!;
              const a = project(origin);
              const b = project(c);
              return <line key={`l${id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b45309" strokeWidth={2} strokeDasharray="6 4" />;
            })}
          {cfg.cities.map((c) => {
            const p = project(c);
            const on = reached.includes(c.id);
            const hinted = nextInOrder?.id === c.id && misses >= 2;
            return (
              <g key={c.id} onClick={() => tap(c)} style={{ cursor: "pointer" }}>
                <circle cx={p.x} cy={p.y} r={26} fill="transparent" />
                <circle cx={p.x} cy={p.y} r={on ? 11 : 9} fill={on ? "#b91c1c" : "#57534e"} stroke={hinted ? "#f59e0b" : "#fff7e6"} strokeWidth={hinted ? 5 : 3} />
                <text x={p.x + 14} y={p.y + 5} fontSize={17} fontWeight={700} fill="#1c1917">
                  {c.name}
                  {on ? ` · c. ${c.year}` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <Feedback text={feedback} />
      {last?.note && !done && (
        <p className="rounded-md border border-amber-700/50 bg-stone-900 p-3 text-center text-lg text-stone-100">
          <strong>
            {last.name}, c. {last.year}:
          </strong>{" "}
          {last.note}
        </p>
      )}
      {done && <FinishPanel message={cfg.success} onFinish={onComplete} />}
    </MinigameFrame>
  );
}
