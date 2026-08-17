export default function SiteFooter({ text }: { text: string }) {
  return (
    <footer className="px-4 sm:px-6 py-8 border-t border-border text-center text-sm text-text-secondary">
      {text}
    </footer>
  );
}
