"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const LeanCodeBlock = dynamic(() => import("@/components/LeanCodeBlock"), { ssr: false });

interface MarkdownRendererProps {
  content: string;
}

const katexOptions = { output: "html" } as const;

function DetailsBlock({ children }: React.HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = useState(false);

  const kids = React.Children.toArray(children).filter(
    (c) => typeof c !== "string" || c.trim() !== ""
  );
  // First child is the rendered <summary> content (just its text/nodes)
  const summaryContent = kids[0];
  const body = kids.slice(1);

  return (
    <div className="">
      <button
        onClick={() => setOpen((o) => !o)}
        className="group w-full flex items-center gap-1.5 px-0 py-2 text-left select-none cursor-pointer"
      >
        <svg
          className={`w-4 h-4 text-muted shrink-0 transition-transform duration-150 ${open ? "rotate-0" : "-rotate-90"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-muted text-sm group-hover:text-foreground">{summaryContent}</span>
      </button>
      {open && (
        <div className="pl-5">
          {body}
        </div>
      )}
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content prose prose-invert prose-zinc max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-[#a4b8c5] prose-strong:text-zinc-100 prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#a4b8c5] prose-li:text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, [rehypeKatex, katexOptions]]}
        components={{
          details: DetailsBlock as any,
          summary: ({ children }) => <>{children}</>,
          pre({ children }) {
            const child = children as any;
            if (child?.props?.className) {
              const match = /language-(\w+)/.exec(child.props.className || "");
              const lang = match?.[1];
              const codeStr = String(child.props.children).replace(/\n$/, "");
              if (lang === "lean" || lang === "lean4") {
                return <LeanCodeBlock code={codeStr} />;
              }
            }
            return <pre>{children}</pre>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
