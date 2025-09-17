import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, UserPlus, Users, Shield, Clock, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  permission: z.enum(["view", "edit", "admin"], {
    required_error: "Please select a permission level",
  }),
  familyRole: z.enum(["owner", "parent", "child", "grandparent", "member", "other"], {
    required_error: "Please select a family role",
  }),
  message: z.string().optional(),
  expiresInDays: z.number().min(1).max(30).default(7),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteFamilyMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteFamilyMemberDialog({
  open,
  onOpenChange,
}: InviteFamilyMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      permission: "view",
      familyRole: "member",
      message: "",
      expiresInDays: 7,
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      return await apiRequest("POST", "/api/family/invites", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/family/invites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/family/members"] });
      
      toast({
        title: "Invitation sent!",
        description: `Family invitation sent to ${form.getValues("email")}`,
        className: "bg-green-900/80 border-green-700 text-green-100",
      });
      
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send invitation",
        description: error.message || "An error occurred while sending the invitation",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: InviteFormData) => {
    setIsSubmitting(true);
    createInviteMutation.mutate(data);
  };

  const permissionOptions = [
    {
      value: "view" as const,
      label: "View Only",
      description: "Can view family information but not make changes",
      icon: "👁️",
    },
    {
      value: "edit" as const,
      label: "Edit Access",
      description: "Can view and edit family information",
      icon: "✏️",
    },
    {
      value: "admin" as const,
      label: "Full Admin",
      description: "Complete access including inviting other members",
      icon: "👑",
    },
  ];

  const roleOptions = [
    {
      value: "owner" as const,
      label: "Owner",
      description: "Primary family account owner",
      icon: "👑",
    },
    {
      value: "parent" as const,
      label: "Parent",
      description: "Mother or father",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      value: "child" as const,
      label: "Child",
      description: "Son or daughter",
      icon: "👶",
    },
    {
      value: "grandparent" as const,
      label: "Grandparent",
      description: "Grandmother or grandfather",
      icon: "👴",
    },
    {
      value: "member" as const,
      label: "Family Member",
      description: "Extended family member",
      icon: "👥",
    },
    {
      value: "other" as const,
      label: "Other",
      description: "Family friend or other relationship",
      icon: "🤝",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F0F0F] border-[#2A2B2E] text-white"
        data-testid="dialog-invite-family-member"
      >
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20">
              <UserPlus className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-white">
                Invite Family Member
              </DialogTitle>
              <DialogDescription className="text-white/70 mt-1">
                Send an invitation to join your family vault with secure access
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#D4AF37]" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="family@example.com"
                      className="bg-[#1A1B1E] border-[#2A2B2E] text-white placeholder:text-white/50 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20"
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Permission Level */}
            <FormField
              control={form.control}
              name="permission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#D4AF37]" />
                    Permission Level
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      data-testid="select-permission"
                    >
                      <SelectTrigger className="bg-[#1A1B1E] border-[#2A2B2E] text-white focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20">
                        <SelectValue placeholder="Select permission level" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1B1E] border-[#2A2B2E]">
                        {permissionOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-white hover:bg-[#2A2B2E] focus:bg-[#2A2B2E]"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{option.icon}</span>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-white/60">{option.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Family Role */}
            <FormField
              control={form.control}
              name="familyRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#D4AF37]" />
                    Family Role
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      data-testid="select-family-role"
                    >
                      <SelectTrigger className="bg-[#1A1B1E] border-[#2A2B2E] text-white focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20">
                        <SelectValue placeholder="Select family role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1B1E] border-[#2A2B2E]">
                        {roleOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-white hover:bg-[#2A2B2E] focus:bg-[#2A2B2E]"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{option.icon}</span>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-white/60">{option.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Expiration */}
            <FormField
              control={form.control}
              name="expiresInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#D4AF37]" />
                    Invitation Expires In (Days)
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      data-testid="select-expiration"
                    >
                      <SelectTrigger className="bg-[#1A1B1E] border-[#2A2B2E] text-white focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1B1E] border-[#2A2B2E]">
                        <SelectItem value="1" className="text-white hover:bg-[#2A2B2E]">1 day</SelectItem>
                        <SelectItem value="3" className="text-white hover:bg-[#2A2B2E]">3 days</SelectItem>
                        <SelectItem value="7" className="text-white hover:bg-[#2A2B2E]">1 week</SelectItem>
                        <SelectItem value="14" className="text-white hover:bg-[#2A2B2E]">2 weeks</SelectItem>
                        <SelectItem value="30" className="text-white hover:bg-[#2A2B2E]">1 month</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">
                    Personal Message (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add a personal note to your invitation..."
                      className="bg-[#1A1B1E] border-[#2A2B2E] text-white placeholder:text-white/50 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 resize-none"
                      rows={3}
                      data-testid="textarea-message"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#D4AF37]/20"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="border-[#2A2B2E] text-white/70 hover:text-white hover:bg-[#1A1B1E]"
                data-testid="button-cancel"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>

        {/* Info Section */}
        <div className="mt-6 rounded-lg border border-[#2A2B2E] bg-[#1A1B1E]/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
              <Mail className="h-3 w-3 text-blue-400" />
            </div>
            <div className="flex-1 text-sm">
              <p className="text-white/90 font-medium">How it works:</p>
              <ul className="mt-2 space-y-1 text-white/60">
                <li>• Your family member will receive an email invitation</li>
                <li>• They can accept by clicking the secure link</li>
                <li>• Once accepted, they'll appear as a Person card in Family IDs</li>
                <li>• Access permissions can be updated anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}