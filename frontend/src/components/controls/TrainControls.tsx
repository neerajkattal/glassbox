import { Pause, Play, RotateCcw, SkipForward, Zap } from "lucide-react";
import { useI18n } from "../../i18n";

export type ControlHint = "train" | "break" | "reset" | null;

interface Props {
  running: boolean;
  exploded: boolean;
  disabled: boolean;
  hint: ControlHint;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onBreak: () => void;
  onReset: () => void;
}

const glow = "ring-4 ring-amber-300 ring-offset-2";

/** One big obvious action (Train / Pause) plus the smaller tools around it. */
export function TrainControls(props: Props) {
  const { t } = useI18n();
  const { running, exploded, disabled, hint } = props;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {running ? (
        <button type="button" className="btn-primary min-w-32 text-base" onClick={props.onPause}>
          <Pause className="h-4 w-4" aria-hidden /> {t.controls.pause}
        </button>
      ) : (
        <button
          type="button"
          className={`btn-primary min-w-32 text-base ${hint === "train" ? glow : ""}`}
          onClick={props.onPlay}
          disabled={disabled || exploded}
        >
          <Play className="h-4 w-4" aria-hidden /> {t.controls.train}
        </button>
      )}
      <button
        type="button"
        className="btn-soft"
        onClick={props.onStep}
        disabled={disabled || running || exploded}
      >
        <SkipForward className="h-4 w-4" aria-hidden /> {t.controls.step}
      </button>
      <button
        type="button"
        className={`btn-danger ${hint === "break" ? glow : ""}`}
        onClick={props.onBreak}
        disabled={disabled || exploded}
      >
        <Zap className="h-4 w-4" aria-hidden /> {t.controls.breakIt}
      </button>
      <button
        type="button"
        className={`btn-soft ${hint === "reset" ? glow : ""}`}
        onClick={props.onReset}
        disabled={disabled}
      >
        <RotateCcw className="h-4 w-4" aria-hidden /> {t.controls.reset}
      </button>
    </div>
  );
}
