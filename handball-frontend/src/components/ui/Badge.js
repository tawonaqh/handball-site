"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  variant: {
    default: "bg-primary text-primary-foreground shadow",
    secondary: "bg-secondary text-secondary-foreground shadow",
    accent: "bg-accent text-accent-foreground shadow",
    success: "bg-green-500 text-white shadow",
    warning: "bg-yellow-500 text-black shadow",
    error: "bg-red-500 text-white shadow",
    info: "bg-blue-500 text-white shadow",
    outline: "border border-primary text-primary bg-transparent",
    ghost: "text-primary bg-primary/10",
    // Status-specific variants
    live: "status-live shadow-lg",
    completed: "status-completed shadow",
    upcoming: "status-upcoming shadow",
    scheduled: "status-scheduled shadow",
    postponed: "status-postponed shadow",
    cancelled: "status-cancelled shadow",
  },
  size: {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  },
};

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  pulse = false,
  children, 
  ...props 
}, ref) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200",
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        pulse && "animate-pulse",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };