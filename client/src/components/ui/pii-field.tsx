import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PiiFieldProps {
  /** The sensitive value to display/hide */
  value: string | null | undefined;
  /** Custom mask pattern - defaults to masking first 5 digits for SSN */
  maskPattern?: (value: string) => string;
  /** Additional CSS classes */
  className?: string;
  /** Show/hide eye toggle button */
  showToggle?: boolean;
  /** Initial visibility state */
  initialVisible?: boolean;
  /** Custom placeholder when value is null/undefined */
  placeholder?: string;
  /** Text variant */
  variant?: "default" | "mono" | "code";
}

const defaultSsnMask = (value: string): string => {
  if (!value) return value;
  // For SSN format like "123-45-6789", mask first 5 digits: "XXX-XX-6789" 
  return value.replace(/^\d{3}-\d{2}/, "XXX-XX");
};

export function PiiField({
  value,
  maskPattern = defaultSsnMask,
  className,
  showToggle = true,
  initialVisible = false,
  placeholder = "Not provided",
  variant = "default"
}: PiiFieldProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);

  if (!value) {
    return (
      <span className={cn("text-muted-foreground italic", className)}>
        {placeholder}
      </span>
    );
  }

  const displayValue = isVisible ? value : maskPattern(value);
  const variantClasses = {
    default: "",
    mono: "font-mono",
    code: "font-mono bg-muted px-2 py-1 rounded text-sm"
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span 
        className={cn(
          "select-all", // Allow easy selection for copying
          variantClasses[variant]
        )}
        data-testid="pii-value"
      >
        {displayValue}
      </span>
      
      {showToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="h-6 w-6 p-0 hover:bg-[#D4AF37]/14"
          data-testid="pii-toggle"
          aria-label={isVisible ? "Hide sensitive information" : "Show sensitive information"}
        >
          {isVisible ? (
            <EyeOff className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Eye className="h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      )}
    </div>
  );
}