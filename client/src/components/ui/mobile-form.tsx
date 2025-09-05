import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check, AlertCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateField, type ValidationResult } from '@/lib/touch-utils';

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  variant?: 'default' | 'search' | 'password';
  icon?: React.ReactNode;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => ValidationResult;
  };
  onValidation?: (result: ValidationResult) => void;
}

export function MobileInput({
  label,
  error,
  success,
  variant = 'default',
  icon,
  validation,
  onValidation,
  className,
  type,
  ...props
}: MobileInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleValidation = (value: string) => {
    if (!validation) return;
    
    const result = validateField(value, validation);
    setValidationResult(result);
    onValidation?.(result);
  };

  const inputType = variant === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type;

  const hasError = error || !validationResult.isValid;
  const errorMessage = error || validationResult.message;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {validation?.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {variant === 'search' ? <Search className="w-5 h-5" /> : icon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type={inputType}
          className={cn(
            // Base styles
            'w-full px-4 py-3 bg-[var(--bg-800)] border border-[var(--line-700)] rounded-lg',
            'text-white placeholder-gray-400 font-medium',
            'transition-all duration-200 ease-in-out',
            
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]',
            
            // Mobile optimizations
            'text-base', // Prevents zoom on iOS
            'touch-manipulation', // Improves touch responsiveness
            'min-h-[48px]', // Ensures 44px+ touch target
            
            // Icon padding
            icon && 'pl-11',
            (variant === 'password' || success || hasError) && 'pr-11',
            
            // State styles
            isFocused && 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10',
            hasError && 'border-red-500 focus:ring-red-500/40 focus:border-red-500',
            success && 'border-green-500 focus:ring-green-500/40 focus:border-green-500',
            
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            handleValidation(e.target.value);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            props.onChange?.(e);
            // Real-time validation for better UX
            if (validation && e.target.value) {
              handleValidation(e.target.value);
            }
          }}
          {...props}
        />
        
        {/* Right Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {variant === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors p-1 touch-manipulation"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {success && !hasError && (
            <Check className="w-5 h-5 text-green-500" />
          )}
          
          {hasError && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
      
      {/* Error/Help Text */}
      {(errorMessage || props.placeholder) && (
        <div className="mt-2 min-h-[20px]">
          {errorMessage ? (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMessage}
            </p>
          ) : isFocused && props.placeholder && (
            <p className="text-sm text-gray-500">
              {props.placeholder}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  autoResize?: boolean;
}

export function MobileTextarea({
  label,
  error,
  maxLength,
  autoResize = true,
  className,
  ...props
}: MobileTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (!autoResize || !textareaRef.current) return;
    
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          className={cn(
            // Base styles
            'w-full px-4 py-3 bg-[var(--bg-800)] border border-[var(--line-700)] rounded-lg',
            'text-white placeholder-gray-400 font-medium',
            'transition-all duration-200 ease-in-out',
            'resize-none', // Disable manual resize on mobile
            
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]',
            
            // Mobile optimizations
            'text-base', // Prevents zoom on iOS
            'touch-manipulation',
            'min-h-[100px]', // Minimum comfortable size
            
            // State styles
            isFocused && 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10',
            error && 'border-red-500 focus:ring-red-500/40 focus:border-red-500',
            
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e);
            adjustHeight();
          }}
          maxLength={maxLength}
          {...props}
        />
      </div>
      
      {/* Character count and error */}
      <div className="mt-2 flex justify-between items-center min-h-[20px]">
        <div>
          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
        </div>
        
        {maxLength && (
          <span className={cn(
            'text-sm',
            charCount > maxLength * 0.9 ? 'text-yellow-400' : 'text-gray-500',
            charCount >= maxLength && 'text-red-400'
          )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

interface MobileSelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function MobileSelect({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required
}: MobileSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFocused(true);
          }}
          className={cn(
            // Base styles
            'w-full px-4 py-3 bg-[var(--bg-800)] border border-[var(--line-700)] rounded-lg',
            'text-white font-medium text-left',
            'transition-all duration-200 ease-in-out',
            'min-h-[48px] flex items-center justify-between',
            
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]',
            
            // Mobile optimizations
            'text-base touch-manipulation',
            
            // State styles
            isFocused && 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10',
            error && 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
          )}
        >
          <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
          <svg
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[var(--bg-800)] border border-[var(--line-700)] rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (!option.disabled) {
                    onChange?.(option.value);
                    setIsOpen(false);
                    setIsFocused(false);
                  }
                }}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors touch-manipulation',
                  'hover:bg-[var(--bg-700)] focus:bg-[var(--bg-700)]',
                  'focus:outline-none',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  value === option.value && 'bg-[#D4AF37]/10 text-[#D4AF37]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function MobileButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  className,
  ...props
}: MobileButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 ease-in-out touch-manipulation focus:outline-none focus:ring-2 active:scale-98';
  
  const variantClasses = {
    primary: 'bg-[#D4AF37] text-black hover:bg-[#B8941F] focus:ring-[#D4AF37]/40 shadow-lg hover:shadow-xl',
    secondary: 'bg-[var(--bg-700)] text-white hover:bg-[var(--bg-600)] focus:ring-white/20 border border-[var(--line-700)]',
    outline: 'border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black focus:ring-[#D4AF37]/40',
    ghost: 'text-gray-300 hover:text-white hover:bg-[var(--bg-700)] focus:ring-white/20'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </div>
    </button>
  );
}