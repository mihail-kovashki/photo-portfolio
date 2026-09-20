"use client";

import { LayoutGrid, GalleryVerticalEnd } from "lucide-react";

interface SeriesFilterProps {
  activeSeries: string;
  onSelectSeries: (id: string) => void;
  activeRecipe: string;
  onSelectRecipe: (recipe: string) => void;
  recipes: string[];
  counts: { all: number; hokkaido: number; korea: number };
  layoutMode: "masonry" | "story";
  onToggleLayout: (mode: "masonry" | "story") => void;
}

export function SeriesFilter({
  activeSeries,
  onSelectSeries,
  activeRecipe,
  onSelectRecipe,
  recipes,
  counts,
  layoutMode,
  onToggleLayout,
}: SeriesFilterProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        {/* Series Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectSeries("all")}
            className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              activeSeries === "all"
                ? "bg-white text-zinc-950 font-semibold shadow-md"
                : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            <span>All Works</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeSeries === "all" ? "bg-zinc-200 text-zinc-900" : "bg-white/10 text-zinc-400"
            }`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => onSelectSeries("hokkaido")}
            className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              activeSeries === "hokkaido"
                ? "bg-white text-zinc-950 font-semibold shadow-md"
                : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            <span>Hokkaido 2025</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeSeries === "hokkaido" ? "bg-zinc-200 text-zinc-900" : "bg-white/10 text-zinc-400"
            }`}>
              {counts.hokkaido}
            </span>
          </button>

          <button
            onClick={() => onSelectSeries("korea")}
            className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              activeSeries === "korea"
                ? "bg-white text-zinc-950 font-semibold shadow-md"
                : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            <span>Korea 2025</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeSeries === "korea" ? "bg-zinc-200 text-zinc-900" : "bg-white/10 text-zinc-400"
            }`}>
              {counts.korea}
            </span>
          </button>
        </div>

        {/* View Mode & Film Recipe Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Film Recipe Pill Dropdown / Selector */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500 hidden sm:inline">Recipe:</span>
            <select
              value={activeRecipe}
              onChange={(e) => onSelectRecipe(e.target.value)}
              className="bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/30 cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">All Recipes</option>
              {recipes.map((r) => (
                <option key={r} value={r} className="bg-zinc-900 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Layout Mode Switcher */}
          <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => onToggleLayout("masonry")}
              title="Masonry Gallery"
              className={`p-1.5 rounded-md transition-colors ${
                layoutMode === "masonry"
                  ? "bg-white/15 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleLayout("story")}
              title="Editorial Story Flow"
              className={`p-1.5 rounded-md transition-colors ${
                layoutMode === "story"
                  ? "bg-white/15 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <GalleryVerticalEnd className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
