/* eslint-disable @next/next/no-img-element */
import {
  getGeneratedAvatarBackground,
  getProfileDisplayName,
  getProfileInitials,
  type ProfileLike,
} from "@/lib/profile";

interface ProfileAvatarProps {
  profile: ProfileLike | null | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export default function ProfileAvatar({
  profile,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  const displayName = getProfileDisplayName(profile);
  const classes = `${sizeClasses[size]} shrink-0 rounded-full border border-border object-cover ${className}`;

  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={displayName}
        className={classes}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${classes} flex items-center justify-center font-semibold text-white shadow-inner`}
      style={{ background: getGeneratedAvatarBackground(displayName) }}
      aria-label={displayName}
      role="img"
    >
      {getProfileInitials(displayName)}
    </div>
  );
}