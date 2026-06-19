export default function SiteFooter({ text }: { text: string }) {
  return (
    <footer className="px-4 sm:px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-500">
      {text}
    </footer>
  );
}
