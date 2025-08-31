import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Shield, Users, Key, Activity, AlertTriangle, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface AuthMetrics {
  status: 'healthy' | 'warning' | 'critical';
  activeUsers: number;
  activeSessions: number;
  failedLogins: { count: number; lastHour: number };
  twoFactorStatus: { enabled: number; total: number };
  sessionDuration: { avg: number; max: number };
  recentEvents: Array<{
    id: string;
    type: 'login' | 'logout' | 'failed_login' | '2fa_enabled';
    user: string;
    timestamp: string;
    details: string;
  }>;
}

export default function AuthStatus() {
  const [, navigate] = useLocation();
  const [metrics, setMetrics] = useState<AuthMetrics>({
    status: 'healthy',
    activeUsers: 147,
    activeSessions: 203,
    failedLogins: { count: 12, lastHour: 3 },
    twoFactorStatus: { enabled: 89, total: 147 },
    sessionDuration: { avg: 42, max: 180 },
    recentEvents: [
      { id: '1', type: 'login', user: 'sarah.martinez@company.com', timestamp: '2025-01-29T23:45:00Z', details: 'Successful login from IP 192.168.1.100' },
      { id: '2', type: '2fa_enabled', user: 'john.doe@company.com', timestamp: '2025-01-29T23:42:00Z', details: 'Two-factor authentication enabled' },
      { id: '3', type: 'failed_login', user: 'unknown@suspicious.com', timestamp: '2025-01-29T23:40:00Z', details: 'Failed login attempt - invalid credentials' },
      { id: '4', type: 'logout', user: 'emily.chen@company.com', timestamp: '2025-01-29T23:38:00Z', details: 'User logged out successfully' }
    ]
  });

  const [loading, setLoading] = useState(false);

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 50) + 120,
        activeSessions: Math.floor(Math.random() * 100) + 180
      }));
    } catch (error) {
      console.error('Failed to refresh auth metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'logout': return <Users className="w-4 h-4 text-blue-500" />;
      case 'failed_login': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case '2fa_enabled': return <Shield className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="auth-status-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="page-title">
              <Shield className="w-6 h-6" />
              Authentication System
            </h1>
            <p className="text-muted-foreground">Monitor authentication security and user sessions</p>
          </div>
        </div>
        <Button 
          onClick={refreshMetrics} 
          disabled={loading}
          data-testid="refresh-button"
        >
          <Activity className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Status Overview */}
      <Card data-testid="status-overview-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(metrics.status)} data-testid="status-badge">
              {metrics.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Active Users */}
        <Card data-testid="active-users-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="active-users-count">
              {metrics.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card data-testid="active-sessions-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-4 h-4" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="active-sessions-count">
              {metrics.activeSessions}
            </div>
            <p className="text-xs text-muted-foreground">Total sessions</p>
          </CardContent>
        </Card>

        {/* Failed Logins */}
        <Card data-testid="failed-logins-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Failed Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="failed-logins-count">
              {metrics.failedLogins.count}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.failedLogins.lastHour} in last hour
            </p>
          </CardContent>
        </Card>

        {/* 2FA Status */}
        <Card data-testid="two-factor-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Two-Factor Auth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="two-factor-enabled">
              {metrics.twoFactorStatus.enabled}
            </div>
            <p className="text-xs text-muted-foreground">
              / {metrics.twoFactorStatus.total} users ({Math.round((metrics.twoFactorStatus.enabled / metrics.twoFactorStatus.total) * 100)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Session Analytics */}
      <Card data-testid="session-analytics-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium mb-2">Average Session Duration</div>
              <div className="text-2xl font-bold" data-testid="avg-session-duration">
                {metrics.sessionDuration.avg} min
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Maximum Session Duration</div>
              <div className="text-2xl font-bold" data-testid="max-session-duration">
                {metrics.sessionDuration.max} min
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Authentication Events */}
      <Card data-testid="recent-events-card">
        <CardHeader>
          <CardTitle>Recent Authentication Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentEvents.map((event, index) => (
              <div key={event.id}>
                <div className="flex items-start gap-3">
                  {getEventIcon(event.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" data-testid={`event-user-${index}`}>
                        {event.user}
                      </span>
                      <Badge variant="outline" className="text-xs" data-testid={`event-type-${index}`}>
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`event-details-${index}`}>
                      {event.details}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`event-time-${index}`}>
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {index < metrics.recentEvents.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}