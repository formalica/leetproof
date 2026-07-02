"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide the footer on any problems pages so the page ends at the editor/description.
  if (pathname && pathname.startsWith("/problems")) return null;

  return (
    <footer className="border-t border-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-muted">
             {new Date().getFullYear()} LeetProof. Theorem proving platform.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
            <a
              href="https://discord.app/leetproof"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              Discord
            </a>
            <a
              href="https://x.com/leetproof"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              X
            </a>
            <a
              href="https://github.com/nnarek/leetproof"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              GitHub
            </a>

            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
