import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { HardDrive, Upload, Download, FolderOpen, File, Activity, AlertTriangle, CheckCircle, Cloud, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface StorageMetrics {
  status: 'healthy' | 'warning' | 'critical';
  storage: { used: number; total: number; percentage: number; unit: string };
  bandwidth: { upload: number; download: number; unit: string };
  files: { total: number; uploaded: number; deleted: number };
  cdnHealth: { status: string; latency: number; cacheHitRate: number };
  storageBreakdown: Array<{
    type: string;
    size: number;
    percentage: number;
    files: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: 'upload' | 'download' | 'delete';
    fileName: string;
    fileSize: number;
    user: string;
    timestamp: string;
    status: 'success' | 'failed';
  }>;
}

export default function StorageStatus() {
  const [, navigate] = useLocation();
  const [metrics, setMetrics] = useState<StorageMetrics>({
    status: 'healthy',
    storage: { used: 847.3, total: 2000, percentage: 42.4, unit: 'GB' },
    bandwidth: { upload: 127.5, download: 89.2, unit: 'GB' },
    files: { total: 34521, uploaded: 156, deleted: 23 },
    cdnHealth: { status: 'operational', latency: 32, cacheHitRate: 94.7 },
    storageBreakdown: [
      { type: 'Documents', size: 425.8, percentage: 50.3, files: 18245 },
      { type: 'Images', size: 287.2, percentage: 33.9, files: 12876 },
      { type: 'Videos', size: 89.4, percentage: 10.6, files: 1987 },
      { type: 'Archives', size: 32.1, percentage: 3.8, files: 876 },
      { type: 'Other', size: 12.8, percentage: 1.4, files: 537 }
    ],
    recentActivity: [
      { id: '1', action: 'upload', fileName: 'family_documents_2025.pdf', fileSize: 2.4, user: 'sarah.martinez', timestamp: '2025-01-29T23:45:00Z', status: 'success' },
      { id: '2', action: 'download', fileName: 'medical_records.zip', fileSize: 8.7, user: 'john.doe', timestamp: '2025-01-29T23:44:00Z', status: 'success' },
      { id: '3', action: 'upload', fileName: 'wedding_photos.zip', fileSize: 156.8, user: 'emily.chen', timestamp: '2025-01-29T23:42:00Z', status: 'success' },
      { id: '4', action: 'delete', fileName: 'old_backup_2024.tar', fileSize: 45.2, user: 'admin', timestamp: '2025-01-29T23:40:00Z', status: 'success' },
      { id: '5', action: 'upload', fileName: 'corrupted_file.docx', fileSize: 0.8, user: 'test.user', timestamp: '2025-01-29T23:38:00Z', status: 'failed' }
    ]
  });

  const [loading, setLoading] = useState(false);

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => ({
        ...prev,
        cdnHealth: {
          ...prev.cdnHealth,
          latency: Math.floor(Math.random() * 30) + 20,
          cacheHitRate: Math.round((Math.random() * 5 + 90) * 10) / 10
        }
      }));
    } catch (error) {
      console.error('Failed to refresh storage metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload': return <Upload className="w-4 h-4 text-blue-500" />;
      case 'download': return <Download className="w-4 h-4 text-green-500" />;
      case 'delete': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <File className="w-4 h-4 text-gray-500" />;
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <div className="p-6 space-y-6" data-testid="storage-status-page">
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
              <HardDrive className="w-6 h-6" />
              Storage Management
            </h1>
            <p className="text-muted-foreground">File storage usage, performance, and activity monitoring</p>
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
            Storage System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(metrics.status)} data-testid="status-badge">
              {metrics.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              CDN latency: {metrics.cdnHealth.latency}ms
            </span>
            <span className="text-sm text-muted-foreground">
              Cache hit rate: {metrics.cdnHealth.cacheHitRate}%
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Storage Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Storage Usage */}
        <Card data-testid="storage-usage-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold" data-testid="storage-used">
                {metrics.storage.used} {metrics.storage.unit}
              </div>
              <Progress 
                value={metrics.storage.percentage} 
                className="h-2"
                data-testid="storage-progress"
              />
              <p className="text-xs text-muted-foreground">
                {metrics.storage.percentage}% of {metrics.storage.total} {metrics.storage.unit}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Bandwidth */}
        <Card data-testid="upload-bandwidth-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="upload-bandwidth">
              {metrics.bandwidth.upload} {metrics.bandwidth.unit}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.files.uploaded} files uploaded
            </p>
          </CardContent>
        </Card>

        {/* Download Bandwidth */}
        <Card data-testid="download-bandwidth-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="download-bandwidth">
              {metrics.bandwidth.download} {metrics.bandwidth.unit}
            </div>
            <p className="text-xs text-muted-foreground">Total downloaded</p>
          </CardContent>
        </Card>

        {/* Total Files */}
        <Card data-testid="total-files-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Total Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-files">
              {metrics.files.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.files.deleted} deleted today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Breakdown */}
      <Card data-testid="storage-breakdown-card">
        <CardHeader>
          <CardTitle>Storage Breakdown by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.storageBreakdown.map((item, index) => (
              <div key={item.type}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium" data-testid={`breakdown-type-${index}`}>
                    {item.type}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    <span data-testid={`breakdown-size-${index}`}>
                      {item.size} GB
                    </span>
                    <span className="mx-2">•</span>
                    <span data-testid={`breakdown-files-${index}`}>
                      {item.files.toLocaleString()} files
                    </span>
                  </div>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-2"
                  data-testid={`breakdown-progress-${index}`}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {item.percentage}% of total storage
                </div>
                {index < metrics.storageBreakdown.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CDN Performance */}
      <Card data-testid="cdn-performance-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            CDN Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600" data-testid="cdn-status">
                {metrics.cdnHealth.status.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">CDN Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="cdn-latency">
                {metrics.cdnHealth.latency}ms
              </div>
              <div className="text-sm text-muted-foreground">Average Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="cache-hit-rate">
                {metrics.cdnHealth.cacheHitRate}%
              </div>
              <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent File Activity */}
      <Card data-testid="recent-activity-card">
        <CardHeader>
          <CardTitle>Recent File Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentActivity.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  {getActionIcon(activity.action)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium" data-testid={`activity-filename-${index}`}>
                        {activity.fileName}
                      </span>
                      <Badge variant="outline" className="text-xs" data-testid={`activity-action-${index}`}>
                        {activity.action}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          activity.status === 'success' ? 'border-green-200 text-green-600' :
                          'border-red-200 text-red-600'
                        }`}
                        data-testid={`activity-status-${index}`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span data-testid={`activity-size-${index}`}>
                        {formatFileSize(activity.fileSize * 1024 * 1024)} {/* Convert MB to bytes for formatting */}
                      </span>
                      <span data-testid={`activity-user-${index}`}>
                        {activity.user}
                      </span>
                      <span data-testid={`activity-time-${index}`}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {index < metrics.recentActivity.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}