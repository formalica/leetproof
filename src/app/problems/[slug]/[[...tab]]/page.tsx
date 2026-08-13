import { getServerDatabase } from "@/lib/db/server";
import { Problem } from "@/lib/types";
import { notFound } from "next/navigation";
import Lean4Editor from "@/components/Lean4Editor";
import ResizableProblemLayout from "@/components/ResizableProblemLayout";
import ProblemTabs from "@/components/ProblemTabs";
import type { Metadata } from "next";
import logo from "../../../logo.png";

// In static-export mode revalidate is ignored (pages are built once).
// In server mode this enables ISR every 60 s.
export const revalidate = 60;

interface ProblemPageProps {
  params: Promise<{ slug: string; tab?: string[] }>;
}

// Strips markdown syntax down to plain text and truncates at a word boundary
// so social previews (Twitter/x.com, Teams, Slack, etc.) show clean text.
function toPreviewDescription(markdown: string, maxLength = 160): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links
    .replace(/^#+\s+/gm, "") // headings
    .replace(/[*_>#-]/g, "") // remaining markdown markers
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  const truncated = plain.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_LEETPROOF_SERVERLESS !== "true") return [];
  const db = await getServerDatabase();
  const { problems } = await db.getProblems({ limit: 10000 });
  // For each problem, generate the base route (no tab segments).
  // Tab sub-routes (solutions, submissions) use client-side replaceState.
  return problems.flatMap((p) => [
    { slug: p.slug, tab: [] },
    { slug: p.slug, tab: ["solutions"] },
    { slug: p.slug, tab: ["submissions"] },
    { slug: p.slug, tab: ["hints"] },
  ]);
}

export async function generateMetadata({
  params,
}: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = await getServerDatabase();
  const problem = await db.getProblemBySlug(slug);

  if (!problem) {
    return {
      title: "Problem Not Found - LeetProof",
    };
  }

  const title = `${problem.title} - LeetProof`;
  const description = problem.description
    ? toPreviewDescription(problem.description)
    : "Solve a Lean 4 theorem proving problem";
  const url = `/problems/${problem.slug}`;
  const images = [
    {
      url: logo.src,
      width: logo.width,
      height: logo.height,
      alt: "LeetProof",
    },
  ];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "LeetProof",
      images,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images,
    },
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug, tab } = await params;
  const db = await getServerDatabase();
  const problem = await db.getProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  const p = problem as Problem;

  // Parse tab segments: [] = description, ["solutions"] = solutions,
  // ["submissions"] = submissions
  const tabSegments = tab || [];
  const initialTab = (tabSegments[0] === "solutions" || tabSegments[0] === "submissions" || tabSegments[0] === "hints")
    ? tabSegments[0]
    : "description";

  return (
    <div className="flex flex-1 min-h-0 w-full p-[1px]">
      <ResizableProblemLayout
        left={
          <ProblemTabs
            problem={p}
            initialTab={initialTab}
          />
        }
        right={
          <div className="h-full min-h-0 w-full">
            <Lean4Editor
              code={p.starter_code}
              problemId={p.id}
              problemSlug={p.slug}
              verifierCode={p.verifier_code ?? undefined}
            />
          </div>
        }
      />
    </div>
  );
}
