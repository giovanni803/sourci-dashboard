"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full appearance-none rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2 pr-8 text-sm text-fg-primary",
        "transition-colors duration-150 ease-smooth",
        "hover:border-white/[0.14]",
        "focus-visible:outline-none focus-visible:border-neon-cyan/50 focus-visible:ring-2 focus-visible:ring-neon-cyan/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22 width=%2212%22 height=%2212%22><path fill=%22none%22 stroke=%22%238B8F97%22 stroke-width=%221.5%22 d=%22M2 4l4 4 4-4%22/></svg>')] bg-no-repeat bg-[right_0.6rem_center]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
