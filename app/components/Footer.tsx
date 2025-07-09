import { Rocket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex gap-4 flex-wrap items-center justify-center py-4">
      <span className="flex items-center">Ad Astra ✨</span>
      <a
        href="https://github.com/tevariou/atb"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
        aria-label="View source code on GitHub"
      >
        <Rocket className="w-5 h-5" />
      </a>
    </footer>
  );
}
