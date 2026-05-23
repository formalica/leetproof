"use client";

import { useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
// @ts-expect-error - no types available for highlightjs-lean
import lean from "highlightjs-lean";

hljs.registerLanguage("lean", lean);

interface LeanCodeBlockProps {
  code: string;
  /** When true, renders without the outer border container (used inside markdown) */
  inline?: boolean;
}

export default function LeanCodeBlock({ code, inline }: LeanCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const highlighted = useMemo(() => {
    try {
      return hljs.highlight(code, { language: "lean" }).value;
    } catch {
      return null;
    }
  }, [code]);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const content = (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={handleCopy}
        className={`absolute top-1 right-1 z-10 rounded bg-zinc-700 hover:bg-zinc-600 px-1.5 py-0.5 text-[10px] text-zinc-300 transition-opacity ${hovered || copied ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="lean-code-block m-0">
        {highlighted ? (
          <code className="language-lean" dangerouslySetInnerHTML={{ __html: highlighted }} />
        ) : (
          <code className="language-lean">{code}</code>
        )}
      </pre>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="lean-code-wrapper rounded-md border border-border p-3 overflow-x-auto">
      {content}
    </div>
  );
}
