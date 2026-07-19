/** Case-insensitive substring match against one or more text fields. Empty query matches everything. */
export function matchesQuery(query: string, ...fields: (string | string[] | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => {
    if (!field) return false;
    const text = Array.isArray(field) ? field.join(" ") : field;
    return text.toLowerCase().includes(q);
  });
}
