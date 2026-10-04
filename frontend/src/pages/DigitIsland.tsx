import { useCallback, useEffect, useRef, useState } from "react";

import { BrainView } from "../components/brain/BrainView";
import { GuessCard } from "../components/brain/GuessCard";
import { NeuronDetail } from "../components/brain/NeuronDetail";
import { LossChart } from "../components/chart/LossChart";
import { ConceptCard } from "../components/concepts/ConceptCard";
import { ConceptShelf } from "../components/concepts/ConceptShelf";
import { TinkerSliders, type TinkerSettings } from "../components/controls/TinkerSliders";
import { TrainControls, type ControlHint } from "../components/controls/TrainControls";
import { DrawPad } from "../components/draw/DrawPad";
import { WhatHappened, type FeedItem } from "../components/feed/WhatHappened";
import { GuidePanel } from "../components/guide/GuidePanel";
import type { Mood } from "../components/guide/Robot";
import { WrongMeter } from "../components/meter/WrongMeter";
import { MissionComplete } from "../components/mission/MissionComplete";
import { StatusBanner } from "../components/layout/StatusBanner";
import { useMission } from "../hooks/useMission";
import { useSession } from "../hooks/useSession";
import { useTraining } from "../hooks/useTraining";
import { format, useI18n } from "../i18n";
import { api } from "../lib/api";
import type { Prediction } from "../lib/types";
import { goalProgress, isBrainUnlocked, type StepId } from "../missions/digitIsland";
import { useDepth } from "../state/depth";

/** "Break it!" uses a step size far beyond anything the slider offers. */
const BREAK_LEARNING_RATE = 60;
const FEED_LENGTH = 6;
const LIVE_PREDICT_MS = 700;

const HINTS: Partial<Record<StepId, ControlHint>> = {
  train: "train",
  break: "break",
  fix: "reset",
  final: "train",
};

interface Props {
  onHome: () => void;
}

export function DigitIsland({ onHome }: Props) {
  const { t } = useI18n();
  const { atLeast } = useDepth();
  const { session, failed, retry } = useSession();
  const { snapshot, running, status, history, send } = useTraining(session?.id ?? null);
  const mission = useMission();

  const [settings, setSettings] = useState<TinkerSettings>({ speed: 5, learningRate: 1, batchSize: 32 });
  const [pixels, setPixels] = useState<Float32Array | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [asking, setAsking] = useState(false);
  const [neuron, setNeuron] = useState<number | null>(null);
  const [weights, setWeights] = useState<number[][] | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const feedId = useRef(0);

  const say = useCallback((text: string, tone: FeedItem["tone"] = "info") => {
    feedId.current += 1;
    const item = { id: feedId.current, text, tone };
    setFeed((prev) => [item, ...prev].slice(0, FEED_LENGTH));
  }, []);

  // ---------------------------------------------------------------- predictions
  const predict = useCallback(
    async (image: Float32Array) => {
      if (!session) return null;
      const result = await api.predict(session.id, Array.from(image));
      setPrediction(result);
      return result;
    },
    [session],
  );

  const ask = async (image: Float32Array) => {
    setPixels(image);
    setAsking(true);
    try {
      const result = await predict(image);
      if (result) {
        say(format(t.feed.guessed, { digit: result.prediction }));
        mission.dispatch({ type: "guessed" });
      }
    } finally {
      setAsking(false);
    }
  };

  // ------------------------------------------------------------ training events
  useEffect(() => {
    // Announce once per connection, not on every language switch.
    if (status === "open") say(t.feed.awake);
  }, [status, session?.id]);

  const runStart = useRef<{ samples: number; loss: number | null } | null>(null);
  const lastLivePredict = useRef(0);

  useEffect(() => {
    if (!snapshot) return;
    mission.dispatch({ type: "snapshot", snapshot });

    if (running && !runStart.current) {
      runStart.current = { samples: snapshot.samples_seen, loss: snapshot.loss };
    }
    if (!running && runStart.current) {
      const start = runStart.current;
      runStart.current = null;
      const count = snapshot.samples_seen - start.samples;
      if (snapshot.exploded) {
        say(t.feed.exploded, "bad");
      } else if (count > 0) {
        const better = start.loss === null || (snapshot.loss ?? Infinity) <= start.loss;
        say(
          format(t.feed.trained, {
            count: count.toLocaleString(),
            direction: better ? t.feed.down : t.feed.up,
          }),
          better ? "good" : "bad",
        );
      }
    }

    // Keep the brain view alive while training: re-run the last drawing now and then.
    const now = Date.now();
    if (pixels && now - lastLivePredict.current > LIVE_PREDICT_MS) {
      lastLivePredict.current = now;
      predict(pixels).catch(() => undefined);
    }
  }, [snapshot, running]);

  // ------------------------------------------------------------------ controls
  const play = () => {
    send({
      action: "set",
      learning_rate: settings.learningRate,
      batch_size: settings.batchSize,
      steps_per_tick: settings.speed,
    });
    send({ action: "play" });
  };

  const step = () => {
    send({ action: "step" });
    say(t.feed.stepped);
  };

  const breakIt = () => {
    send({ action: "set", learning_rate: BREAK_LEARNING_RATE, steps_per_tick: 5 });
    send({ action: "play" });
  };

  const reset = () => {
    send({ action: "set", batch_size: settings.batchSize });
    send({ action: "reset", learning_rate: settings.learningRate });
    setPrediction(null);
    say(t.feed.reset);
    mission.dispatch({ type: "reset" });
  };

  const changeSettings = (next: TinkerSettings) => {
    setSettings(next);
    send({
      action: "set",
      learning_rate: next.learningRate,
      batch_size: next.batchSize,
      steps_per_tick: next.speed,
    });
  };

  const openBulb = async (index: number) => {
    setNeuron(index);
    say(format(t.feed.neuron, { n: index + 1 }));
    mission.dispatch({ type: "neuronOpened" });
    if (session) setWeights((await api.weights(session.id)).neurons);
  };

  const replay = () => {
    mission.restart();
    reset();
  };

  // -------------------------------------------------------------------- render
  const exploded = snapshot?.exploded ?? false;
  const mood: Mood = exploded
    ? "dizzy"
    : mission.step === "done"
      ? "excited"
      : running || asking
        ? "thinking"
        : "happy";
  const showNumbers = atLeast("tinker");
  const brainLocked = !atLeast("tinker") && !isBrainUnlocked(mission.step);
  const ready = status === "open" && !!session;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-4">
      <StatusBanner
        failed={failed}
        connecting={!session && !failed}
        lost={!!session && status === "closed"}
        onRetry={retry}
      />

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <GuidePanel
            step={mission.step}
            mood={mood}
            progress={goalProgress(mission.step, snapshot)}
            values={{
              digit: prediction?.prediction ?? "?",
              count: (snapshot?.samples_seen ?? 0).toLocaleString(),
            }}
          />
          <ConceptShelf concepts={mission.concepts} onOpen={mission.setOpenConcept} />
          <div className="hidden lg:block">
            <WhatHappened items={feed} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          {mission.step === "done" && <MissionComplete onReplay={replay} onMap={onHome} />}

          <div className="grid gap-4 md:grid-cols-2">
            <DrawPad
              onAsk={ask}
              busy={!ready || asking}
              highlight={mission.step === "meet" || mission.step === "retry"}
              showPreview={showNumbers}
            />
            <div className="flex flex-col gap-4">
              <GuessCard prediction={prediction} showNumbers={showNumbers} />
              <WrongMeter snapshot={snapshot} showNumbers={showNumbers} />
            </div>
          </div>

          <section className="card flex flex-col gap-4">
            <TrainControls
              running={running}
              exploded={exploded}
              disabled={!ready}
              hint={HINTS[mission.step] ?? null}
              onPlay={play}
              onPause={() => send({ action: "pause" })}
              onStep={step}
              onBreak={breakIt}
              onReset={reset}
            />
            {showNumbers && <TinkerSliders settings={settings} onChange={changeSettings} />}
          </section>

          {showNumbers && <LossChart history={history} />}

          <BrainView
            prediction={prediction}
            pixels={pixels}
            locked={brainLocked}
            showNumbers={showNumbers}
            onBulbClick={openBulb}
          />

          <div className="lg:hidden">
            <WhatHappened items={feed} />
          </div>
        </div>
      </div>

      {neuron !== null && (
        <NeuronDetail
          index={neuron}
          weights={weights?.[neuron] ?? null}
          onClose={() => {
            setNeuron(null);
            setWeights(null);
          }}
        />
      )}
      {mission.openConcept && (
        <ConceptCard concept={mission.openConcept} onClose={() => mission.setOpenConcept(null)} />
      )}
    </main>
  );
}
