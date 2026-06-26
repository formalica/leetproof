"use client";

import ProfileAvatar from "@/components/ProfileAvatar";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { Difficulty, Profile } from "@/lib/types";
import {
  emptyDifficultyStats,
  getProfileDisplayName,
  getPublicEmail,
  isValidUsername,
  normalizeUsername,
  type DifficultyStat,
} from "@/lib/profile";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UserProfileClientProps {
  userId: string;
}

type EditableProfile = Pick<
  Profile,
  "id" | "username" | "email" | "auth_email" | "full_name" | "avatar_url" | "created_at" | "updated_at"
>;

type ProfileUpdate = Partial<Pick<Profile, "username" | "email" | "auth_email" | "full_name" | "avatar_url">>;

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const difficultyBarClasses: Record<Difficulty, string> = {
  easy: "bg-accent",
  medium: "bg-[var(--badge-warning-text)]",
  hard: "bg-[var(--badge-danger-text)]",
};

function normalizeStats(rows: DifficultyStat[]) {
  const byDifficulty = new Map(rows.map((row) => [row.difficulty, row]));
  return emptyDifficultyStats().map((row) => byDifficulty.get(row.difficulty) ?? row);
}

export default function UserProfileClient({ userId }: UserProfileClientProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EditableProfile | null>(null);
  const [stats, setStats] = useState<DifficultyStat[]>(emptyDifficultyStats());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const isOwner = user?.id === userId;

  const fetchStatsFallback = useCallback(async () => {
    const supabase = createClient();
    const { data: problemsData } = await supabase.from("problems").select("id, difficulty");
    const problemRows = (problemsData ?? []) as { id: string; difficulty: Difficulty }[];
    const solvedProblemIds = new Set<string>();

    if (user?.id === userId) {
      const { data: submissionsData } = await supabase
        .from("submissions")
        .select("problem_id")
        .eq("user_id", userId)
        .eq("status", "accepted");

      for (const row of submissionsData ?? []) {
        solvedProblemIds.add(row.problem_id);
      }
    }

    return emptyDifficultyStats().map((stat) => {
      const problemsForDifficulty = problemRows.filter((problem) => problem.difficulty === stat.difficulty);
      return {
        difficulty: stat.difficulty,
        total_count: problemsForDifficulty.length,
        solved_count: problemsForDifficulty.filter((problem) => solvedProblemIds.has(problem.id)).length,
      };
    });
  }, [user?.id, userId]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, email, auth_email, full_name, avatar_url, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || !profileData) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const nextProfile = profileData as EditableProfile;
    setProfile(nextProfile);
    setUsername(nextProfile.username ?? "");
    setEmail(getPublicEmail(nextProfile.email) ?? "");
    setAvatarUrl(nextProfile.avatar_url ?? "");

    const { data: statsData, error: statsError } = await supabase.rpc("get_user_difficulty_stats", {
      profile_user_id: userId,
    });

    if (!statsError && statsData) {
      setStats(
        normalizeStats(
          (statsData as { difficulty: Difficulty; total_count: number; solved_count: number }[]).map((row) => ({
            difficulty: row.difficulty,
            total_count: Number(row.total_count),
            solved_count: Number(row.solved_count),
          }))
        )
      );
    } else {
      setStats(await fetchStatsFallback());
    }

    setLoading(false);
  }, [fetchStatsFallback, userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const totalProblems = useMemo(
    () => stats.reduce((sum, row) => sum + row.total_count, 0),
    [stats]
  );
  const solvedProblems = useMemo(
    () => stats.reduce((sum, row) => sum + row.solved_count, 0),
    [stats]
  );
  const maxTotal = Math.max(1, ...stats.map((row) => row.total_count));

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !isOwner) return;

    const nextUsername = normalizeUsername(username);
    if (!isValidUsername(nextUsername)) {
      setStatus({
        type: "error",
        text: "Username must be 3-40 characters and can use letters, numbers, dot, underscore, and hyphen.",
      });
      return;
    }

    setSaving(true);
    setStatus(null);
    const supabase = createClient();
    const nextEmail = email.trim() || null;
    const updates: ProfileUpdate = {
      username: nextUsername,
      full_name: nextUsername,
      avatar_url: avatarUrl.trim() || null,
      email: nextEmail,
    };

    try {
      if (nextEmail && nextEmail !== getPublicEmail(profile.email)) {
        const { data: updateData, error: updateError } = await supabase.auth.updateUser({ email: nextEmail });
        if (updateError) throw updateError;
        if (updateData.user?.email === nextEmail) {
          updates.auth_email = nextEmail;
        }
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (profileError) throw profileError;
      setStatus({ type: "success", text: "Profile updated." });
      await fetchProfile();
    } catch (error) {
      setStatus({ type: "error", text: error instanceof Error ? error.message : String(error) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-sm text-muted">User not found.</p>;
  }

  const displayName = getProfileDisplayName(profile);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="border-b border-border pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ProfileAvatar profile={profile} size="xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
            <p className="mt-1 text-sm text-muted">/{profile.id}</p>
            {getPublicEmail(profile.email) && (
              <p className="mt-2 text-sm text-muted">{getPublicEmail(profile.email)}</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Progress</h2>
              <p className="mt-1 text-sm text-muted">
                {solvedProblems} solved out of {totalProblems} problems
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {stats.map((row) => {
              const totalWidth = `${(row.total_count / maxTotal) * 100}%`;
              const solvedWidth = row.total_count > 0 ? `${(row.solved_count / row.total_count) * 100}%` : "0%";
              return (
                <div key={row.difficulty} className="grid gap-2 sm:grid-cols-[5rem_minmax(0,1fr)_5rem] sm:items-center">
                  <span className="text-sm font-medium text-foreground">{difficultyLabels[row.difficulty]}</span>
                  <div className="h-8 rounded-md bg-hover p-1" style={{ width: totalWidth, minWidth: row.total_count > 0 ? "4rem" : "0" }}>
                    <div className={`h-full rounded ${difficultyBarClasses[row.difficulty]}`} style={{ width: solvedWidth }} />
                  </div>
                  <span className="text-sm tabular-nums text-muted sm:text-right">
                    {row.solved_count}/{row.total_count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-surface/50 p-5">
          {isOwner ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Profile settings</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="profile-username">
                  Username
                </label>
                <input
                  id="profile-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="profile-email">
                  Email
                </label>
                <input
                  id="profile-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="profile-avatar">
                  Avatar URL
                </label>
                <input
                  id="profile-avatar"
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  type="url"
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              {status && (
                <p className={`rounded-md border px-3 py-2 text-sm ${status.type === "success" ? "badge-success" : "badge-danger"}`}>
                  {status.text}
                </p>
              )}
            </form>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted">Username</dt>
                  <dd className="text-foreground">{displayName}</dd>
                </div>
                {getPublicEmail(profile.email) && (
                  <div>
                    <dt className="text-muted">Email</dt>
                    <dd className="text-foreground">{getPublicEmail(profile.email)}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}