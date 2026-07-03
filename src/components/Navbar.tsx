"use client";

import AuthPanel from "@/components/AuthPanel";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useAuth } from "@/hooks/useAuth";
import { getProfileDisplayName } from "@/lib/profile";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import SettingsMenu from "./SettingsMenu";

export default function Navbar() {
  const { user, profile, loading } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [overflowWidth, setOverflowWidth] = useState(0);

  // Measure how far the page's content overflows the viewport horizontally
  // (e.g. a wide table on /problems on mobile) so the header background can
  // be extended to match exactly — no more, no less. When nothing overflows,
  // this stays 0 and no extra element is rendered.
  useEffect(() => {
    function measure() {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      setOverflowWidth(Math.max(0, overflow));
    }
    measure();

    window.addEventListener("resize", measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
    };
  }, []);

  // Close modal on click outside
  useEffect(() => {
    if (!showSignIn) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowSignIn(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSignIn]);

  // Close modal on Escape
  useEffect(() => {
    if (!showSignIn) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSignIn(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showSignIn]);

  return (
    <nav className="relative border-b border-border bg-surface">
      {/*
        Fills in the header background/border to the right of the normal viewport
        width, matching the exact amount the page overflows horizontally (e.g. a
        wide table on /problems on mobile). Without this, scrolling right reveals
        plain background where the header should still be. When the page fits the
        screen, overflowWidth is 0 and nothing extra is rendered.
      */}
      {overflowWidth > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-full border-b border-border bg-surface"
          style={{ width: overflowWidth }}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              Leet<span className="text-accent">Proof</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-5">
            <Link
              href="/problems"
              className="text-sm font-medium text-foreground transition hover:text-accent"
            >
              Problems
            </Link>


            {/* Auth */}
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-hover" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/users?id=${user.id}`}
                  className="flex items-center gap-2 rounded-md px-1 py-1 transition hover:bg-hover"
                >
                  <ProfileAvatar
                    profile={
                      profile ?? {
                        id: user.id,
                        email: user.email ?? null,
                        full_name: user.user_metadata?.full_name ?? null,
                      }
                    }
                    size="md"
                  />
                  <span className="hidden max-w-36 truncate text-sm text-foreground sm:inline">
                    {getProfileDisplayName(
                      profile ?? {
                        email: user.email ?? null,
                        full_name: user.user_metadata?.full_name ?? null,
                      }
                    )}
                  </span>
                </Link>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
                >
                  Sign In
                </button>

                {/* Sign-in modal */}
                {showSignIn && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div ref={modalRef} className="w-full max-w-md px-4">
                      <AuthPanel onSuccess={() => setShowSignIn(false)} />
                      <button
                        onClick={() => setShowSignIn(false)}
                        className="mt-4 w-full rounded-md bg-surface/90 px-4 py-2 text-center text-sm text-muted transition hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            <SettingsMenu />

          </div>
        </div>
      </div>
    </nav>
  );
}
