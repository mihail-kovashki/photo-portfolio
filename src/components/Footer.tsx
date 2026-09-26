"use client";

import { ArrowUp, Instagram, Mail } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full pt-6 pb-10 sm:py-12 border-t border-white/5 bg-[#09090b] text-zinc-500 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile Layout (< sm): Clean, Centered Editorial Colophon */}
        <div className="flex flex-col items-center text-center gap-5 sm:hidden">
          {/* Interactive Actions Row */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <a
              href="https://www.instagram.com/mi_ko.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-zinc-400" />
              <span>@mi_ko.jpg</span>
            </a>
            <a
              href="mailto:mihail.kovashki@proton.me"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Get in touch via Proton Mail"
            >
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Email</span>
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Scroll to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Camera System Badge with Signature Red Accent Dot */}
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#d93829] shadow-[0_0_8px_rgba(217,56,41,0.6)]" />
            <span>FUJIFILM X-T5 · Fujinon Optics</span>
          </div>

          {/* Balanced Colophon / Copyright */}
          <p className="text-[11px] text-zinc-500 tracking-wide leading-relaxed">
            © {new Date().getFullYear()} Mihail Kovashki (MiKo)
            <br />
            <span className="text-zinc-600">All photographs original.</span>
          </p>
        </div>

        {/* Desktop Layout (>= sm): 3-Column Editorial Bar */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          {/* Left: Copyright */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d93829] shadow-[0_0_8px_rgba(217,56,41,0.6)]" />
            <span>© {new Date().getFullYear()} Mihail Kovashki (MiKo). All photographs original.</span>
          </div>

          {/* Center: Social & Contact */}
          <div className="flex items-center justify-center gap-4 text-zinc-400">
            <a
              href="https://www.instagram.com/mi_ko.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors group"
            >
              <Instagram className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#e1306c] transition-colors" />
              <span>@mi_ko.jpg</span>
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href="mailto:mihail.kovashki@proton.me"
              className="flex items-center gap-1.5 hover:text-white transition-colors group"
              title="Get in touch via Proton Mail"
            >
              <Mail className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#6d4aff] transition-colors" />
              <span>mihail.kovashki@proton.me</span>
            </a>
            <span className="hidden lg:inline text-zinc-700">·</span>
            <span className="hidden lg:inline text-zinc-500">FUJIFILM X-T5</span>
          </div>

          {/* Right: Scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
