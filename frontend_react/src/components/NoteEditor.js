import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * @typedef {Object} NoteDraft
 * @property {string} title
 * @property {string} body
 */

// PUBLIC_INTERFACE
export default function NoteEditor({
  isOpen,
  mode,
  initialNote,
  onCancel,
  onSave,
}) {
  /**
   * Accessible modal editor for adding/editing notes.
   *
   * Focus management:
   * - When opened: focus title input
   * - Trap focus within modal
   * - Escape closes
   */
  const titleInputRef = useRef(null);
  const dialogRef = useRef(null);
  const previouslyFocusedEl = useRef(null);

  const initialDraft = useMemo(
    () => ({
      title: initialNote?.title ?? "",
      body: initialNote?.body ?? "",
    }),
    [initialNote]
  );

  const [draft, setDraft] = useState(initialDraft);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedEl.current = document.activeElement;
      setDraft(initialDraft);
      setTouched(false);

      // Focus after paint
      setTimeout(() => titleInputRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (previouslyFocusedEl.current && previouslyFocusedEl.current.focus) {
        previouslyFocusedEl.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialDraft]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key === "Tab") {
        // Simple focus trap
        const container = dialogRef.current;
        if (!container) return;

        const focusables = container.querySelectorAll(
          'button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter(
          (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
        );
        if (!list.length) return;

        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const titleError = touched && !draft.title.trim();

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    const title = draft.title.trim();
    if (!title) return;

    /** @type {NoteDraft} */
    const payload = {
      title,
      body: draft.body ?? "",
    };
    onSave(payload);
  };

  return (
    <div className="modalOverlay" role="presentation" onMouseDown={(e) => {
      // Click outside closes
      if (e.target === e.currentTarget) onCancel();
    }}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="noteEditorTitle"
        ref={dialogRef}
      >
        <header className="modalHeader">
          <h2 id="noteEditorTitle" className="modalTitle">
            {mode === "edit" ? "Edit note" : "New note"}
          </h2>
          <button type="button" className="iconBtn" onClick={onCancel} aria-label="Close editor">
            ×
          </button>
        </header>

        <form className="modalBody" onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor="noteTitle">
              Title <span className="req">*</span>
            </label>
            <input
              id="noteTitle"
              ref={titleInputRef}
              className={`input ${titleError ? "inputError" : ""}`}
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              onBlur={() => setTouched(true)}
              required
            />
            {titleError && (
              <div className="fieldError" role="alert">
                Title is required.
              </div>
            )}
          </div>

          <div className="field">
            <label className="label" htmlFor="noteBody">
              Body
            </label>
            <textarea
              id="noteBody"
              className="textarea"
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              placeholder="Write your note…"
              rows={10}
            />
            <div className="helpText">Markdown-friendly plain text.</div>
          </div>

          <footer className="modalFooter">
            <button type="button" className="btn btnSecondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btnPrimary">
              {mode === "edit" ? "Save changes" : "Add note"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
