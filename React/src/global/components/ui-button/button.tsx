import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "hero" | "outline" | "default";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Button({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: "bg-teal-500 text-white hover:bg-teal-600",
    hero: "bg-primary text-white hover:bg-primary/90",
    outline: "border-2 border-foreground text-foreground hover:bg-foreground/10",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl font-semibold",
  };

  return (
    <button
      {...props}
      className={
        `rounded-xl transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ` +
        className
      }
    >
      {children}
    </button>
  );
}
