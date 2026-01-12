import React from "react";
import NoteItem from "./NoteItem";

// PUBLIC_INTERFACE
export default function NotesList({ notes, onEdit, onDelete }) {
  /** List container for notes, including empty-state messaging. */
  if (!notes.length) {
    return (
      <div className="emptyState" role="status" aria-live="polite">
        <h2 className="emptyTitle">No notes found</h2>
        <p className="emptyText">Try adjusting your search, or add a new note.</p>
      </div>
    );
  }

  return (
    <div className="notesList" role="list" aria-label="Notes list">
      {notes.map((n) => (
        <div key={n.id} role="listitem">
          <NoteItem note={n} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
