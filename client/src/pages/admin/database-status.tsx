import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Database, Activity, Clock, HardDrive, Zap, AlertTriangle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface DatabaseMetrics {
  status: 'healthy' | 'warning' | 'critical';
  connections: { active: number; max: number };
  queryPerformance: { avgResponseTime: number; slowQueries: number };
  storage: { used: number; total: number; percentage: number };
  uptime: { days: number; hours: number; minutes: number };
  replication: { status: string; lag: number };
}

export default function DatabaseStatus() {
  const [metrics, setMetrics] = useState<DatabaseMetrics>({
    status: 'healthy',
    connections: { active: 23, max: 100 },
    queryPerformance: { avgResponseTime: 15, slowQueries: 2 },
    storage: { used: 2.4, total: 10, percentage: 24 },
    uptime: { days: 14, hours: 6, minutes: 32 },
    replication: { status: 'synced', lag: 0 }
  });

  const [loading, setLoading] = useState(false);

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => ({
        ...prev,
        connections: { ...prev.connections, active: Math.floor(Math.random() * 50) + 10 },
        queryPerformance: { ...prev.queryPerformance, avgResponseTime: Math.floor(Math.random() * 30) + 5 }
      }));
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="database-status-page">
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
              <Database className="w-6 h-6" />
              Database Monitoring
            </h1>
            <p className="text-muted-foreground">Real-time database performance and health metrics</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Connection Pool */}
        <Card data-testid="connections-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" data-testid="active-connections">
                  {metrics.connections.active}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {metrics.connections.max} max
                </span>
              </div>
              <Progress 
                value={(metrics.connections.active / metrics.connections.max) * 100} 
                className="h-2"
                data-testid="connections-progress"
              />
              <p className="text-xs text-muted-foreground">
                Connection pool utilization
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Query Performance */}
        <Card data-testid="performance-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Query Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" data-testid="avg-response-time">
                  {metrics.queryPerformance.avgResponseTime}ms
                </span>
                <span className="text-sm text-muted-foreground">avg</span>
              </div>
              <div className="flex items-center gap-2">
                {metrics.queryPerformance.slowQueries > 0 && (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm" data-testid="slow-queries">
                  {metrics.queryPerformance.slowQueries} slow queries
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card data-testid="storage-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" data-testid="storage-used">
                  {metrics.storage.used}GB
                </span>
                <span className="text-sm text-muted-foreground">
                  / {metrics.storage.total}GB
                </span>
              </div>
              <Progress 
                value={metrics.storage.percentage} 
                className="h-2"
                data-testid="storage-progress"
              />
              <p className="text-xs text-muted-foreground">
                {metrics.storage.percentage}% used
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Uptime */}
        <Card data-testid="uptime-card">
          <CardHeader>
            <CardTitle>System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" data-testid="uptime-days">
                  {metrics.uptime.days}
                </div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold" data-testid="uptime-hours">
                  {metrics.uptime.hours}
                </div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold" data-testid="uptime-minutes">
                  {metrics.uptime.minutes}
                </div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replication Status */}
        <Card data-testid="replication-card">
          <CardHeader>
            <CardTitle>Replication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className="bg-green-100 text-green-600" data-testid="replication-status">
                  {metrics.replication.status.toUpperCase()}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Replication Lag</span>
                <span className="text-sm" data-testid="replication-lag">
                  {metrics.replication.lag}ms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}