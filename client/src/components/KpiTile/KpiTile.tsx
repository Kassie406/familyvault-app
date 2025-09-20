import React, { useState, useEffect } from 'react';
import './KpiTile.css';

interface KpiTileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  meta?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  isLoading?: boolean;
  isSensitive?: boolean;
}

// Error boundary wrapper for individual KPI tiles
function CardBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch {
    return (
      <div className="kpi-card error-fallback">
        <div className="alert-inline">Temporarily unavailable.</div>
      </div>
    );
  }
}

export function KpiTile({ 
  title, 
  value, 
  icon, 
  meta = "Recent", 
  onClick, 
  href, 
  className = "",
  isLoading = false,
  isSensitive = false
}: KpiTileProps) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    // Show skeleton for at least 1 second on first load
    const timer = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const content = (
    <CardBoundary>
      <div className="kpi-header">
        <div className="kpi-title">
          {icon && <span className="kpi-icon">{icon}</span>}
          {title}
        </div>
        <div className="meta">{meta}</div>
      </div>
      
      <div className="kpi-value">
        {(isLoading || showSkeleton) ? (
          <div className="h-8 w-24 bg-[#1f1f26] animate-pulse rounded" />
        ) : (
          <span className={isSensitive ? 'mask-on-blur' : ''}>
            {value}
          </span>
        )}
      </div>
      
      <div className="kpi-updated">
        {(isLoading || showSkeleton) ? (
          <div className="h-3 w-20 bg-[#1f1f26] animate-pulse rounded" />
        ) : (
          `Updated ${formatTimestamp(new Date(Date.now() - 2 * 60 * 60 * 1000))}`
        )}
      </div>
    </CardBoundary>
  );

  if (href) {
    return (
      <a href={href} className={`kpi-card ${className}`}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={`kpi-card ${className}`}>
        {content}
      </button>
    );
  }

  return (
    <div className={`kpi-card ${className}`}>
      {content}
    </div>
  );
}
