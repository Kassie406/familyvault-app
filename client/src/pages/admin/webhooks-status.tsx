import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Webhook, Send, CheckCircle, AlertTriangle, Clock, Activity, RefreshCw, ExternalLink, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface WebhookMetrics {
  status: 'healthy' | 'warning' | 'critical';
  totalEndpoints: number;
  activeEndpoints: number;
  deliveriesToday: { total: number; successful: number; failed: number; retries: number };
  avgResponseTime: number;
  recentDeliveries: Array<{
    id: string;
    endpoint: string;
    event: string;
    status: 'success' | 'failed' | 'retry';
    responseTime: number;
    statusCode?: number;
    timestamp: string;
    attempt: number;
  }>;
}

export default function WebhooksStatus() {
  const [metrics, setMetrics] = useState<WebhookMetrics>({
    status: 'healthy',
    totalEndpoints: 12,
    activeEndpoints: 10,
    deliveriesToday: { total: 387, successful: 362, failed: 18, retries: 7 },
    avgResponseTime: 245,
    recentDeliveries: [
      { id: '1', endpoint: 'api.partner1.com/webhook', event: 'user.created', status: 'success', responseTime: 180, statusCode: 200, timestamp: '2025-01-29T23:45:00Z', attempt: 1 },
      { id: '2', endpoint: 'hooks.service2.io/events', event: 'payment.completed', status: 'success', responseTime: 95, statusCode: 200, timestamp: '2025-01-29T23:44:00Z', attempt: 1 },
      { id: '3', endpoint: 'webhook.client3.net/api', event: 'subscription.cancelled', status: 'failed', responseTime: 5000, statusCode: 500, timestamp: '2025-01-29T23:43:00Z', attempt: 2 },
      { id: '4', endpoint: 'api.integration4.com/hook', event: 'document.uploaded', status: 'retry', responseTime: 3200, statusCode: 429, timestamp: '2025-01-29T23:42:00Z', attempt: 1 },
      { id: '5', endpoint: 'events.platform5.org/receive', event: 'user.login', status: 'success', responseTime: 142, statusCode: 201, timestamp: '2025-01-29T23:41:00Z', attempt: 1 }
    ]
  });

  const [loading, setLoading] = useState(false);

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => ({
        ...prev,
        avgResponseTime: Math.floor(Math.random() * 200) + 150,
        deliveriesToday: {
          ...prev.deliveriesToday,
          total: prev.deliveriesToday.total + Math.floor(Math.random() * 5)
        }
      }));
    } catch (error) {
      console.error('Failed to refresh webhook metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'retry': return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      default: return <Send className="w-4 h-4 text-gray-500" />;
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

  const getResponseStatusColor = (statusCode?: number) => {
    if (!statusCode) return 'text-gray-600';
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600';
    if (statusCode >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const successRate = Math.round((metrics.deliveriesToday.successful / metrics.deliveriesToday.total) * 100);

  return (
    <div className="p-6 space-y-6" data-testid="webhooks-status-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => useLocation()[1]('/dashboard')}
            className="flex items-center gap-2"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="page-title">
              <Webhook className="w-6 h-6" />
              Webhook Management
            </h1>
            <p className="text-muted-foreground">Monitor webhook deliveries and endpoint health</p>
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
            Webhook System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(metrics.status)} data-testid="status-badge">
              {metrics.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {metrics.activeEndpoints} / {metrics.totalEndpoints} endpoints active
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Deliveries */}
        <Card data-testid="total-deliveries-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-4 h-4" />
              Deliveries Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-deliveries">
              {metrics.deliveriesToday.total}
            </div>
            <p className="text-xs text-muted-foreground">Total attempts</p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card data-testid="success-rate-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="success-rate">
              {successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.deliveriesToday.successful} successful
            </p>
          </CardContent>
        </Card>

        {/* Failed Deliveries */}
        <Card data-testid="failed-deliveries-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Failed Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="failed-deliveries">
              {metrics.deliveriesToday.failed}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.deliveriesToday.retries} retrying
            </p>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card data-testid="response-time-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="avg-response-time">
              {metrics.avgResponseTime}ms
            </div>
            <p className="text-xs text-muted-foreground">Average time</p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Status */}
      <Card data-testid="endpoint-status-card">
        <CardHeader>
          <CardTitle>Endpoint Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600" data-testid="active-endpoints">
                {metrics.activeEndpoints}
              </div>
              <div className="text-sm text-muted-foreground">Active Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600" data-testid="inactive-endpoints">
                {metrics.totalEndpoints - metrics.activeEndpoints}
              </div>
              <div className="text-sm text-muted-foreground">Inactive Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="total-endpoints">
                {metrics.totalEndpoints}
              </div>
              <div className="text-sm text-muted-foreground">Total Endpoints</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Webhook Deliveries */}
      <Card data-testid="recent-deliveries-card">
        <CardHeader>
          <CardTitle>Recent Webhook Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentDeliveries.map((delivery, index) => (
              <div key={delivery.id}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(delivery.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium flex items-center gap-1" data-testid={`delivery-endpoint-${index}`}>
                        {delivery.endpoint}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                      <Badge variant="outline" className="text-xs" data-testid={`delivery-event-${index}`}>
                        {delivery.event}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          delivery.status === 'success' ? 'border-green-200 text-green-600' :
                          delivery.status === 'retry' ? 'border-yellow-200 text-yellow-600' :
                          'border-red-200 text-red-600'
                        }`}
                        data-testid={`delivery-status-${index}`}
                      >
                        {delivery.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span data-testid={`delivery-time-${index}`}>
                        {new Date(delivery.timestamp).toLocaleString()}
                      </span>
                      <span data-testid={`delivery-response-time-${index}`}>
                        {delivery.responseTime}ms
                      </span>
                      {delivery.statusCode && (
                        <span 
                          className={`font-mono ${getResponseStatusColor(delivery.statusCode)}`}
                          data-testid={`delivery-status-code-${index}`}
                        >
                          {delivery.statusCode}
                        </span>
                      )}
                      {delivery.attempt > 1 && (
                        <span data-testid={`delivery-attempt-${index}`}>
                          Attempt {delivery.attempt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {index < metrics.recentDeliveries.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}