import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import SearchBar from "./components/SearchBar";
import SortControl from "./components/SortControl";
import { loadNotes, saveNotes, seedNotesIfEmpty } from "./utils/storage";

function compareUpdatedAtDesc(a, b) {
  return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
}

function compareUpdatedAtAsc(a, b) {
  return (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
}

function includesCI(haystack, needle) {
  return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
}

// PUBLIC_INTERFACE
function App() {
  /** Notes app entry component (single page; localStorage persistence). */
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated_desc");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState("add"); // "add" | "edit"
  const [activeNoteId, setActiveNoteId] = useState(null);

  const fabRef = useRef(null);

  // Initial load/seed
  useEffect(() => {
    const seeded = seedNotesIfEmpty();
    // Normalize sort initial view
    setNotes([...seeded].sort(compareUpdatedAtDesc));
  }, []);

  // Persist on change
  useEffect(() => {
    if (!notes) return;
    saveNotes(notes);
  }, [notes]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) ?? null,
    [notes, activeNoteId]
  );

  const visibleNotes = useMemo(() => {
    const q = query.trim();
    const filtered = !q
      ? notes
      : notes.filter(
          (n) => includesCI(n.title, q) || includesCI(n.body, q)
        );

    const sorted = [...filtered].sort(
      sort === "updated_asc" ? compareUpdatedAtAsc : compareUpdatedAtDesc
    );

    return sorted;
  }, [notes, query, sort]);

  const openAdd = () => {
    setEditorMode("add");
    setActiveNoteId(null);
    setEditorOpen(true);
  };

  const openEdit = (note) => {
    setEditorMode("edit");
    setActiveNoteId(note.id);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    // Return focus to FAB for convenience (NoteEditor also restores focus; this is a safe fallback)
    setTimeout(() => fabRef.current?.focus(), 0);
  };

  const saveDraft = (draft) => {
    const now = Date.now();

    if (editorMode === "edit" && activeNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNote.id
            ? { ...n, title: draft.title, body: draft.body, updatedAt: now }
            : n
        )
      );
    } else {
      const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `note_${now}_${Math.random().toString(16).slice(2)}`;

      const newNote = {
        id,
        title: draft.title,
        body: draft.body,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    closeEditor();
  };

  const deleteNote = (note) => {
    const ok = window.confirm(`Delete "${note.title}"? This cannot be undone.`);
    if (!ok) return;
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
  };

  return (
    <div className="App">
      <div className="appShell">
        <header className="topBar">
          <div className="topBarTitle">
            <h1 className="appTitle">Notes</h1>
            <p className="appSubtitle">Simple, fast, and stored on this device.</p>
          </div>

          <div className="topBarControls" role="region" aria-label="Search and sort controls">
            <SearchBar value={query} onChange={setQuery} />
            <SortControl value={sort} onChange={setSort} />
          </div>
        </header>

        <main className="content" aria-label="Notes content">
          <NotesList notes={visibleNotes} onEdit={openEdit} onDelete={deleteNote} />
        </main>

        <button
          ref={fabRef}
          type="button"
          className="fab"
          onClick={openAdd}
          aria-label="Add a new note"
          title="Add note"
        >
          +
        </button>

        <NoteEditor
          isOpen={editorOpen}
          mode={editorMode}
          initialNote={editorMode === "edit" ? activeNote : null}
          onCancel={closeEditor}
          onSave={saveDraft}
        />
      </div>
    </div>
  );
}

export default App;
