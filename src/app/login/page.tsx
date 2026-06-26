import AuthPanel from "@/components/AuthPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - LeetProof",
  description: "Sign in or create a LeetProof account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-start justify-center px-4 py-12 sm:px-6">
      <AuthPanel />
    </div>
  );
}