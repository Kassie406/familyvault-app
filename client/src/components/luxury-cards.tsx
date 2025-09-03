import React from "react";
import { Users, FileText, MessageCircle, Upload, ImageIcon, ShieldAlert } from "lucide-react";

const GOLD = "#D4AF37";

/** LuxuryCard — Base card with dark gradient, soft border, gold glow on hover */
export function LuxuryCard({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-[#2A2A33]
        bg-gradient-to-br from-[#161616] to-[#0F0F0F]
        shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/10
        transition-all duration-300 hover:border-[#D4AF37]/30
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/** StatCard — big number + label + icon (for Members, Docs, etc.) */
export function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <LuxuryCard className="p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg" style={{ background: `${GOLD}15` }}>
          <div className="text-[#D4AF37]">
            {icon}
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-neutral-300">{label}</div>
        </div>
      </div>
    </LuxuryCard>
  );
}

/** ActionCard — pill-style quick actions with gold icon circle */
export function ActionCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <LuxuryCard className="p-6 cursor-pointer group hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all group-hover:shadow-lg"
          style={{ background: GOLD }}
        >
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
      </div>
      <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-neutral-300">{subtitle}</p>
    </LuxuryCard>
  );
}

/** ToolCard — section entry cards (Members, Vault, Emergency) */
export function ToolCard({ 
  icon, 
  title, 
  description, 
  cta 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  cta: string; 
}) {
  return (
    <LuxuryCard className="p-6 cursor-pointer group hover:scale-[1.02] transition-all">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md transition-all group-hover:shadow-lg group-hover:shadow-[#D4AF37]/20" style={{ background: GOLD }}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
        {description}
      </p>
      <span className="text-sm font-medium transition-colors" style={{ color: GOLD }}>
        {cta}
      </span>
    </LuxuryCard>
  );
}

/** AnnouncementCard — priority banner with subtle gold strip */
export function AnnouncementCard({ title, body, meta }: { title: string; body?: string; meta?: string }) {
  return (
    <LuxuryCard className="p-4 relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1 bg-[#D4AF37]" />
      <div className="ml-3">
        <div className="text-sm font-medium text-white flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: GOLD }} />
          {title}
        </div>
        {body && <div className="text-sm text-neutral-300 mt-1">{body}</div>}
        {meta && <div className="text-xs text-neutral-500 mt-1">{meta}</div>}
      </div>
    </LuxuryCard>
  );
}

/** ActivityTimeline — vertical line with dots */
export function ActivityTimeline({ items }: { items: { icon?: React.ReactNode; title: string; meta: string; tone?: "ok" | "info" | "warn" }[] }) {
  return (
    <LuxuryCard className="p-5">
      <div className="relative">
        <div className="absolute left-[14px] top-0 bottom-0 w-px bg-[#2A2A33]" />
        <ul className="space-y-4">
          {items.map((it, i) => (
            <li key={i} className="relative pl-10">
              <span className="absolute left-[8px] top-1 h-3 w-3 rounded-full border border-[#2A2A33]"
                style={{ background: it.tone === "ok" ? "#2ECC71" : it.tone === "warn" ? "#E7B84C" : "#2D7CF0" }} />
              <div className="text-sm text-white">{it.title}</div>
              <div className="text-xs text-neutral-400">{it.meta}</div>
            </li>
          ))}
        </ul>
      </div>
    </LuxuryCard>
  );
}

/** ---------------------- USAGE EXAMPLE (Dashboard) ---------------------- */
export function DashboardPreview() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5"/>} value={5} label="Family Members" />
        <StatCard icon={<FileText className="h-5 w-5"/>} value={23} label="Documents Shared" />
        <StatCard icon={<MessageCircle className="h-5 w-5"/>} value={12} label="Messages Today" />
        <StatCard icon={<ImageIcon className="h-5 w-5"/>} value={156} label="Photos Uploaded" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ActionCard icon={<Upload className="h-5 w-5"/>} title="Upload Document" subtitle="Add new family document" />
        <ActionCard icon={<MessageCircle className="h-5 w-5"/>} title="Send Message" subtitle="Chat with family" />
        <ActionCard icon={<ImageIcon className="h-5 w-5"/>} title="View Photos" subtitle="Browse family gallery" />
        <ActionCard icon={<ShieldAlert className="h-5 w-5"/>} title="Emergency Info" subtitle="Quick access to critical info" />
      </div>

      {/* Activity + Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityTimeline
          items={[
            { title: "Medical Records Updated", meta: "Sarah updated emergency contact info · 2 hours ago", tone: "info" },
            { title: "New Family Message", meta: "Dad shared vacation photos · 4 hours ago", tone: "ok" },
            { title: "Upcoming Event", meta: "Family dinner Sunday 6 PM · 1 day ago", tone: "info" },
            { title: "Safety Check Complete", meta: "All family confirmed safe · 2 days ago", tone: "ok" },
          ]}
        />
        <div className="space-y-3">
          <AnnouncementCard title="Family Vacation Planning" body="Submit preferred dates for the summer trip by Friday" meta="Posted by Mom · 3 days ago" />
          <AnnouncementCard title="Updated Family Calendar" body="New events: Sarah's graduation, reunion in July" meta="Posted by Dad · 1 week ago" />
        </div>
      </div>

      {/* Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ToolCard icon={<Users className="h-6 w-6"/>} title="Family Members" description="Manage profiles, contacts, and emergency details." cta="Manage profiles →" />
        <ToolCard icon={<FileText className="h-6 w-6"/>} title="Document Vault" description="Securely store and share IDs, medical, legal papers." cta="View documents →" />
        <ToolCard icon={<ShieldAlert className="h-6 w-6"/>} title="Emergency Center" description="Quick access to emergency info and safety plans." cta="Access emergency info →" />
      </div>
    </div>
  );
}