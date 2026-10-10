/**
 * English copy. This object's shape is the source of truth: every other
 * language must provide exactly the same keys (enforced by the type checker).
 */
export const en = {
  app: {
    name: "Glassbox",
    tagline: "Teach a robot. Watch its brain.",
  },
  nav: {
    map: "Map",
    language: "Language",
    depth: "How deep?",
  },
  depth: {
    story: "Story",
    tinker: "Tinker",
    math: "Math",
    storyHint: "Pictures, no numbers",
    tinkerHint: "Sliders and real numbers",
    mathHint: "Formulas and code too",
  },
  home: {
    title: "Learn how AI learns, by teaching one yourself.",
    subtitle:
      "No maths needed to start. Draw, train and even break a tiny robot brain — then find out what the big words mean.",
    start: "Start Digit Island",
    continue: "Continue Digit Island",
    howTitle: "How it works",
    how: [
      { title: "Play", body: "Draw a number and teach the robot to read it." },
      { title: "Notice", body: "Watch its brain light up and its mistakes shrink." },
      { title: "Name it", body: "Only then do you learn the real name for what you saw." },
    ],
    hood: {
      title: "A glass box, not a black box",
      points: [
        {
          title: "Built from scratch",
          body: "The neural network engine is written in NumPy, with no PyTorch, so every number on screen traces back to code you can read.",
        },
        {
          title: "Trains live",
          body: "Training runs on the server and streams every step to your browser over a WebSocket.",
        },
        {
          title: "Tested properly",
          body: "68 automated tests, continuous integration and written architecture decisions.",
        },
      ],
      code: "View the code on GitHub",
    },
    mapTitle: "Your learning map",
    comingSoon: "Coming soon",
    completed: "Completed",
    inProgress: "Start here",
    islands: {
      digit: { name: "Digit Island", blurb: "What is a neural network? Train one to read handwriting." },
      downhill: { name: "Downhill Valley", blurb: "Gradient descent: how a robot finds the bottom of a valley blindfolded." },
      blame: { name: "Blame Bridge", blurb: "Backpropagation: passing the blame back through the team." },
      words: { name: "Word City", blurb: "How a tiny GPT guesses the next word." },
      highlighter: { name: "Highlighter Tower", blurb: "Attention: words highlighting the words they need." },
      memory: { name: "Memory Palace", blurb: "Where a language model keeps its facts." },
      surprise: { name: "Surprise Lake", blurb: "Cross-entropy: measuring how surprised a model is." },
      noise: { name: "Noise Lake", blurb: "Diffusion: turning static into a picture." },
    },
  },
  mission: {
    title: "Digit Island",
    stepOf: "Step {n} of {total}",
    goal: "Your goal",
  },
  steps: {
    meet: {
      say: "Hi! I'm Bit. I want to learn to read handwritten numbers. Draw any digit from 0 to 9 and press “Ask Bit”.",
      goal: "Draw a digit and ask Bit",
    },
    train: {
      say: "I guessed {digit}… I'm just guessing! My brain has thousands of knobs, all set randomly. Press ▶ Train so I can practise on real examples.",
      goal: "Train Bit until it gets 80% right",
    },
    retry: {
      say: "Wow, I've practised on {count} examples! Draw your digit again — let's see if I've learned.",
      goal: "Ask Bit again",
    },
    peek: {
      say: "Want to look inside my head? Every bulb below is a neuron. Tap a bulb in layer 1 to see what it looks for.",
      goal: "Tap a bulb in layer 1",
    },
    break: {
      say: "Now the fun part: what if I try to learn way too fast? Press “Break it!” and watch what happens.",
      goal: "Press Break it",
    },
    fix: {
      say: "Whoa, I'm dizzy! My steps were so big I jumped right over the answer. Press “Reset” to give me a fresh brain.",
      goal: "Reset Bit",
    },
    final: {
      say: "Final mission: train me properly and get me to 90% correct. You know how now!",
      goal: "Reach 90% correct",
    },
    done: {
      say: "You did it! You trained a real neural network and you know what's happening inside it.",
      goal: "Island complete",
    },
  },
  draw: {
    title: "Drawing pad",
    hint: "Draw one big digit in the middle",
    clear: "Clear",
    ask: "Ask Bit",
    empty: "Draw a digit first!",
    sees: "What Bit sees",
  },
  guess: {
    title: "Bit's guess",
    says: "I think it's a {digit}!",
    confidence: "{pct}% sure",
    none: "Draw a digit and ask me!",
  },
  brain: {
    title: "Bit's brain",
    locked: "Keep going with the mission to unlock Bit's brain.",
    eyes: "Eyes",
    layer1: "Layer 1",
    layer2: "Layer 2",
    answer: "Answer",
    tapHint: "Brighter bulb = more excited. Tap a layer-1 bulb.",
    neuronTitle: "Bulb {n} — its 784 knobs",
    neuronHint:
      "Orange knobs make this bulb glow when there is ink there; blue knobs dim it. Real networks rarely learn neat strokes — it looks messy, and still works!",
    close: "Close",
  },
  meter: {
    title: "How wrong is Bit?",
    levels: {
      clueless: "Totally guessing",
      learning: "Getting the hang of it",
      good: "Pretty good!",
      great: "Excellent!",
      exploded: "Completely confused!",
    },
    accuracy: "Correct on test digits",
    loss: "Loss",
    examples: "Examples seen",
  },
  controls: {
    train: "Train",
    pause: "Pause",
    step: "One step",
    breakIt: "Break it!",
    reset: "Reset",
    speed: "Training speed",
    learningRate: "Learning rate (step size)",
    batchSize: "Examples per step",
    slow: "slow",
    fast: "fast",
  },
  chart: {
    title: "Learning curve",
    loss: "Loss",
    accuracy: "Accuracy",
    empty: "Start training to draw the curve.",
  },
  feed: {
    title: "What just happened",
    empty: "Whatever you do will be explained here in plain words.",
    awake: "Bit is awake with a random brain.",
    trained: "Bit practised on {count} examples. Its mistakes went {direction}.",
    down: "down ↓",
    up: "up ↑",
    paused: "Paused after {steps} steps.",
    guessed: "You showed Bit a drawing. It guessed {digit}.",
    stepped: "Bit took exactly one small step downhill.",
    exploded: "The step size was so big that Bit overshot and got lost. That's a learning rate that's too high.",
    reset: "Bit's brain was reset to random knobs.",
    neuron: "You looked at the knobs of bulb {n}.",
  },
  concepts: {
    discovered: "You just discovered",
    gotIt: "Got it!",
    mathTitle: "The maths",
    codeTitle: "In our code",
    training: {
      name: "Training & loss",
      story:
        "Training means showing the robot lots of examples and nudging its knobs after every mistake. The “how wrong” meter is called the loss — training is just making the loss smaller.",
    },
    neuron: {
      name: "Neurons",
      story:
        "Each bulb is a neuron: a tiny unit that holds a number between 0 and 1. Layers of neurons pass a signal from the eyes to the answer, each layer noticing slightly bigger patterns.",
    },
    weights: {
      name: "Weights",
      story:
        "The knobs are called weights. A neuron adds up the pixels, each multiplied by its weight, then squashes the total into 0–1. Learning = finding good weights.",
    },
    learningRate: {
      name: "Learning rate",
      story:
        "The learning rate is how big a step the robot takes after each mistake. Too small and it learns slowly; too big and it jumps over the answer and gets lost.",
    },
    gradientDescent: {
      name: "Gradient descent",
      story:
        "Every step, the robot asks: “which way should each knob move to be a little less wrong?” and moves them a little that way. It's like walking downhill in fog. That's gradient descent.",
    },
  },
  status: {
    waking: "Waking Bit up…",
    firstTime: "Bit lives on a free server that naps when nobody is around, so the first visit can take up to a minute.",
    offline: "Can't reach Bit's server right now. It may still be waking up.",
    retry: "Try again",
    reconnecting: "Connection lost — reconnecting…",
  },
  done: {
    title: "Digit Island complete!",
    body: "You trained a neural network, looked inside its brain, broke it and fixed it. That's more than most people ever see.",
    badge: "Digit Island badge earned",
    next: "Next: Downhill Valley (coming soon)",
    replay: "Play again",
    map: "Back to map",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Messages = Widen<typeof en>;
