import { cn } from "@/lib/utils";

interface SourciLogoProps {
  className?: string;
  /** Tailwind text size class controls the wordmark size, e.g. "text-xl" */
  size?: string;
}

export const SOURCI_BLUE = "#1F4E79";

/**
 * Sourci wordmark — heavy geometric sans with a two-square umlaut over the U.
 * Sized via font-size; the umlaut is em-relative so it scales with the text.
 */
export function SourciLogo({ className, size = "text-2xl" }: SourciLogoProps) {
  return (
    <span
      role="img"
      aria-label="Sourci"
      className={cn(
        "inline-flex select-none items-center font-black leading-none",
        "tracking-[-0.06em]",
        size,
        className
      )}
      style={{
        color: SOURCI_BLUE,
        // Subtle drop-shadow so the brand navy reads on the dark surface
        filter:
          "drop-shadow(0 0 12px rgba(31,78,121,0.45)) drop-shadow(0 0 2px rgba(31,78,121,0.6))",
      }}
    >
      <span>SO</span>
      <span className="relative inline-block px-[0.02em]">
        {/* Two-square umlaut — em-sized to track the font */}
        <span
          aria-hidden
          className="absolute left-[0.14em] top-[-0.22em] h-[0.13em] w-[0.14em] rounded-[1px] bg-current"
        />
        <span
          aria-hidden
          className="absolute right-[0.14em] top-[-0.22em] h-[0.13em] w-[0.14em] rounded-[1px] bg-current"
        />
        U
      </span>
      <span>RCI</span>
    </span>
  );
}
