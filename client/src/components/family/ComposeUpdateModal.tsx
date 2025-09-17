import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface ComposeUpdateModalProps {
  trigger?: React.ReactNode;
  afterCreate?: () => void;
}

export default function ComposeUpdateModal({ trigger, afterCreate }: ComposeUpdateModalProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [type, setType] = useState("custom");
  const [severity, setSeverity] = useState<"info" | "warning" | "urgent">("info");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueAt, setDueAt] = useState<string | undefined>(undefined);
  const [actionUrl, setActionUrl] = useState("");
  const { toast } = useToast();

  const submit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/updates", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          type, 
          title: title.trim(), 
          body: body.trim() || undefined, 
          severity, 
          dueAt: dueAt || undefined, 
          actionUrl: actionUrl.trim() || undefined 
        })
      });

      setBusy(false);
      
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to post update",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Update posted successfully",
      });

      setOpen(false);
      setTitle("");
      setBody("");
      setActionUrl("");
      setDueAt(undefined);
      setSeverity("info");
      setType("custom");
      afterCreate?.();
    } catch (error) {
      setBusy(false);
      toast({
        title: "Error",
        description: "Failed to post update",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button 
            variant="outline"
            className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-200"
            data-testid="compose-update-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose Update
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#D4AF37] flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Compose Family Update
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white/70">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="insurance_renewal">Insurance Renewal</SelectItem>
                  <SelectItem value="security_reminder">Security Reminder</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="document_expiry">Document Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white/70">Severity</Label>
              <Select value={severity} onValueChange={(value: "info" | "warning" | "urgent") => setSeverity(value)}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-white/70">Title *</Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Insurance renewal due"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/40"
              data-testid="update-title-input"
            />
          </div>
          
          <div>
            <Label className="text-white/70">Body (optional)</Label>
            <Textarea 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              placeholder="Click to review and renew."
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/40 min-h-[80px]"
              data-testid="update-body-input"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white/70">Due At (optional)</Label>
              <Input 
                type="datetime-local" 
                value={dueAt ?? ""} 
                onChange={(e) => setDueAt(e.target.value || undefined)} 
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="update-due-input"
              />
            </div>
            
            <div>
              <Label className="text-white/70">Action URL (optional)</Label>
              <Input 
                value={actionUrl} 
                onChange={(e) => setActionUrl(e.target.value)} 
                placeholder="/family/insurance"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/40"
                data-testid="update-action-url-input"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              disabled={busy} 
              onClick={submit} 
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-medium transition-all duration-200"
              data-testid="submit-update-button"
            >
              {busy ? "Posting..." : "Post Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}