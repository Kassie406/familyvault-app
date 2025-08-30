import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { ROUTES, navigate, trackAdminClick } from '@/lib/routes';

type Component = { 
  component: string; 
  ok: boolean; 
  latency_ms?: number | null;
  avg_latency_ms?: number | null;
  ts?: string;
};
type StatusResponse = { components: Component[] };

const GOLD = '#E0B530';

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <Badge 
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold ${
        ok 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`}
      data-testid={`status-${ok ? 'ok' : 'fail'}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          ok ? 'bg-green-600' : 'bg-red-600'
        }`}
      />
      {ok ? 'OK' : 'FAIL'}
    </Badge>
  );
}

function LatencyBadge({ current, average }: { current?: number | null; average?: number | null }) {
  if (current == null && average == null) return null;
  
  const parts = [];
  if (current != null) parts.push(`now ${current}ms`);
  if (average != null) parts.push(`24h ${average}ms`);
  const text = parts.join(' · ');
  
  return (
    <Badge 
      variant="outline" 
      className="ml-2 text-xs px-2 py-0.5 border-muted-foreground/30 bg-muted/30"
      title="Current vs 24h average latency"
      data-testid="latency-badge"
    >
      {text}
    </Badge>
  );
}

export default function StatusWidget() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadStatus() {
    setError(null);
    try {
      const response = await fetch('/api/admin/status/summary', { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch system status summary');
      }
      
      const data: StatusResponse = await response.json();
      
      // Stable order for visual consistency
      const order = ['database', 'auth', 'smtp', 'webhooks', 'stripe', 'storage'];
      const sortedComponents = [
        ...order
          .map(key => data.components.find(c => c.component === key))
          .filter(Boolean) as Component[],
        ...data.components.filter(c => !order.includes(c.component)),
      ];
      
      setComponents(sortedComponents);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load system status summary');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const [, setLocation] = useLocation();

  const handleRefresh = () => {
    setLoading(true);
    loadStatus();
  };

  const handleViewDetails = () => {
    trackAdminClick('system_status_view_details');
    navigate(ROUTES.SECURITY);
  };

  const handleComponentClick = (component: string) => {
    trackAdminClick('system_status_component', { component });
    
    // Route to specific status pages based on component
    switch (component) {
      case 'database':
        navigate(ROUTES.SECURITY_STATUS('database'));
        break;
      case 'webhooks':
        navigate(ROUTES.WEBHOOKS_DELIVERIES);
        break;
      case 'auth':
        navigate(ROUTES.SECURITY_STATUS('auth'));
        break;
      case 'stripe':
        navigate(ROUTES.PLANS_STRIPE);
        break;
      case 'smtp':
        navigate(ROUTES.SECURITY_STATUS('smtp'));
        break;
      case 'storage':
        navigate(ROUTES.SECURITY_STATUS('storage'));
        break;
      default:
        navigate(ROUTES.SECURITY);
    }
  };

  const allSystemsOperational = components.length > 0 && components.every(c => c.ok);
  const hasFailures = components.some(c => !c.ok);

  return (
    <Card className="w-full" data-testid="system-status-widget">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              loading ? 'bg-yellow-500' : 
              hasFailures ? 'bg-red-500' : 
              allSystemsOperational ? 'bg-green-500' : 'bg-gray-500'
            }`} />
            System Status
          </CardTitle>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground" data-testid="last-updated">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewDetails}
              className="text-xs"
              data-testid="view-details"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
              className="text-xs"
              data-testid="refresh-status"
              style={{ borderColor: GOLD }}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        {/* Overall status summary */}
        {!loading && !error && (
          <div className="text-sm text-muted-foreground" data-testid="status-summary">
            {allSystemsOperational && 'All systems operational'}
            {hasFailures && `${components.filter(c => !c.ok).length} system(s) experiencing issues`}
            {components.length === 0 && 'No system components monitored'}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="text-red-600 dark:text-red-400 text-sm font-medium" data-testid="error-message">
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {components.map((component) => (
            <Card 
              key={component.component}
              className={`transition-all cursor-pointer hover:shadow-md ${
                component.ok 
                  ? 'bg-background hover:bg-green-50/50 dark:hover:bg-green-900/10 border-green-200/30 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700' 
                  : 'bg-background hover:bg-red-50/50 dark:hover:bg-red-900/10 border-red-200/30 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700'
              }`}
              data-testid={`component-${component.component}`}
              onClick={() => handleComponentClick(component.component)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    component.ok 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      component.ok ? 'bg-green-600' : 'bg-red-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize text-foreground" data-testid={`component-name-${component.component}`}>
                      {component.component}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {component.ok ? 'Operational' : 'Service Issue'}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <StatusPill ok={component.ok} />
                    <LatencyBadge current={component.latency_ms} average={component.avg_latency_ms} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {components.length === 0 && !loading && !error && (
            <div className="col-span-full text-center py-8 text-muted-foreground" data-testid="no-components">
              <div className="text-sm">No system components are being monitored yet.</div>
            </div>
          )}

          {loading && components.length === 0 && (
            <div className="col-span-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse mb-3">
                  <div className="h-16 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}