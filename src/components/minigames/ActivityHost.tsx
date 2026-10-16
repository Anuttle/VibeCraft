import { useApp } from "../../AppContext";
import type { ActivityDef, ActivityResult } from "../../game/activities";
import Typesetting from "./Typesetting";
import PressGame from "./PressGame";
import MixGame from "./MixGame";
import SequenceGame from "./SequenceGame";
import HoldGame from "./HoldGame";
import CarveGame from "./CarveGame";
import CopyGame from "./CopyGame";
import MapGame from "./MapGame";
import QuizGame from "./QuizGame";

interface ActivityHostProps {
  activity: ActivityDef;
  /** Lines set earlier in the chapter, printed by a press activity that has no lines of its own. */
  typesetLines: string[] | null;
  onComplete: (result: ActivityResult) => void;
  onClose: () => void;
}

/** Opens the right minigame for an activity, with the config for the current band and language. */
export default function ActivityHost({ activity, typesetLines, onComplete, onClose }: ActivityHostProps) {
  const app = useApp();
  const common = { title: app.pick(activity.title), icon: activity.icon, onClose };
  const done = () => onComplete({});

  switch (activity.kind) {
    case "typeset":
      return <Typesetting {...common} cfg={activity.config[app.band][app.lang]} onComplete={(lines) => onComplete({ lines })} />;
    case "press": {
      const lines = activity.lines?.[app.band][app.lang] ?? typesetLines ?? [app.ui("gameTitle")];
      return <PressGame {...common} cfg={activity.config[app.band]} lines={lines} onComplete={done} />;
    }
    case "mix":
      return <MixGame {...common} cfg={activity.config[app.band][app.lang]} onComplete={done} />;
    case "sequence":
      return <SequenceGame {...common} cfg={activity.config[app.band][app.lang]} onComplete={done} />;
    case "hold":
      return <HoldGame {...common} cfg={activity.config[app.band][app.lang]} onComplete={done} />;
    case "carve":
      return <CarveGame {...common} cfg={activity.config[app.band][app.lang]} onComplete={done} />;
    case "copy":
      return <CopyGame {...common} cfg={activity.config[app.band][app.lang]} onComplete={done} />;
    case "map":
      return <MapGame {...common} cfg={activity.config[app.band][app.lang]} onComplete={done} />;
    case "quiz":
      return <QuizGame {...common} cfg={activity.config[app.band][app.lang]} onComplete={(quiz) => onComplete({ quiz })} />;
  }
}
