import type { Messages } from "./en";

/** Hinglish (Hindi in Roman script, with everyday English words). */
export const hinglish: Messages = {
  app: {
    name: "Glassbox",
    tagline: "Robot ko sikhao. Uska dimaag dekho.",
  },
  nav: {
    map: "Map",
    language: "Bhasha",
    depth: "Kitna deep?",
  },
  depth: {
    story: "Story",
    tinker: "Tinker",
    math: "Math",
    storyHint: "Sirf pictures, numbers nahi",
    tinkerHint: "Sliders aur asli numbers",
    mathHint: "Formulas aur code bhi",
  },
  home: {
    title: "AI kaise seekhta hai — khud ek ko sikha ke samjho.",
    subtitle:
      "Shuru karne ke liye maths ki zarurat nahi. Ek chhote robot ka dimaag draw karo, train karo, tod bhi do — phir bade-bade words ka matlab samjho.",
    start: "Digit Island shuru karo",
    continue: "Digit Island continue karo",
    howTitle: "Kaise kaam karta hai",
    how: [
      { emoji: "🎮", title: "Khelo", body: "Ek number draw karo aur robot ko padhna sikhao." },
      { emoji: "👀", title: "Dekho", body: "Uska dimaag jalte hue aur galtiyan kam hote hue dekho." },
      { emoji: "🏷️", title: "Naam jaano", body: "Jo dekha, uska asli naam baad mein pata chalta hai." },
    ],
    mapTitle: "Tumhara learning map",
    comingSoon: "Jald aa raha hai",
    completed: "Pura hua",
    inProgress: "Yahan se shuru",
    islands: {
      digit: { name: "Digit Island", blurb: "Neural network kya hai? Ek ko handwriting padhna sikhao." },
      downhill: { name: "Downhill Valley", blurb: "Gradient descent: aankh band karke ghaati ke neeche kaise pahunche." },
      blame: { name: "Blame Bridge", blurb: "Backpropagation: galti ka blame team mein peeche bhejna." },
      words: { name: "Word City", blurb: "Ek chhota GPT agla word kaise guess karta hai." },
      highlighter: { name: "Highlighter Tower", blurb: "Attention: words un words ko highlight karte hain jinki unhe zarurat hai." },
      memory: { name: "Memory Palace", blurb: "Language model apne facts kahan rakhta hai." },
      surprise: { name: "Surprise Lake", blurb: "Cross-entropy: model kitna surprise hua, yeh naapna." },
      noise: { name: "Noise Lake", blurb: "Diffusion: static ko picture mein badalna." },
    },
  },
  mission: {
    title: "Digit Island",
    stepOf: "Step {n} / {total}",
    goal: "Tumhara goal",
  },
  steps: {
    meet: {
      say: "Namaste! Main Bit hoon 🤖 Mujhe haath se likhe numbers padhna seekhna hai. 0 se 9 tak koi bhi digit draw karo aur “Bit se pucho” dabao.",
      goal: "Digit draw karo aur Bit se pucho",
    },
    train: {
      say: "Maine {digit} guess kiya… main toh bas tukka maar raha hoon! Mere dimaag mein hazaron knobs hain, sab random. ▶ Train dabao taaki main asli examples pe practice kar sakun.",
      goal: "Bit ko 80% sahi hone tak train karo",
    },
    retry: {
      say: "Wah, maine {count} examples pe practice kar li! Apna digit phir se draw karo — dekhte hain maine seekha ya nahi.",
      goal: "Bit se phir pucho",
    },
    peek: {
      say: "Mere dimaag ke andar dekhna hai? Neeche har bulb ek neuron hai. Layer 1 ka koi bulb tap karo aur dekho woh kya dhoondhta hai.",
      goal: "Layer 1 ka ek bulb tap karo",
    },
    break: {
      say: "Ab mazedaar part: agar main bahut zyada tez seekhne ki koshish karun toh? 💥 Tod do dabao aur dekho kya hota hai.",
      goal: "Tod do dabao",
    },
    fix: {
      say: "Arre, mujhe chakkar aa rahe hain! 😵 Mere steps itne bade the ki main answer ke upar se kood gaya. ↺ Reset dabao aur mujhe naya dimaag do.",
      goal: "Bit ko reset karo",
    },
    final: {
      say: "Last mission: mujhe sahi tareeke se train karo aur 90% sahi tak pahunchao. Ab tumhe aata hai!",
      goal: "90% sahi tak pahuncho",
    },
    done: {
      say: "Tumne kar dikhaya! Tumne ek asli neural network train kiya aur samjha ki andar kya ho raha hai. 🎉",
      goal: "Island pura hua",
    },
  },
  draw: {
    title: "Drawing pad",
    hint: "Beech mein ek bada digit draw karo",
    clear: "Saaf karo",
    ask: "Bit se pucho",
    empty: "Pehle ek digit draw karo!",
    sees: "Bit ko kya dikhta hai",
  },
  guess: {
    title: "Bit ka guess",
    says: "Mujhe lagta hai yeh {digit} hai!",
    confidence: "{pct}% pakka",
    none: "Digit draw karo aur mujhse pucho!",
  },
  brain: {
    title: "Bit ka dimaag",
    locked: "Mission aage badhao, phir Bit ka dimaag khulega.",
    eyes: "Aankhein",
    layer1: "Layer 1",
    layer2: "Layer 2",
    answer: "Jawab",
    tapHint: "Jitna bright bulb, utna excited. Layer 1 ka bulb tap karo.",
    neuronTitle: "Bulb {n} — iske 784 knobs",
    neuronHint:
      "Orange knobs wahan ink hone par bulb ko jalate hain; blue knobs use dhima karte hain. Asli networks saaf-suthre patterns kam hi seekhte hain — messy dikhta hai, phir bhi kaam karta hai!",
    close: "Band karo",
  },
  meter: {
    title: "Bit kitna galat hai?",
    levels: {
      clueless: "Bilkul tukka",
      learning: "Seekh raha hai",
      good: "Kaafi accha!",
      great: "Zabardast!",
      exploded: "Poori tarah confuse!",
    },
    accuracy: "Test digits pe sahi",
    loss: "Loss",
    examples: "Dekhe gaye examples",
  },
  controls: {
    train: "Train",
    pause: "Ruko",
    step: "Ek step",
    breakIt: "Tod do!",
    reset: "Reset",
    speed: "Training speed",
    learningRate: "Learning rate (step ka size)",
    batchSize: "Har step mein examples",
    slow: "dheere",
    fast: "tez",
  },
  chart: {
    title: "Learning curve",
    loss: "Loss",
    accuracy: "Accuracy",
    empty: "Curve banane ke liye training shuru karo.",
  },
  feed: {
    title: "Abhi kya hua",
    empty: "Tum jo bhi karoge, yahan simple shabdon mein samjhaya jayega.",
    awake: "Bit jaag gaya hai, random dimaag ke saath.",
    trained: "Bit ne {count} examples pe practice ki. Galtiyan {direction}.",
    down: "kam huin 📉",
    up: "badh gayin 📈",
    paused: "{steps} steps ke baad ruka.",
    guessed: "Tumne Bit ko drawing dikhayi. Usne {digit} guess kiya.",
    stepped: "Bit ne neeche ki taraf bilkul ek chhota step liya.",
    exploded: "Step itna bada tha ki Bit aage nikal gaya aur kho gaya. Yahi hota hai jab learning rate bahut zyada ho.",
    reset: "Bit ka dimaag random knobs pe reset ho gaya.",
    neuron: "Tumne bulb {n} ke knobs dekhe.",
  },
  concepts: {
    discovered: "Tumne abhi discover kiya",
    gotIt: "Samajh gaya!",
    mathTitle: "Maths",
    codeTitle: "Hamare code mein",
    training: {
      name: "Training aur loss",
      story:
        "Training matlab robot ko bahut saare examples dikhana aur har galti ke baad uske knobs thoda ghumana. “Kitna galat” meter ko loss kehte hain — training bas loss ko chhota karna hai.",
    },
    neuron: {
      name: "Neurons",
      story:
        "Har bulb ek neuron hai: ek chhoti unit jo 0 aur 1 ke beech ka number rakhti hai. Neurons ki layers signal ko aankhon se jawab tak le jaati hain, har layer thode bade patterns pakadti hai.",
    },
    weights: {
      name: "Weights",
      story:
        "Knobs ko weights kehte hain. Neuron har pixel ko uske weight se multiply karke jodta hai, phir total ko 0–1 mein daba deta hai. Seekhna = acche weights dhoondhna.",
    },
    learningRate: {
      name: "Learning rate",
      story:
        "Learning rate batata hai ki har galti ke baad robot kitna bada step leta hai. Bahut chhota — dheere seekhega; bahut bada — answer ke upar se kood ke kho jayega.",
    },
    gradientDescent: {
      name: "Gradient descent",
      story:
        "Har step pe robot puchta hai: “thoda kam galat hone ke liye har knob kis taraf ghumaun?” aur thoda usi taraf ghuma deta hai. Jaise kohre mein pahaad se neeche utarna. Isi ko gradient descent kehte hain.",
    },
  },
  status: {
    waking: "Bit ko jaga rahe hain…",
    firstTime: "Pehli baar thode seconds lag sakte hain, 60,000 handwritten digits download ho rahe hain.",
    offline: "Bit ke server tak nahi pahunch pa rahe. Kya backend port 8000 pe chal raha hai?",
    retry: "Phir try karo",
    reconnecting: "Connection toot gaya — dobara jod rahe hain…",
  },
  done: {
    title: "Digit Island pura hua!",
    body: "Tumne ek neural network train kiya, uske dimaag ke andar dekha, use toda aur theek kiya. Zyadatar log itna kabhi nahi dekhte.",
    badge: "Digit Island badge mila",
    next: "Agla: Downhill Valley (jald aa raha hai)",
    replay: "Phir se khelo",
    map: "Map pe wapas",
  },
};
