"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Aperture, Layers, Cpu } from "lucide-react";

interface GearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GearModal({ isOpen, onClose }: GearModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-[#121215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#d93829]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white tracking-tight">Camera & Craft</h3>
                <p className="text-xs font-mono text-zinc-400">The Fujifilm X-System Setup</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-6 space-y-6 text-sm text-zinc-300">
            {/* Primary Hardware */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#d93829] mb-1.5 uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera Body</span>
                </div>
                <h4 className="text-base font-semibold text-white font-mono">Fujifilm X-T5</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  40.2 MP X-Trans CMOS 5 HR sensor with classic tactile dials for ISO, shutter speed, and exposure compensation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#e59866] mb-1.5 uppercase tracking-wider">
                  <Aperture className="w-3.5 h-3.5" />
                  <span>Fast Prime</span>
                </div>
                <h4 className="text-base font-semibold text-white font-mono">XF 23mm F1.4</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  35mm equivalent linear-motor prime. Exceptional microcontrast and smooth rendering at ƒ/1.4.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#e59866] mb-1.5 uppercase tracking-wider">
                  <Aperture className="w-3.5 h-3.5" />
                  <span>Telephoto Zoom</span>
                </div>
                <h4 className="text-base font-semibold text-white font-mono">XF 70-300mm OIS</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  105-450mm equivalent range with optical stabilization for landscape compression and distant detail.
                </p>
              </div>
            </div>

            {/* Workflow & Philosophy */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-zinc-300" />
                <span>Color Craft & Editing</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                Photographs are captured in RAW, leaning into available ambient light and natural tonal gradients. The color grading is developed in Lightroom Classic on the foundation of Fujifilm&apos;s Reala Ace profile for faithful, nuanced color rendering.
              </p>
            </div>

            {/* Software Engineer Note */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-200">Engineer&apos;s Web Architecture:</span> Built with Next.js App Router, zero-cost edge hosting, automatic responsive image sizing, and instant base64 blur-up previews to eliminate layout shift (CLS = 0).
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-mono bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
