export function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} von ${max} Sternen`}>
      {Array.from({ length: max }, (_, idx) => (
        <span key={idx}>{idx < full ? '★' : '☆'}</span>
      ))}
    </span>
  );
}
