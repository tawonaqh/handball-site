"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-lg",
    secondary: "bg-secondary text-secondary-foreground shadow hover:bg-secondary/90 hover:shadow-lg",
    accent: "bg-accent text-accent-foreground shadow hover:bg-accent/90 hover:shadow-lg",
    outline: "border-2 border-border text-foreground bg-transparent hover:bg-muted hover:text-foreground",
    ghost: "text-foreground hover:bg-muted hover:text-foreground",
    link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
    destructive: "bg-red-500 text-white shadow hover:bg-red-600 hover:shadow-lg",
  },
  size: {
    sm: "h-9 px-3 text-sm",
    default: "h-11 px-6 py-2",
    lg: "h-12 px-8 text-lg",
    xl: "h-14 px-10 text-xl",
    icon: "h-10 w-10",
  },
};

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  loading = false,
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        loading && "opacity-70 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="spinner w-4 h-4 mr-2 border-current" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };