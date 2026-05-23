"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadSavedVersion, saveVersion, type LeanVersion } from "@/lib/lean-versions";

const Lean4EditorInner = dynamic(() => import("./Lean4EditorInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-lg border border-border bg-background">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-accent" />
        <span className="text-sm text-muted">Loading editor...</span>
      </div>
    </div>
  ),
});

interface Lean4EditorProps {
  code?: string;
  problemId?: string;
  problemSlug?: string;
  mainTheoremName?: string;
  theoremType?: string;
  allowedAxioms?: string[];
}

/**
 * Lean 4 editor powered by lean4monaco (same engine as lean4web).
 * Connects to the remote Lean server at live.lean-lang.org via WebSocket.
 * Code is persisted per-problem in localStorage.
 */
export default function Lean4Editor({ code, problemId, problemSlug, mainTheoremName, theoremType, allowedAxioms }: Lean4EditorProps) {
  const [version, setVersion] = useState<LeanVersion>(() => loadSavedVersion());
  const pendingCodeRef = useRef<string | null>(null);

  const handleVersionChange = useCallback((newVersion: LeanVersion) => {
    saveVersion(newVersion);
    setVersion(newVersion);
  }, []);

  useEffect(() => {
    const handleLoadCode = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.version && detail.version !== version) {
        pendingCodeRef.current = detail.code;
        saveVersion(detail.version);
        setVersion(detail.version);
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('leetproof:load-code', handleLoadCode);
    return () => window.removeEventListener('leetproof:load-code', handleLoadCode);
  }, [version]);

  const pendingCode = pendingCodeRef.current;
  if (pendingCode !== null) {
    pendingCodeRef.current = null;
  }

  return (
    <Lean4EditorInner
      key={`${problemId || problemSlug}:${version}`}
      code={code}
      problemId={problemId}
      problemSlug={problemSlug}
      mainTheoremName={mainTheoremName}
      theoremType={theoremType}
      allowedAxioms={allowedAxioms}
      version={version}
      onVersionChange={handleVersionChange}
      pendingCode={pendingCode}
    />
  );
}
