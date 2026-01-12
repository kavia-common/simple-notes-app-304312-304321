import React from "react";

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange }) {
  /** Search input for filtering notes by title/body. */
  return (
    <div className="searchBar">
      <label className="srOnly" htmlFor="noteSearch">
        Search notes
      </label>
      <div className="inputWithIcon">
        <span className="inputIcon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="noteSearch"
          className="input"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search notes…"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
