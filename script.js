const STORAGE_KEY = "moodTracker.week.v1";

const MOODS = {
  happy: { label: "Happy", emoji: "😊", colorVar: "--happy" },
  neutral: { label: "Neutral", emoji: "😐", colorVar: "--neutral" },
  sad: { label: "Sad", emoji: "😢", colorVar: "--sad" },
  angry: { label: "Angry", emoji: "😡", colorVar: "--angry" },
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toISODateLocal(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d, delta) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + delta);
  return copy;
}

function formatDayName(d) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(d);
}

function formatMonthDay(d) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(d);
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e) => e && typeof e.date === "string" && typeof e.mood === "string");
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function pruneToLast7Days(entries) {
  const today = startOfDay(new Date());
  const cutoff = startOfDay(addDays(today, -6));
  const byDate = new Map();

  for (const e of entries) {
    if (!MOODS[e.mood]) continue;
    const d = startOfDay(new Date(`${e.date}T00:00:00`));
    if (Number.isNaN(d.getTime())) continue;
    if (d < cutoff || d > today) continue;
    byDate.set(toISODateLocal(d), { date: toISODateLocal(d), mood: e.mood });
  }

  const out = [];
  for (let i = 0; i < 7; i++) {
    const day = startOfDay(addDays(today, -i));
    const key = toISODateLocal(day);
    if (byDate.has(key)) out.push(byDate.get(key));
  }
  return out;
}

function setTodayMood(moodKey) {
  const todayKey = toISODateLocal(startOfDay(new Date()));
  const entries = pruneToLast7Days(loadEntries());

  const withoutToday = entries.filter((e) => e.date !== todayKey);
  withoutToday.push({ date: todayKey, mood: moodKey });

  const pruned = pruneToLast7Days(withoutToday);
  saveEntries(pruned);
  render();
}

function resetHistory() {
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function getTodayEntry(entries) {
  const todayKey = toISODateLocal(startOfDay(new Date()));
  return entries.find((e) => e.date === todayKey) || null;
}

function renderToday(entries) {
  const todayEl = document.getElementById("todayMood");
  const dateEl = document.getElementById("todayDate");

  const today = startOfDay(new Date());
  dateEl.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(today);

  const entry = getTodayEntry(entries);
  const emojiEl = todayEl.querySelector(".today-emoji");
  const labelEl = todayEl.querySelector(".today-label");

  todayEl.classList.remove("today-happy", "today-neutral", "today-sad", "today-angry", "today-none");

  if (!entry || !MOODS[entry.mood]) {
    todayEl.classList.add("today-none");
    emojiEl.textContent = "—";
    labelEl.textContent = "No mood selected yet";
    return;
  }

  const mood = MOODS[entry.mood];
  todayEl.classList.add(`today-${entry.mood}`);
  emojiEl.textContent = mood.emoji;
  labelEl.textContent = `${mood.label}`;
}

function renderHistory(entries) {
  const grid = document.getElementById("historyGrid");
  grid.innerHTML = "";

  const today = startOfDay(new Date());
  const entriesByDate = new Map(entries.map((e) => [e.date, e.mood]));

  for (let offset = 6; offset >= 0; offset--) {
    const d = startOfDay(addDays(today, -offset));
    const key = toISODateLocal(d);
    const moodKey = entriesByDate.get(key) || null;

    const card = document.createElement("div");
    card.className = "day-card";
    if (offset === 0) card.classList.add("today-highlight");
    if (moodKey && MOODS[moodKey]) card.classList.add(`mood-tag-${moodKey}`);

    const top = document.createElement("div");
    top.className = "day-top";

    const name = document.createElement("div");
    name.className = "day-name";
    name.textContent = offset === 0 ? "Today" : formatDayName(d);

    const date = document.createElement("div");
    date.className = "day-date";
    date.textContent = formatMonthDay(d);

    top.append(name, date);

    const moodRow = document.createElement("div");
    moodRow.className = "day-mood";

    const emoji = document.createElement("div");
    emoji.className = "day-emoji";
    emoji.setAttribute("aria-hidden", "true");

    const text = document.createElement("div");
    text.className = "day-text";

    if (!moodKey || !MOODS[moodKey]) {
      emoji.textContent = "—";
      text.textContent = "No entry";
      text.classList.add("day-empty");
    } else {
      emoji.textContent = MOODS[moodKey].emoji;
      text.textContent = MOODS[moodKey].label;
    }

    moodRow.append(emoji, text);
    card.append(top, moodRow);
    grid.appendChild(card);
  }
}

function render() {
  const entries = pruneToLast7Days(loadEntries());
  saveEntries(entries);
  renderToday(entries);
  renderHistory(entries);
}

function wireUI() {
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const moodKey = btn.dataset.mood;
      if (!moodKey || !MOODS[moodKey]) return;
      setTodayMood(moodKey);
    });
  });

  document.getElementById("resetBtn").addEventListener("click", resetHistory);
}

wireUI();
render();
