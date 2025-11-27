"use client";

import React from "react";
import { LuLoader } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

export type Variant = "default" | "secondary" | "ghost" | "link" | "outline" | "destructive";
export type Size = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-white shadow hover:bg-primary/90",
  destructive: "bg-danger text-white shadow-sm hover:bg-danger/70",
  outline: "border border-gray-400 bg-white shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground hover:bg-gray-100",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<Size, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

// Menggunakan Omit untuk mendefinisikan tipe yang lebih aman
type ButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;
type DivAttributes = React.HTMLAttributes<HTMLDivElement>;

type PolymorphicProps = ButtonAttributes & Omit<DivAttributes, keyof ButtonAttributes>;

type ButtonProps = PolymorphicProps & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  pending?: boolean;
};

export default function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  pending,
  ...props
}: ButtonProps) {
  const Component = asChild ? "div" : "button";

  const finalClass = twMerge(
    "w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <Component className={finalClass} {...(props as React.HTMLAttributes<HTMLElement>)}>
      {pending ? <LuLoader className="animate-spin mr-2" /> : null} {children}
    </Component>
  );
}
