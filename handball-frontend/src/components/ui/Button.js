"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "gradient-primary text-primary-foreground shadow hover:shadow-lg",
    secondary: "gradient-secondary text-secondary-foreground shadow hover:shadow-lg",
    accent: "gradient-accent text-accent-foreground shadow hover:shadow-lg",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
    ghost: "text-primary hover:bg-primary/10 hover:text-primary",
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
        "btn-base",
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
        <div className="spinner w-4 h-4 mr-2" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };