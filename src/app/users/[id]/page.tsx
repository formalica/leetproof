import UserProfileClient from "@/components/UserProfileClient";
import type { Metadata } from "next";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "User Profile - LeetProof",
  description: "View LeetProof profile and progress.",
};

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_LEETPROOF_SERVERLESS !== "true") return [];

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase.from("profiles").select("id");
  const profileIds = (data ?? []).map((profile) => ({ id: profile.id as string }));

  return profileIds.length > 0 ? profileIds : [{ id: "__placeholder__" }];
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  return <UserProfileClient userId={id} />;
}