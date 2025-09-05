export function TypingBar({ names }: { names: string[] }) {
  if (names.length === 0) return null;

  const label =
    names.length === 1 ? `${names[0]} is typing…` :
    names.length === 2 ? `${names[0]} and ${names[1]} are typing…` :
    `${names[0]}, ${names[1]} and others are typing…`;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-xs border-t border-white/10 bg-black/40">
      <span className="inline-block h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
      <span className="text-white/70">{label}</span>
    </div>
  );
}