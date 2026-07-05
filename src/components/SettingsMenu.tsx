"use client";

import { useEffect, useRef, useState } from "react";

const DISCORD_URL = "https://discord.gg/WE9yATM5h";
const GITHUB_ISSUES_URL = "https://github.com/nnarek/leetproof/issues/new";
const GITHUB_CONTRIBUTE_URL =
  "https://github.com/nnarek/leetproof/tree/main/problems";
const LEAN_LEARN_URL = "https://lean-lang.org/learn/";

// Placeholder address — more donation options will be added later.
const BTC_ADDRESS = "1MgrnRwtB5j854wBEf5d52gYHyrt8RGL4o";
const ETH_ADDRESS = "0x64966CD7742845aE2c7017F06B3a283A4801fbDe";
const GITHUB_SPONSORS_URL = "https://github.com/sponsors/formalica";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [copied, setCopied] = useState<"btc" | "eth" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const donateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    setMounted(true);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close menu on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Close donate modal on click outside / Escape
  useEffect(() => {
    if (!showDonate) return;
    function handleClick(e: MouseEvent) {
      if (donateRef.current && !donateRef.current.contains(e.target as Node)) {
        setShowDonate(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDonate(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showDonate]);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("leetproof-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("leetproof-theme");
    }
  };

  const handleCopyAddress = async (address: string, key: "btc" | "eth") => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard API unavailable — ignore.
    }
  };

  const menuItemClass =
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-foreground transition hover:bg-hover";

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Settings"
          aria-haspopup="menu"
          aria-expanded={open}
          className="rounded-lg p-1.5 text-muted transition hover:bg-hover hover:text-foreground"
        >
          {/* Horizontal sliders / settings icon */}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-surface py-1.5 shadow-xl"
          >
            <button onClick={toggleTheme} className={menuItemClass} role="menuitem">
              {mounted && isLight ? (
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span>{mounted && isLight ? "Light mode" : "Dark mode"}</span>
            </button>

            <div className="my-1.5 border-t border-border" />

            <a
              href={LEAN_LEARN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={menuItemClass}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m0-7L3 9m9 5l9-5" />
              </svg>
              <span>Learn Lean 4</span>
            </a>

            <a
              href={GITHUB_CONTRIBUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={menuItemClass}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m6-3l-4.5 16.5" />
              </svg>
              <span>Contribute</span>
            </a>

            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={menuItemClass}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.522 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              <span>Join Discord</span>
            </a>

            <a
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={menuItemClass}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Report Issue</span>
            </a>

            <div className="my-1.5 border-t border-border" />

            <button
              onClick={() => {
                setOpen(false);
                setShowDonate(true);
              }}
              className={menuItemClass}
              role="menuitem"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 9v1m0-9c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Donate</span>
            </button>
          </div>
        )}
      </div>

      {/* Donate modal */}
      {showDonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div ref={donateRef} className="w-full max-w-lg px-4">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Support LeetProof</h2>
                <button
                  onClick={() => setShowDonate(false)}
                  aria-label="Close"
                  className="rounded-md p-1 text-muted transition hover:bg-hover hover:text-foreground"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mb-4 text-sm text-muted">
                If you've found LeetProof helpful, please consider making a contribution to support its upkeep and the development of new features.
              </p>

              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
                  GitHub 
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                    Sponsor Formalica's LeetProof project
                  </span>
                  <iframe
                    src={`${GITHUB_SPONSORS_URL}/button`}
                    title="Sponsor formalica"
                    height="32"
                    width="114"
                    className="shrink-0 rounded-md"
                    style={{ border: 0, borderRadius: 10, filter: "sepia(1) hue-rotate(180deg) saturate(3) brightness(0.9)" }}
                  ></iframe>
                </div>
              </div>

              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
                BTC
              </label>
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
                <code className="min-w-0 flex-1 truncate text-xs text-foreground">
                  {BTC_ADDRESS}
                </code>
                <button
                  onClick={() => handleCopyAddress(BTC_ADDRESS, "btc")}
                  className="shrink-0 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white transition hover:bg-accent/90"
                >
                  {copied === "btc" ? "Copied!" : "Copy"}
                </button>
              </div>

              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
                ETH 
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
                <code className="min-w-0 flex-1 truncate text-xs text-foreground">
                  {ETH_ADDRESS}
                </code>
                <button
                  onClick={() => handleCopyAddress(ETH_ADDRESS, "eth")}
                  className="shrink-0 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white transition hover:bg-accent/90"
                >
                  {copied === "eth" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
