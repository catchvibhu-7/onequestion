const episodes = [
  {
    id: "ep0",
    title: "Pilot — Orientation Day.",
    subtitle: "The day everything quietly began.",
    locked: false,
    file: "ep0.md",
    book: "Book 1"
  },
  {
    id: "ep1",
    title: "Episode 1 — The Incident.",
    subtitle: "A towel. A dare. A disaster.",
    locked: false,
    file: "ep1.md",
    book: "Book 1"
  },
  {
    id: "ep2",
    title: "Episode 2 — The Holy Grail.",
    subtitle: "Anime, trust, and One Piece.",
    locked: false,
    file: "ep2.md",
    book: "Book 1"
  },
  {
    id: "ep3",
    title: "Episode 3 — The Photo That Shouldn't Exist.",
    subtitle: "The picture that should not exist.",
    locked: false,
    file: "ep3.md",
    book: "Book 1"
  },
  {
    id: "ep4",
    title: "Episode 4 — The Overconfidence Arc.",
    subtitle: "Alcohol met vocabulary.",
    locked: false,
    file: "ep4.md",
    book: "Book 1"
  },
  {
    id: "ep5",
    title: "Episode 5 — End of Year One & the Art of Breaking Things.",
    subtitle: "Endings disguised as starts.",
    locked: false,
    file: "ep5.md",
    book: "Book 1"
  },
  {
    id: "ep6",
    title: "Episode 6 — The “I’m Totally Over This” Arc (I Was Not).",
    subtitle: "Or pretending to.",
    locked: false,
    file: "ep6.md",
    book: "Book 1"
  },
  {
    id: "ep7",
    title: "Episode 7 — The Great Reset.",
    subtitle: "A hug fixes things.",
    locked: false,
    file: "ep7.md",
    book: "Book 1"
  },
  {
    id: "ep8",
    title: "Episode 8 — Final Year & When the World Paused.",
    subtitle: "Covid and distance.",
    locked: false,
    file: "ep8.md",
    book: "Book 1"
  },
  {
    id: "ep9",
    title: "Episode 9 — Pune, Potatoes, and Poor Decisions.",
    subtitle: "Life carries on.",
    locked: false,
    file: "ep9.md",
    book: "Book 1"
  },
  {
    id: "ep10",
    title: "Episode 10 — The Meeting That Didn’t Happen.",
    subtitle: "Plans vs reality.",
    locked: false,
    file: "ep10.md",
    book: "Book 1"
  },
  {
    id: "ep11",
    title: "Episode 11 — A Call from Far Away.",
    subtitle: "The reason revealed.",
    locked: false,
    file: "ep11.md",
    book: "Book 1"
  },
  {
    id: "ep12",
    title: "Episode 12 — When Episodes Get Shorter.",
    subtitle: "If she is happy I am happy.",
    locked: false,
    file: "ep11.md",
    book: "Book 1"
  },
  {
    id: "finale",
    title: "Finale — The Report Card",
    subtitle: "Somethings should not be summarised.",
    locked: true,
    file: "finale.md",
    unlock: "ep12",
    book: "Book 1"
  }
];
const postCredit = {
  id: "post-credit",
  title: "After the Credits",
  subtitle: "For those who stayed.",
  file: "post-credit.md",
  unlockFrom: "finale"
};
