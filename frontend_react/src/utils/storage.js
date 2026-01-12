const STORAGE_KEY = "kavia_notes_v1";

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {number} updatedAt Epoch ms
 */

// PUBLIC_INTERFACE
export function createSampleNotes() {
  /** Create a few starter notes for first launch. */
  const now = Date.now();
  return [
    {
      id: cryptoId(),
      title: "Welcome to Notes",
      body:
        "This is a simple notes app.\n\n- Add notes with the + button\n- Search by title or content\n- Edit and delete with the actions on each note\n\nMarkdown-friendly text is supported (stored as plain text).",
      updatedAt: now - 1000 * 60 * 60,
    },
    {
      id: cryptoId(),
      title: "Meeting checklist",
      body:
        "- Agenda\n- Action items\n- Next steps\n\nTip: Keep notes short and searchable.",
      updatedAt: now - 1000 * 60 * 20,
    },
    {
      id: cryptoId(),
      title: "Quick ideas",
      body:
        "1. Build something small\n2. Iterate\n3. Ship\n\nSearch works across both title and body.",
      updatedAt: now - 1000 * 60 * 5,
    },
  ];
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function cryptoId() {
  // Prefer crypto.randomUUID when available.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for older browsers.
  return `note_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Load notes from localStorage; returns [] if empty or corrupt. */
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  const notes = ensureArray(parsed);
  return notes
    .filter((n) => n && typeof n === "object")
    .map((n) => ({
      id: String(n.id ?? cryptoId()),
      title: String(n.title ?? ""),
      body: String(n.body ?? ""),
      updatedAt: Number(n.updatedAt ?? Date.now()),
    }));
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Persist notes to localStorage. */
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ensureArray(notes)));
}

// PUBLIC_INTERFACE
export function seedNotesIfEmpty() {
  /** Seed localStorage with sample notes on first load (only if empty). */
  const existing = loadNotes();
  if (existing.length > 0) return existing;
  const seeded = createSampleNotes();
  saveNotes(seeded);
  return seeded;
}
