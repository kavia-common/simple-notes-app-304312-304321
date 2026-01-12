import React from "react";
import { formatUpdatedAt, snippet } from "../utils/format";

// PUBLIC_INTERFACE
export default function NoteItem({ note, onEdit, onDelete }) {
  /** Single note row/card in the list. */
  return (
    <article className="noteCard" aria-label={`Note: ${note.title}`}>
      <div className="noteCardMain">
        <div className="noteCardHeader">
          <h3 className="noteTitle">{note.title}</h3>
          <span className="noteUpdatedAt" title={new Date(note.updatedAt).toLocaleString()}>
            {formatUpdatedAt(note.updatedAt)}
          </span>
        </div>
        <p className="noteSnippet">{snippet(note.body, 160) || <span className="muted">No content</span>}</p>
      </div>

      <div className="noteCardActions">
        <button
          type="button"
          className="btn btnSecondary"
          onClick={() => onEdit(note)}
          aria-label={`Edit note titled ${note.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btnDanger"
          onClick={() => onDelete(note)}
          aria-label={`Delete note titled ${note.title}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
