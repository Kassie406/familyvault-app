import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Mail, Send, AlertTriangle, CheckCircle, Clock, Activity, TrendingUp, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface SMTPMetrics {
  status: 'healthy' | 'warning' | 'critical';
  emailsToday: { sent: number; delivered: number; bounced: number; failed: number };
  deliveryRate: number;
  queueSize: number;
  avgDeliveryTime: number;
  smtpServer: { status: string; latency: number };
  recentEmails: Array<{
    id: string;
    to: string;
    subject: string;
    status: 'sent' | 'delivered' | 'bounced' | 'failed';
    timestamp: string;
    deliveryTime?: number;
  }>;
}

export default function SMTPStatus() {
  const [, navigate] = useLocation();
  const [metrics, setMetrics] = useState<SMTPMetrics>({
    status: 'healthy',
    emailsToday: { sent: 1247, delivered: 1189, bounced: 32, failed: 26 },
    deliveryRate: 95.3,
    queueSize: 14,
    avgDeliveryTime: 2.8,
    smtpServer: { status: 'operational', latency: 45 },
    recentEmails: [
      { id: '1', to: 'customer@example.com', subject: 'Welcome to FamilyCircle', status: 'delivered', timestamp: '2025-01-29T23:45:00Z', deliveryTime: 1.2 },
      { id: '2', to: 'user@domain.com', subject: 'Password Reset Request', status: 'delivered', timestamp: '2025-01-29T23:43:00Z', deliveryTime: 2.1 },
      { id: '3', to: 'invalid@badomain.com', subject: 'Account Verification', status: 'bounced', timestamp: '2025-01-29T23:41:00Z' },
      { id: '4', to: 'admin@company.com', subject: 'Weekly Security Report', status: 'sent', timestamp: '2025-01-29T23:40:00Z' },
      { id: '5', to: 'support@client.org', subject: 'Subscription Renewal', status: 'failed', timestamp: '2025-01-29T23:38:00Z' }
    ]
  });

  const [loading, setLoading] = useState(false);

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => ({
        ...prev,
        queueSize: Math.floor(Math.random() * 30) + 5,
        avgDeliveryTime: Math.round((Math.random() * 3 + 1) * 10) / 10
      }));
    } catch (error) {
      console.error('Failed to refresh SMTP metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'bounced': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Mail className="w-4 h-4 text-gray-500" />;
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
    <div className="p-6 space-y-6" data-testid="smtp-status-page">
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
              <Mail className="w-6 h-6" />
              Email Delivery Monitoring
            </h1>
            <p className="text-muted-foreground">SMTP server performance and email delivery analytics</p>
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
            SMTP Server Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(metrics.status)} data-testid="status-badge">
              {metrics.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Server latency: {metrics.smtpServer.latency}ms
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Email Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Emails Sent Today */}
        <Card data-testid="emails-sent-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-4 h-4" />
              Sent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="emails-sent-count">
              {metrics.emailsToday.sent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total emails sent</p>
          </CardContent>
        </Card>

        {/* Delivery Rate */}
        <Card data-testid="delivery-rate-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="delivery-rate">
              {metrics.deliveryRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.emailsToday.delivered} delivered
            </p>
          </CardContent>
        </Card>

        {/* Queue Size */}
        <Card data-testid="queue-size-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Queue Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="queue-size">
              {metrics.queueSize}
            </div>
            <p className="text-xs text-muted-foreground">Pending emails</p>
          </CardContent>
        </Card>

        {/* Avg Delivery Time */}
        <Card data-testid="delivery-time-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="avg-delivery-time">
              {metrics.avgDeliveryTime}s
            </div>
            <p className="text-xs text-muted-foreground">Average time</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Status Breakdown */}
      <Card data-testid="email-breakdown-card">
        <CardHeader>
          <CardTitle>Today's Email Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Delivered */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">Delivered</span>
                <span className="text-sm font-bold" data-testid="delivered-count">
                  {metrics.emailsToday.delivered}
                </span>
              </div>
              <Progress 
                value={(metrics.emailsToday.delivered / metrics.emailsToday.sent) * 100} 
                className="h-2 bg-green-100"
                data-testid="delivered-progress"
              />
            </div>

            {/* Bounced */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-600">Bounced</span>
                <span className="text-sm font-bold" data-testid="bounced-count">
                  {metrics.emailsToday.bounced}
                </span>
              </div>
              <Progress 
                value={(metrics.emailsToday.bounced / metrics.emailsToday.sent) * 100} 
                className="h-2"
                data-testid="bounced-progress"
              />
            </div>

            {/* Failed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">Failed</span>
                <span className="text-sm font-bold" data-testid="failed-count">
                  {metrics.emailsToday.failed}
                </span>
              </div>
              <Progress 
                value={(metrics.emailsToday.failed / metrics.emailsToday.sent) * 100} 
                className="h-2"
                data-testid="failed-progress"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Email Activity */}
      <Card data-testid="recent-emails-card">
        <CardHeader>
          <CardTitle>Recent Email Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentEmails.map((email, index) => (
              <div key={email.id}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(email.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" data-testid={`email-to-${index}`}>
                        {email.to}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          email.status === 'delivered' ? 'border-green-200 text-green-600' :
                          email.status === 'sent' ? 'border-blue-200 text-blue-600' :
                          email.status === 'bounced' ? 'border-yellow-200 text-yellow-600' :
                          'border-red-200 text-red-600'
                        }`}
                        data-testid={`email-status-${index}`}
                      >
                        {email.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`email-subject-${index}`}>
                      {email.subject}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span data-testid={`email-time-${index}`}>
                        {new Date(email.timestamp).toLocaleString()}
                      </span>
                      {email.deliveryTime && (
                        <span data-testid={`email-delivery-time-${index}`}>
                          Delivered in {email.deliveryTime}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {index < metrics.recentEmails.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}