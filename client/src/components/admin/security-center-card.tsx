import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, ShieldCheck, ShieldAlert, Users, Clock, Globe, 
  Key, AlertTriangle, CheckCircle2 
} from 'lucide-react';

interface SecurityMetrics {
  twoFactorEnabled: boolean;
  activeSessions: number;
  lastLogin?: string;
  ipAllowlistConfigured: boolean;
  lastKeyRotation?: string;
  adminUsers: number;
  failedLogins24h: number;
}

export default function SecurityCenterCard() {
  const { data: securityMetrics, isLoading } = useQuery({
    queryKey: ['/api/admin/security/metrics'],
    queryFn: () => fetch('/api/admin/security/metrics').then(res => res.json()),
  });

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading security metrics...</div>
        </CardContent>
      </Card>
    );
  }

  const metrics: SecurityMetrics = securityMetrics || {
    twoFactorEnabled: false,
    activeSessions: 1,
    lastLogin: new Date().toISOString(),
    ipAllowlistConfigured: false,
    lastKeyRotation: undefined,
    adminUsers: 1,
    failedLogins24h: 0,
  };

  const getSecurityScore = () => {
    let score = 0;
    if (metrics.twoFactorEnabled) score += 25;
    if (metrics.ipAllowlistConfigured) score += 25;
    if (metrics.lastKeyRotation) score += 25;
    if (metrics.failedLogins24h === 0) score += 25;
    return score;
  };

  const securityScore = getSecurityScore();
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Security Center
            </CardTitle>
            <CardDescription>Platform security overview and alerts</CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full ${getScoreBgColor(securityScore)}`}>
            <span className={`text-sm font-semibold ${getScoreColor(securityScore)}`}>
              Security Score: {securityScore}/100
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 2FA Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              {metrics.twoFactorEnabled ? (
                <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-600 mr-2" />
              )}
              <div>
                <p className="text-sm font-medium">2FA Status</p>
                <p className="text-xs text-muted-foreground">Admin accounts</p>
              </div>
            </div>
            <Badge variant={metrics.twoFactorEnabled ? "default" : "destructive"}>
              {metrics.twoFactorEnabled ? "Enabled" : "Not Configured"}
            </Badge>
          </div>

          {/* Active Sessions */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Active Sessions</p>
                <p className="text-xs text-muted-foreground">Current admin logins</p>
              </div>
            </div>
            <Badge variant="outline">
              {metrics.activeSessions}
            </Badge>
          </div>

          {/* IP Allowlist */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium">IP Allowlist</p>
                <p className="text-xs text-muted-foreground">Access restriction</p>
              </div>
            </div>
            <Badge variant={metrics.ipAllowlistConfigured ? "default" : "secondary"}>
              {metrics.ipAllowlistConfigured ? "Configured" : "Open"}
            </Badge>
          </div>

          {/* Key Rotation */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <Key className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Key Rotation</p>
                <p className="text-xs text-muted-foreground">Last API key rotation</p>
              </div>
            </div>
            <Badge variant={metrics.lastKeyRotation ? "default" : "secondary"}>
              {metrics.lastKeyRotation ? "Recent" : "Pending"}
            </Badge>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="mt-4 space-y-2">
          {!metrics.twoFactorEnabled && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Two-Factor Authentication Disabled
                </p>
                <p className="text-xs text-red-600">
                  Enable 2FA for all admin accounts to improve security
                </p>
              </div>
              <Button size="sm" variant="outline" className="hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors">
                Configure 2FA
              </Button>
            </div>
          )}

          {!metrics.ipAllowlistConfigured && (
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  No IP Restrictions
                </p>
                <p className="text-xs text-yellow-600">
                  Consider restricting admin access to trusted IP addresses
                </p>
              </div>
              <Button size="sm" variant="outline" className="hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors">
                Configure IPs
              </Button>
            </div>
          )}

          {metrics.failedLogins24h > 5 && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  High Failed Login Attempts
                </p>
                <p className="text-xs text-red-600">
                  {metrics.failedLogins24h} failed login attempts in the last 24 hours
                </p>
              </div>
              <Button size="sm" variant="outline" className="hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors">
                View Logs
              </Button>
            </div>
          )}

          {securityScore >= 75 && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Security Configuration Excellent
                </p>
                <p className="text-xs text-green-600">
                  Your admin console security settings are well configured
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors">
            <Clock className="w-4 h-4 mr-1" />
            View Session History
          </Button>
          <Button size="sm" variant="outline" className="hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors">
            <Users className="w-4 h-4 mr-1" />
            Manage Admin Users
          </Button>
          <Button size="sm" variant="outline" className="hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors">
            <Key className="w-4 h-4 mr-1" />
            Rotate API Keys
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}