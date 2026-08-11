"use client";

import { Avatar3D } from "./Avatar3D";

type UserAvatarProps = {
  src?: string;
  size?: number;
  className?: string;
  seed?: string;
};

/**
 * UserAvatar: Shows an uploaded image if src starts with data: or http,
 * otherwise falls back to Avatar3D with a seed.
 */
export function UserAvatar({ src, size = 40, className = "", seed }: UserAvatarProps) {
  const isCustomImage = src && (src.startsWith("data:") || src.startsWith("http"));

  if (isCustomImage) {
    return (
      <div 
        className={`relative overflow-hidden rounded-full border border-edu-border bg-edu-surface1 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* User-provided URLs cannot use the app's fixed next/image host allowlist. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src} 
          alt="User Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <Avatar3D 
      seed={seed || src || "anonymous"} 
      size={size} 
      className={className} 
    />
  );
}
