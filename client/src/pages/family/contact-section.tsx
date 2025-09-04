import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface ContactSectionPageProps {
  title: string;
  createTo?: string;
}

export default function ContactSectionPage({ title, createTo }: ContactSectionPageProps) {
  const [, setLocation] = useLocation();
  
  // Mock data - fetch contacts for this section from API
  const data: { id: string; name: string; phone?: string; email?: string; role?: string }[] = [
    // Example data for family section only
    ...(title === "Family Members" ? [{
      id: '1',
      name: 'Rafael Frias',
      phone: '',
      email: 'rfrias972@gmail.com',
      role: 'Family Member',
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 -mx-6 border-b border-white/8 bg-black/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/family/contacts')}
              className="text-white/70 hover:text-[#D4AF37] p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-[28px] font-semibold tracking-tight text-white">{title}</h1>
            <div className="grow" />
            {createTo && (
              <Button 
                onClick={() => setLocation(createTo)}
                variant="gold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {data.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
            <div className="text-lg font-medium text-white">No contacts yet</div>
            <div className="mt-1 text-sm text-white/60">Add your first contact to get started.</div>
            {createTo && (
              <Button 
                onClick={() => setLocation(createTo)}
                variant="gold"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {data.map((contact) => (
              <article 
                key={contact.id} 
                className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 hover:border-white/12 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                      <span className="text-[#D4AF37] text-sm font-medium">
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-white">{contact.name}</div>
                      <div className="text-xs text-white/60">
                        {contact.email && contact.phone ? `${contact.email} • ${contact.phone}` : 
                         contact.email || contact.phone || contact.role}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-[#D4AF37]">
                    •••
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}