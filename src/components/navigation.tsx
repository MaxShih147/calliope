"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

const links = [
  { href: "/", label: "Compose" },
  { href: "/archive", label: "Archive" },
  { href: "/settings", label: "Settings" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header>
      {/* Masthead */}
      <div className="mx-auto max-w-[720px] px-6 pt-8 pb-3">
        <Link
          href="/"
          className="inline-flex items-center gap-3.5 text-foreground hover:opacity-70 transition-opacity"
        >
          <Logo size={42} />
          <span className="font-serif text-[1.75rem] font-light tracking-[0.02em]">
            Calliope
          </span>
        </Link>
      </div>

      {/* Navigation rule + links */}
      <div className="mx-auto max-w-[720px] px-6">
        <div className="hairline-strong" />
        <nav className="flex gap-8 py-3">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`section-label transition-colors ${
                  isActive ? "!text-foreground" : "hover:!text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hairline" />
      </div>
    </header>
  );
}
