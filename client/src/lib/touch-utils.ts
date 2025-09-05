// Touch and gesture utilities for mobile optimization
import React from 'react';

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  duration: number;
  velocity: number;
}

export class TouchHandler {
  private startPoint: TouchPoint | null = null;
  private endPoint: TouchPoint | null = null;
  private minSwipeDistance = 50;
  private maxSwipeTime = 1000;

  constructor(private element: HTMLElement) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Prevent default touch behaviors that interfere with gestures
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  private handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    this.startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }

  private handleTouchMove(e: TouchEvent) {
    // Prevent default scrolling when we're detecting gestures
    if (this.startPoint) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - this.startPoint.x);
      const deltaY = Math.abs(touch.clientY - this.startPoint.y);
      
      // If horizontal swipe is more significant, prevent vertical scroll
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    }
  }

  private handleTouchEnd(e: TouchEvent) {
    if (!this.startPoint) return;

    const touch = e.changedTouches[0];
    this.endPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    const gesture = this.detectSwipe();
    if (gesture) {
      this.onSwipe(gesture);
    }

    this.startPoint = null;
    this.endPoint = null;
  }

  private detectSwipe(): SwipeGesture | null {
    if (!this.startPoint || !this.endPoint) return null;

    const deltaX = this.endPoint.x - this.startPoint.x;
    const deltaY = this.endPoint.y - this.startPoint.y;
    const duration = this.endPoint.timestamp - this.startPoint.timestamp;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < this.minSwipeDistance || duration > this.maxSwipeTime) {
      return null;
    }

    const velocity = distance / duration;
    let direction: SwipeGesture['direction'];

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return { direction, distance, duration, velocity };
  }

  private onSwipe(gesture: SwipeGesture) {
    const event = new CustomEvent('swipe', { detail: gesture });
    this.element.dispatchEvent(event);
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// React hook for touch gestures
export function useTouchGestures(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    if (!ref.current) return;

    const handler = new TouchHandler(ref.current);
    return () => handler.destroy();
  }, [ref]);
}

// Utility for haptic feedback
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(patterns[type]);
  }
}

// Touch-friendly button enhancement
export function enhanceButtonForTouch(element: HTMLElement) {
  // Ensure minimum touch target size (44px)
  const computedStyle = window.getComputedStyle(element);
  const height = parseInt(computedStyle.height);
  const width = parseInt(computedStyle.width);
  
  if (height < 44) {
    element.style.minHeight = '44px';
    element.style.paddingTop = element.style.paddingTop || '8px';
    element.style.paddingBottom = element.style.paddingBottom || '8px';
  }
  
  if (width < 44) {
    element.style.minWidth = '44px';
    element.style.paddingLeft = element.style.paddingLeft || '12px';
    element.style.paddingRight = element.style.paddingRight || '12px';
  }

  // Add touch-friendly styles
  element.style.touchAction = 'manipulation';
  element.style.userSelect = 'none';
  (element.style as any).webkitUserSelect = 'none';
  (element.style as any).webkitTapHighlightColor = 'transparent';
  
  // Add active state feedback
  element.addEventListener('touchstart', () => {
    element.style.transform = 'scale(0.98)';
    element.style.transition = 'transform 0.1s ease';
  }, { passive: true });
  
  element.addEventListener('touchend', () => {
    element.style.transform = 'scale(1)';
  }, { passive: true });
  
  element.addEventListener('touchcancel', () => {
    element.style.transform = 'scale(1)';
  }, { passive: true });
}

// Debounced scroll handler for performance
export function createScrollHandler(callback: () => void, delay = 100) {
  let timeoutId: number;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(callback, delay);
  };
}

// Intersection observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Mobile-optimized form validation
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateField(value: string, rules: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => ValidationResult;
}): ValidationResult {
  if (rules.required && !value.trim()) {
    return { isValid: false, message: 'This field is required' };
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, message: `Minimum ${rules.minLength} characters required` };
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, message: `Maximum ${rules.maxLength} characters allowed` };
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, message: 'Invalid format' };
  }
  
  if (rules.custom) {
    return rules.custom(value);
  }
  
  return { isValid: true };
}