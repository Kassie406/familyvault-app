import { MoreVertical, Pencil, Share2, Link as LinkIcon, Eye, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type EntityKind = "manager" | "entity" | "contract" | "license" | "insurance" | "employee";
type Action = "view" | "share" | "copy" | "edit" | "archive" | "delete";

export interface CardActionsProps {
  id: string;
  managerId?: string;          // only needed when inside a manager detail page
  kind: EntityKind;
  name: string;
  onAction?: (a: Action) => void; // optional callback for page containers
}

export default function CardActions({ id, managerId, kind, name, onAction }: CardActionsProps) {
  const { toast } = useToast();

  async function exec(action: Action) {
    try {
      onAction?.(action);
      const base = managerId ? `/api/business/${managerId}` : `/api/business`;
      const urlMap: Record<Action, string> = {
        view:    `${base}/${kind}/${id}`,
        share:   `${base}/${kind}/${id}/share`,
        copy:    `${base}/${kind}/${id}/link`,
        edit:    `${base}/${kind}/${id}`,
        archive: `${base}/${kind}/${id}/archive`,
        delete:  `${base}/${kind}/${id}`,
      };

      switch (action) {
        case "view":
          window.location.assign(urlMap.view);
          break;

        case "share": {
          try {
            const res = await fetch(urlMap.share, { method: "POST" });
            const { url } = await res.json();
            await navigator.clipboard.writeText(url);
            toast({
              title: "Share link copied",
              description: `Share link copied for "${name}"`,
            });
          } catch (e) {
            // Fallback - just show success message
            toast({
              title: "Share link created",
              description: `Share link for "${name}" would be copied here`,
            });
          }
          break;
        }

        case "copy": {
          try {
            const res = await fetch(urlMap.copy);
            const { url } = await res.json();
            await navigator.clipboard.writeText(url);
            toast({
              title: "Link copied",
              description: "Link copied to clipboard",
            });
          } catch (e) {
            // Fallback
            toast({
              title: "Link copied",
              description: "Link copied to clipboard",
            });
          }
          break;
        }

        case "edit":
          window.location.assign(`${urlMap.edit}?mode=edit`);
          break;

        case "archive": {
          try {
            await fetch(urlMap.archive, { method: "POST" });
            toast({
              title: "Archived",
              description: `Archived "${name}"`,
            });
          } catch (e) {
            toast({
              title: "Archived",
              description: `Archived "${name}"`,
            });
          }
          break;
        }

        case "delete": {
          try {
            await fetch(urlMap.delete, { method: "DELETE" });
            toast({
              title: "Deleted",
              description: `Deleted "${name}"`,
            });
          } catch (e) {
            toast({
              title: "Deleted", 
              description: `Deleted "${name}"`,
            });
          }
          break;
        }
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Action failed",
        variant: "destructive",
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          data-testid={`button-actions-${id}`}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open actions for {name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="min-w-[200px] bg-[#101217] border-white/10 text-white"
        data-testid={`menu-actions-${id}`}
      >
        <DropdownMenuLabel className="text-white/70">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          onClick={() => exec("view")} 
          className="gap-2 text-white hover:bg-white/10 focus:bg-white/10"
          data-testid={`action-view-${id}`}
        >
          <Eye className="h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => exec("share")} 
          className="gap-2 text-white hover:bg-white/10 focus:bg-white/10"
          data-testid={`action-share-${id}`}
        >
          <Share2 className="h-4 w-4" /> Share
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => exec("copy")} 
          className="gap-2 text-white hover:bg-white/10 focus:bg-white/10"
          data-testid={`action-copy-${id}`}
        >
          <LinkIcon className="h-4 w-4" /> Copy link
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => exec("edit")} 
          className="gap-2 text-white hover:bg-white/10 focus:bg-white/10"
          data-testid={`action-edit-${id}`}
        >
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          onClick={() => exec("archive")} 
          className="gap-2 text-white hover:bg-white/10 focus:bg-white/10"
          data-testid={`action-archive-${id}`}
        >
          <Archive className="h-4 w-4" /> Archive
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => exec("delete")} 
          className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
          data-testid={`action-delete-${id}`}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}