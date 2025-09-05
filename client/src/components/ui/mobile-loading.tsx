import React from 'react';
import { Loader2, Heart, Check, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'skeleton';
  color?: 'primary' | 'secondary' | 'gold';
  fullScreen?: boolean;
  message?: string;
}

export function MobileLoading({ 
  size = 'md', 
  variant = 'spinner', 
  color = 'gold',
  fullScreen = false,
  message
}: MobileLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-400',
    gold: 'text-[#D4AF37]'
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color]
      )} />
      {message && (
        <p className="text-sm text-gray-400 text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );

  const LoadingPulse = () => (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        'rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] animate-pulse',
        sizeClasses[size]
      )} />
      {message && (
        <p className="text-sm text-gray-400 text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-3 w-full max-w-sm">
      <div className="h-4 bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case 'pulse':
        return <LoadingPulse />;
      case 'skeleton':
        return <LoadingSkeleton />;
      default:
        return <LoadingSpinner />;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-900)] bg-opacity-95 backdrop-blur-sm">
        {renderLoading()}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {renderLoading()}
    </div>
  );
}

interface MobileToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export function MobileToast({ 
  type, 
  message, 
  visible, 
  onClose, 
  duration = 3000 
}: MobileToastProps) {
  React.useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const icons = {
    success: Check,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'border-green-500 bg-green-500/10 text-green-400',
    error: 'border-red-500 bg-red-500/10 text-red-400',
    warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500 bg-blue-500/10 text-blue-400'
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      'fixed top-4 left-4 right-4 z-50 transform transition-all duration-300 ease-in-out',
      visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    )}>
      <div className={cn(
        'flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg',
        colors[type]
      )}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface MobileProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'gold' | 'green' | 'red';
}

export function MobileProgress({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true,
  color = 'gold'
}: MobileProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-blue-500',
    gold: 'bg-[#D4AF37]',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export function MobilePullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80 
}: MobilePullToRefreshProps) {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    // Only allow pull-to-refresh at the top of the scroll
    const isAtTop = containerRef.current?.scrollTop === 0;
    if (!isAtTop) return;
    
    setPullDistance(Math.min(distance, threshold * 1.5));
    
    // Prevent default scrolling when pulling
    if (distance > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div 
      ref={containerRef}
      className="relative h-full overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
        style={{ 
          height: Math.max(pullDistance, 0),
          opacity: pullProgress
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-full border-2 border-[#D4AF37] flex items-center justify-center transition-transform',
            isRefreshing && 'animate-spin'
          )}>
            <Heart className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="text-xs text-gray-400">
            {isRefreshing ? 'Refreshing...' : pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
}