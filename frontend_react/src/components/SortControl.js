import React from "react";

// PUBLIC_INTERFACE
export default function SortControl({ value, onChange }) {
  /** Control for sorting notes list by updated date. */
  return (
    <div className="sortControl">
      <label className="label" htmlFor="sortNotes">
        Sort
      </label>
      <select
        id="sortNotes"
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="updated_desc">Recently updated</option>
        <option value="updated_asc">Least recently updated</option>
      </select>
    </div>
  );
}
