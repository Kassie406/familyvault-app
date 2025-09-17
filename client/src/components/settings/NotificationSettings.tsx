import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, Shield, MessageSquare, Bell, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SMSSettings {
  enabled: boolean;
  phone?: string;
  verified: boolean;
  messageNotifications: boolean;
  familyUpdates: boolean;
  securityAlerts: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export default function NotificationSettings() {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current SMS settings
  const { data: settings, isLoading } = useQuery<SMSSettings>({
    queryKey: ["/api/sms/settings"],
  });

  // Start phone verification
  const startVerificationMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      return await apiRequest("/api/phone/start-verify", "POST", { phone: phoneNumber });
    },
    onSuccess: () => {
      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Check your phone for the 6-digit code",
      });
    },
    onError: () => {
      toast({
        title: "Failed to send code",
        description: "Please try again or check your phone number",
        variant: "destructive",
      });
    },
  });

  // Confirm verification code
  const confirmVerificationMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("/api/phone/confirm", "POST", { code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sms/settings"] });
      setShowVerification(false);
      setVerificationCode("");
      toast({
        title: "Phone verified successfully",
        description: "SMS notifications are now enabled",
      });
    },
    onError: () => {
      toast({
        title: "Invalid code",
        description: "Please check the code and try again",
        variant: "destructive",
      });
    },
  });

  // Update SMS settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<SMSSettings>) => {
      return await apiRequest("/api/sms/settings", "POST", newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sms/settings"] });
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      startVerificationMutation.mutate(phone.trim());
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim()) {
      confirmVerificationMutation.mutate(verificationCode.trim());
    }
  };

  const updateSetting = (key: keyof SMSSettings, value: boolean | string) => {
    if (settings) {
      updateSettingsMutation.mutate({ ...settings, [key]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Notification Settings</h1>
        <p className="text-white/70">Manage your SMS and push notification preferences</p>
      </div>

      {/* Phone Verification Card */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Phone className="w-5 h-5 text-[#D4AF37]" />
            Phone Verification
            {settings?.verified && (
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                ✓ Verified
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-white/60">
            {settings?.verified 
              ? "Your phone number is verified and ready for SMS notifications"
              : "Verify your phone number to receive SMS notifications"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!settings?.verified ? (
            <>
              {!showVerification ? (
                <form onSubmit={handlePhoneSubmit} className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-phone-number"
                  />
                  <Button
                    type="submit"
                    disabled={startVerificationMutation.isPending}
                    className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black"
                    data-testid="button-send-code"
                  >
                    {startVerificationMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Code"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleCodeSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    maxLength={6}
                    data-testid="input-verification-code"
                  />
                  <Button
                    type="submit"
                    disabled={confirmVerificationMutation.isPending}
                    className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black"
                    data-testid="button-verify-code"
                  >
                    {confirmVerificationMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </form>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <Shield className="w-4 h-4" />
                <span>Phone: {settings.phone}</span>
              </div>
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                Verified
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Notification Settings */}
      {settings?.verified && (
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
              SMS Notifications
            </CardTitle>
            <CardDescription className="text-white/60">
              Choose which notifications to receive via SMS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Enable SMS Notifications</div>
                <div className="text-white/60 text-sm">Master switch for all SMS notifications</div>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSetting("enabled", checked)}
                data-testid="switch-sms-enabled"
              />
            </div>

            {settings.enabled && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Message Notifications</div>
                    <div className="text-white/60 text-sm">Get notified of new family messages</div>
                  </div>
                  <Switch
                    checked={settings.messageNotifications}
                    onCheckedChange={(checked) => updateSetting("messageNotifications", checked)}
                    data-testid="switch-message-notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Family Updates</div>
                    <div className="text-white/60 text-sm">Important family announcements</div>
                  </div>
                  <Switch
                    checked={settings.familyUpdates}
                    onCheckedChange={(checked) => updateSetting("familyUpdates", checked)}
                    data-testid="switch-family-updates"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Security Alerts</div>
                    <div className="text-white/60 text-sm">Login and security notifications</div>
                  </div>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => updateSetting("securityAlerts", checked)}
                    data-testid="switch-security-alerts"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quiet Hours Settings */}
      {settings?.verified && settings.enabled && (
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              Quiet Hours
            </CardTitle>
            <CardDescription className="text-white/60">
              Set times when you don't want to receive SMS notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Start Time</label>
                <Input
                  type="time"
                  value={settings.quietHoursStart || "22:00"}
                  onChange={(e) => updateSetting("quietHoursStart", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-quiet-hours-start"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">End Time</label>
                <Input
                  type="time"
                  value={settings.quietHoursEnd || "08:00"}
                  onChange={(e) => updateSetting("quietHoursEnd", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-quiet-hours-end"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}