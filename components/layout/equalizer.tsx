export function Equalizer({ height, color, bars = 5 }: { height: number; color: string; bars?: number }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-[1px]"
          style={{
            height: "100%",
            background: color,
            transformOrigin: "bottom",
            animation: `eq ${0.9 + (i % 3) * 0.22}s ease-in-out ${-i * 0.17}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
