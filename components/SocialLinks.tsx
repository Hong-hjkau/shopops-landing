import { Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/brand";

function FacebookIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M14 8.5V7c0-.8.5-1 1-1h2V2.5h-2.8C11.5 2.5 10 4.1 10 7v1.5H7v4h3V22h4v-9.5h3l.5-4H14Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SocialLinks({
  dark = false,
  compact = false,
}: {
  dark?: boolean;
  compact?: boolean;
}) {
  const linkClass = `inline-flex items-center justify-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    compact ? "h-8 w-8" : "h-11 w-11"
  } ${
    dark
      ? "border-white/30 text-gray-300 hover:border-white/60 hover:text-white"
      : "border-border text-text-secondary hover:border-text-secondary hover:text-text"
  }`;
  const iconClass = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className={`flex items-center justify-center ${compact ? "gap-1" : "gap-3"}`}
      aria-label="ShopOps contact links"
    >
      <a href={SOCIAL_LINKS.email} aria-label="Email ShopOps" className={linkClass}>
        <Mail aria-hidden="true" className={iconClass} />
      </a>
      <a
        href={SOCIAL_LINKS.facebook}
        aria-label="ShopOps on Facebook"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <FacebookIcon className={iconClass} />
      </a>
      <a
        href={SOCIAL_LINKS.instagram}
        aria-label="ShopOps on Instagram"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <InstagramIcon className={iconClass} />
      </a>
    </div>
  );
}
