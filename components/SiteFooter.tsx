import SocialLinks from "@/components/SocialLinks";

export default function SiteFooter({ text }: { text: string }) {
  return (
    <footer className="px-4 sm:px-6 py-8 border-t border-border text-center text-sm text-text-secondary">
      <div className="flex flex-col items-center gap-4">
        <SocialLinks />
        <span>{text}</span>
      </div>
    </footer>
  );
}
