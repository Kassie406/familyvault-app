import { useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function ResourceDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="px-6 py-6">
        <header className="mb-4 flex items-center gap-3">
          <button 
            onClick={() => setLocation("/family/resources")} 
            className="flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition-colors"
            data-testid="button-back-to-resources"
          >
            <ArrowLeft className="size-4" />
            Family Resources
          </button>
          <span className="text-white/40">/</span>
          <h1 className="text-2xl font-semibold text-white" data-testid="text-resource-title">Resource</h1>
          <div className="ml-auto flex gap-2">
            <button 
              className="rounded-lg bg-white/6 px-3 py-1.5 text-sm hover:bg-white/10 text-white transition-colors"
              data-testid="button-edit-resource"
            >
              Edit
            </button>
            <button 
              className="rounded-lg bg-white/6 px-3 py-1.5 text-sm hover:bg-white/10 text-white transition-colors"
              data-testid="button-share-resource"
            >
              Share
            </button>
            <button 
              className="rounded-lg bg-white/6 px-3 py-1.5 text-sm hover:bg-white/10 text-white transition-colors"
              data-testid="button-export-resource"
            >
              Export
            </button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="md:col-span-2 rounded-2xl border border-white/6 bg-white/[0.03] p-4">
            <h2 className="mb-2 font-medium text-white" data-testid="text-preview-section">Preview</h2>
            <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-sm text-white/80" data-testid="content-preview">
              This is where the resource content or file preview would appear (id: {id}).
            </div>
          </section>
          <aside className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
            <h2 className="mb-2 font-medium text-white" data-testid="text-details-section">Details</h2>
            <ul className="space-y-2 text-sm text-white/70" data-testid="list-resource-details">
              <li>Type: Document</li>
              <li>Created: 2024-01-15</li>
              <li>Updated: 2024-02-01</li>
              <li>Owner: Family</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}