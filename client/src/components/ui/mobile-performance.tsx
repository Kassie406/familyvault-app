import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { createIntersectionObserver } from '@/lib/touch-utils';
import { MobileLoading } from './mobile-loading';

// Lazy loading wrapper for heavy components
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const LazyComponent = memo(function LazyComponent({
  children,
  fallback = <MobileLoading size="md" message="Loading..." />,
  threshold = 0.1,
  rootMargin = '50px'
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!elementRef.current) return;

    const observer = createIntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasBeenVisible) {
          setIsVisible(true);
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, hasBeenVisible]);

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  );
});

// Virtual scrolling for large lists
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );
  
  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
      className="overscroll-contain"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Optimized image component with lazy loading
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!imgRef.current) return;

    const observer = createIntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          {placeholder === 'blur' && blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-600 rounded" />
          )}
        </div>
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-8 h-8 bg-gray-600 rounded mx-auto mb-2" />
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}
    </div>
  );
});

// Debounced search input for performance
interface DebouncedSearchProps {
  onSearch: (query: string) => void;
  delay?: number;
  placeholder?: string;
  className?: string;
}

export function DebouncedSearch({
  onSearch,
  delay = 300,
  placeholder = 'Search...',
  className
}: DebouncedSearchProps) {
  const [query, setQuery] = React.useState('');
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, delay, onSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-[var(--bg-800)] border border-[var(--line-700)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] touch-manipulation ${className}`}
    />
  );
}

// Memoized list item to prevent unnecessary re-renders
interface MemoizedListItemProps {
  children: React.ReactNode;
  dependencies?: any[];
}

export const MemoizedListItem = memo(function MemoizedListItem({
  children,
  dependencies = []
}: MemoizedListItemProps) {
  return <>{children}</>;
}, (prevProps, nextProps) => {
  // Custom comparison function
  if (prevProps.dependencies?.length !== nextProps.dependencies?.length) {
    return false;
  }
  
  return prevProps.dependencies?.every((dep, index) => 
    dep === nextProps.dependencies?.[index]
  ) ?? true;
});

// Chunked rendering for large datasets
interface ChunkedRenderProps<T> {
  items: T[];
  chunkSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderChunk?: (items: React.ReactNode[], chunkIndex: number) => React.ReactNode;
  delay?: number;
}

export function ChunkedRender<T>({
  items,
  chunkSize = 20,
  renderItem,
  renderChunk,
  delay = 16
}: ChunkedRenderProps<T>) {
  const [renderedChunks, setRenderedChunks] = React.useState<React.ReactNode[][]>([]);
  const [currentChunk, setCurrentChunk] = React.useState(0);

  const chunks = useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize));
    }
    return result;
  }, [items, chunkSize]);

  React.useEffect(() => {
    setRenderedChunks([]);
    setCurrentChunk(0);
  }, [items]);

  React.useEffect(() => {
    if (currentChunk >= chunks.length) return;

    const timeoutId = setTimeout(() => {
      const chunk = chunks[currentChunk];
      const renderedChunk = chunk.map((item, index) => 
        renderItem(item, currentChunk * chunkSize + index)
      );

      setRenderedChunks(prev => [...prev, renderedChunk]);
      setCurrentChunk(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [currentChunk, chunks, chunkSize, renderItem, delay]);

  return (
    <>
      {renderedChunks.map((chunk, chunkIndex) => 
        renderChunk ? renderChunk(chunk, chunkIndex) : chunk
      )}
      {currentChunk < chunks.length && (
        <MobileLoading size="sm" message="Loading more..." />
      )}
    </>
  );
}

// Performance monitoring hook
export function usePerformanceMonitor(name: string) {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 100) {
        console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
      }
    };
  }, [name]);
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
}

// Bundle size optimization - code splitting helper
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <MobileLoading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}