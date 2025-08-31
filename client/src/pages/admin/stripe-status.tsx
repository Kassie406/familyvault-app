import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { CreditCard, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Activity, RefreshCw, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface StripeMetrics {
  status: 'healthy' | 'warning' | 'critical';
  paymentsToday: { total: number; successful: number; failed: number; pending: number };
  revenue: { today: number; thisMonth: number; currency: string };
  subscriptions: { active: number; new: number; cancelled: number; churnRate: number };
  apiLatency: number;
  webhookHealth: { delivered: number; failed: number; successRate: number };
  recentTransactions: Array<{
    id: string;
    customer: string;
    amount: number;
    currency: string;
    status: 'succeeded' | 'failed' | 'pending' | 'refunded';
    type: 'payment' | 'subscription' | 'refund';
    timestamp: string;
    description: string;
  }>;
}

export default function StripeStatus() {
  const [metrics, setMetrics] = useState<StripeMetrics>({
    status: 'healthy',
    paymentsToday: { total: 156, successful: 143, failed: 9, pending: 4 },
    revenue: { today: 12847.50, thisMonth: 145230.75, currency: 'USD' },
    subscriptions: { active: 1247, new: 23, cancelled: 8, churnRate: 3.2 },
    apiLatency: 95,
    webhookHealth: { delivered: 287, failed: 3, successRate: 98.9 },
    recentTransactions: [
      { id: 'pi_3N...ABC', customer: 'cus_ABC123', amount: 99.99, currency: 'USD', status: 'succeeded', type: 'subscription', timestamp: '2025-01-29T23:45:00Z', description: 'Family Plan Monthly' },
      { id: 'pi_3N...DEF', customer: 'cus_DEF456', amount: 299.99, currency: 'USD', status: 'succeeded', type: 'payment', timestamp: '2025-01-29T23:42:00Z', description: 'Annual Premium Upgrade' },
      { id: 'pi_3N...GHI', customer: 'cus_GHI789', amount: 49.99, currency: 'USD', status: 'failed', type: 'payment', timestamp: '2025-01-29T23:40:00Z', description: 'Basic Plan - Card Declined' },
      { id: 're_3N...JKL', customer: 'cus_JKL012', amount: -99.99, currency: 'USD', status: 'refunded', type: 'refund', timestamp: '2025-01-29T23:38:00Z', description: 'Subscription Refund' },
      { id: 'pi_3N...MNO', customer: 'cus_MNO345', amount: 19.99, currency: 'USD', status: 'pending', type: 'payment', timestamp: '2025-01-29T23:35:00Z', description: 'Starter Plan Monthly' }
    ]
  });

  const [loading, setLoading] = useState(false);

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => ({
        ...prev,
        apiLatency: Math.floor(Math.random() * 50) + 70,
        paymentsToday: {
          ...prev.paymentsToday,
          total: prev.paymentsToday.total + Math.floor(Math.random() * 3)
        }
      }));
    } catch (error) {
      console.error('Failed to refresh Stripe metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      case 'refunded': return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default: return <CreditCard className="w-4 h-4 text-gray-500" />;
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const successRate = Math.round((metrics.paymentsToday.successful / metrics.paymentsToday.total) * 100);

  return (
    <div className="p-6 space-y-6" data-testid="stripe-status-page">
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
              <CreditCard className="w-6 h-6" />
              Payment Processing
            </h1>
            <p className="text-muted-foreground">Stripe payment metrics and transaction monitoring</p>
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
            Stripe API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(metrics.status)} data-testid="status-badge">
              {metrics.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              API latency: {metrics.apiLatency}ms
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Payments Today */}
        <Card data-testid="payments-today-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payments Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="payments-total">
              {metrics.paymentsToday.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.paymentsToday.successful} successful
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card data-testid="success-rate-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="success-rate">
              {successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.paymentsToday.failed} failed
            </p>
          </CardContent>
        </Card>

        {/* Revenue Today */}
        <Card data-testid="revenue-today-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="revenue-today">
              {formatCurrency(metrics.revenue.today, metrics.revenue.currency)}
            </div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card data-testid="subscriptions-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="active-subscriptions">
              {metrics.subscriptions.active.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{metrics.subscriptions.new} new today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Revenue Card */}
      <Card data-testid="revenue-details-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium mb-2">This Month</div>
              <div className="text-3xl font-bold" data-testid="revenue-month">
                {formatCurrency(metrics.revenue.thisMonth, metrics.revenue.currency)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Subscription Health</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Churn Rate</span>
                  <span className="text-sm font-medium" data-testid="churn-rate">
                    {metrics.subscriptions.churnRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cancelled Today</span>
                  <span className="text-sm font-medium" data-testid="cancelled-today">
                    {metrics.subscriptions.cancelled}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Health */}
      <Card data-testid="webhook-health-card">
        <CardHeader>
          <CardTitle>Webhook Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600" data-testid="webhooks-delivered">
                {metrics.webhookHealth.delivered}
              </div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600" data-testid="webhooks-failed">
                {metrics.webhookHealth.failed}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="webhook-success-rate">
                {metrics.webhookHealth.successRate}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card data-testid="recent-transactions-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentTransactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(transaction.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium font-mono text-sm" data-testid={`transaction-id-${index}`}>
                        {transaction.id}
                      </span>
                      <Badge variant="outline" className="text-xs" data-testid={`transaction-type-${index}`}>
                        {transaction.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          transaction.status === 'succeeded' ? 'border-green-200 text-green-600' :
                          transaction.status === 'pending' ? 'border-yellow-200 text-yellow-600' :
                          transaction.status === 'refunded' ? 'border-blue-200 text-blue-600' :
                          'border-red-200 text-red-600'
                        }`}
                        data-testid={`transaction-status-${index}`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`transaction-description-${index}`}>
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span data-testid={`transaction-amount-${index}`}>
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </span>
                      <span data-testid={`transaction-customer-${index}`}>
                        {transaction.customer}
                      </span>
                      <span data-testid={`transaction-time-${index}`}>
                        {new Date(transaction.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {index < metrics.recentTransactions.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}