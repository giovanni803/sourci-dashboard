"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SourciLogo } from "@/components/sourci-logo";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/submit", label: "Submit Week" },
  { href: "/history", label: "History" },
  { href: "/tier-a", label: "Tier A" },
  { href: "/targets", label: "Targets" },
];

export function Nav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity duration-200 ease-smooth hover:opacity-90"
        >
          <SourciLogo size="text-xl" />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-muted sm:inline">
            Sales
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 overflow-x-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-smooth",
                  active
                    ? "text-neon-cyan bg-white/[0.04]"
                    : "text-fg-secondary hover:text-fg-primary hover:bg-white/[0.04]"
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-glow-cyan" />
                )}
              </Link>
            );
          })}
          <form action="/api/logout" method="POST" className="ml-2">
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg-primary hover:bg-white/[0.04]"
            >
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
