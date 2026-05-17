import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-sm text-fg-primary placeholder:text-fg-subtle",
        "transition-colors duration-150 ease-smooth",
        "hover:border-white/[0.14]",
        "focus-visible:outline-none focus-visible:border-neon-cyan/50 focus-visible:ring-2 focus-visible:ring-neon-cyan/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
