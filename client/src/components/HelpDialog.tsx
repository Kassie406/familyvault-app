import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Camera, CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function HelpDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#D4AF37]" />
            Help AI read your documents better
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Follow these tips to get the best results from document analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-zinc-200">Use PDFs or JPEG/PNG photos taken straight-on</div>
              <div className="text-sm text-zinc-400 mt-1">PDFs give the best text extraction results</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-zinc-200">Avoid glare, low light, and backgrounds</div>
              <div className="text-sm text-zinc-400 mt-1">Good lighting helps text recognition</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-zinc-200">Fill the frame with the document</div>
              <div className="text-sm text-zinc-400 mt-1">Crop out unnecessary background elements</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-zinc-200">For IDs: front/back, make text sharp</div>
              <div className="text-sm text-zinc-400 mt-1">Clear, high-contrast text works best</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-zinc-700">
          <div className="text-sm text-zinc-400">
            Still not working?{" "}
            <button 
              className="text-[#D4AF37] hover:text-[#D4AF37]/80 underline"
              onClick={() => {
                // TODO: Open feedback form
                console.log("Send feedback clicked");
              }}
            >
              Send feedback
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}