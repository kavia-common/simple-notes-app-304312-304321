const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// PUBLIC_INTERFACE
export function formatUpdatedAt(epochMs) {
  /** Format an epoch timestamp into a short, readable label. */
  const d = new Date(epochMs);
  const now = new Date();

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const sameYear = d.getFullYear() === now.getFullYear();
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTHS[d.getMonth()];
  return sameYear ? `${month} ${day}` : `${month} ${day}, ${d.getFullYear()}`;
}

// PUBLIC_INTERFACE
export function snippet(text, maxLen = 140) {
  /** Create a one-line snippet for list previews. */
  const normalized = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 1)}…`;
}
