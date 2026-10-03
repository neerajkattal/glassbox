import { useI18n } from "../../i18n";

export const SPEEDS = [1, 5, 25] as const;
export const BATCH_SIZES = [1, 8, 32, 128] as const;
/** Learning rates offered by the slider, on a roughly logarithmic scale. */
export const LEARNING_RATES = [0.01, 0.03, 0.1, 0.3, 1, 3, 10] as const;

export interface TinkerSettings {
  speed: number;
  learningRate: number;
  batchSize: number;
}

interface Props {
  settings: TinkerSettings;
  onChange: (settings: TinkerSettings) => void;
}

function Slider(props: {
  label: string;
  value: number;
  options: readonly number[];
  display: (v: number) => string;
  ends?: [string, string];
  onChange: (v: number) => void;
}) {
  const index = Math.max(0, props.options.indexOf(props.value));
  return (
    <label className="flex flex-col gap-1">
      <span className="flex justify-between text-sm font-bold">
        {props.label}
        <span className="tabular-nums text-brand-600">{props.display(props.value)}</span>
      </span>
      <input
        type="range"
        min={0}
        max={props.options.length - 1}
        step={1}
        value={index}
        onChange={(e) => props.onChange(props.options[Number(e.target.value)])}
        className="accent-brand-600"
      />
      {props.ends && (
        <span className="flex justify-between text-[11px] text-gray-400">
          <span>{props.ends[0]}</span>
          <span>{props.ends[1]}</span>
        </span>
      )}
    </label>
  );
}

export function TinkerSliders({ settings, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 rounded-2xl bg-gray-50 p-4 sm:grid-cols-3">
      <Slider
        label={t.controls.speed}
        value={settings.speed}
        options={SPEEDS}
        display={(v) => `${v}×`}
        ends={[t.controls.slow, t.controls.fast]}
        onChange={(speed) => onChange({ ...settings, speed })}
      />
      <Slider
        label={t.controls.learningRate}
        value={settings.learningRate}
        options={LEARNING_RATES}
        display={(v) => String(v)}
        onChange={(learningRate) => onChange({ ...settings, learningRate })}
      />
      <Slider
        label={t.controls.batchSize}
        value={settings.batchSize}
        options={BATCH_SIZES}
        display={(v) => String(v)}
        onChange={(batchSize) => onChange({ ...settings, batchSize })}
      />
    </div>
  );
}
