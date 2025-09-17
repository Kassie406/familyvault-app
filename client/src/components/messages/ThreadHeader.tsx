import { formatDistanceToNow } from "date-fns";

function Dot({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        online ? "bg-emerald-400 shadow-[0_0_0_2px_rgba(212,175,55,.35)]" : "bg-gray-400"
      }`}
    />
  );
}

export function ThreadHeader({ 
  members, 
  online, 
  lastSeen,
  title
}: {
  members: { id: string; name: string }[];
  online: Set<string>;
  lastSeen: Record<string, string | null>;
  title?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-black/20">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-white">{title || "Family Chat"}</h2>
        <div className="flex items-center gap-2">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-1.5" title={
              online.has(m.id) 
                ? "Online now" 
                : lastSeen[m.id] 
                  ? `Last seen ${formatDistanceToNow(new Date(lastSeen[m.id]!))} ago`
                  : "Never seen"
            }>
              <Dot online={online.has(m.id)} />
              <span className="text-sm text-white/80">{m.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}