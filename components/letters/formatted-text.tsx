const BOLD_PATTERN = /\*\*(.+?)\*\*/g;

/** Renders `**bold**` markup within sample letter body text as <strong>. */
export function FormattedText({ text }: { text: string }) {
  const parts = text.split(BOLD_PATTERN);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))}
    </>
  );
}
