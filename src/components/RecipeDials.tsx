import type { RecipeDetails } from "@/data/photos";

// A recipe drawn as Fujifilm-style dials: each setting is a knurled dial turned so its
// value sits under a fixed index mark, the way you'd set it on the camera. Values print
// around the dial and turn with it. On arrival the dials turn from their neutral stop to
// the recipe's setting, once (.dial-turn in globals.css, off under reduced motion).
// Drawn on the server: the final positions are in the HTML, the turn is CSS only.

const MINUS = "−";
const AMBER = "#e59866";

interface Stop {
  /** Printed on the dial; stops without one draw as a short tick (the half steps). */
  label?: string;
}

interface DialProps {
  name: string;
  /** The value as words under the dial: "Strong, Large". */
  readout: string;
  stops: Stop[];
  /** Index into stops of the recipe's setting. */
  selected: number;
  /** Index the dial starts its turn from: the neutral stop. */
  rest: number;
  /** Degrees between stops. */
  step: number;
  /** Label size in dial units (the dial is 120 across). */
  fontSize?: number;
  order: number;
}

function polar(r: number, deg: number): [number, number] {
  // Rounded, so the server and the browser print the same numbers (hydration)
  const a = (deg * Math.PI) / 180;
  const round = (n: number) => Math.round(n * 100) / 100;
  return [round(60 + r * Math.sin(a)), round(60 - r * Math.cos(a))];
}

const KNURL = Array.from({ length: 90 }, (_, i) => i * 4);

function Dial({ name, readout, stops, selected, rest, step, fontSize = 10.5, order }: DialProps) {
  const turn = -selected * step;
  const from = -rest * step;
  return (
    <figure className="flex flex-col items-center gap-2 rounded-xl bg-[#121215] border border-white/10 px-2 pt-4 pb-3">
      <svg viewBox="0 0 120 120" className="w-full max-w-[160px] aspect-square" role="img" aria-label={`${name}: ${readout}`}>
        {/* Index mark: fixed, the dial turns under it */}
        <path d="M55.5 1.5 H64.5 L60 8 Z" fill={AMBER} />
        <g
          className="dial-turn"
          style={
            {
              transform: `rotate(${turn}deg)`,
              transformOrigin: "60px 60px",
              transformBox: "view-box",
              "--dial-from": `${from}deg`,
              "--dial-delay": `${order * 70}ms`,
            } as React.CSSProperties
          }
        >
          <circle cx="60" cy="60" r="50" fill="#16161a" stroke="rgba(255,255,255,0.14)" />
          {KNURL.map((deg) => {
            const [x1, y1] = polar(46.5, deg);
            const [x2, y2] = polar(50, deg);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.09)" strokeWidth="0.8" />;
          })}
          {stops.map((stop, i) => {
            const deg = i * step;
            const isOn = i === selected;
            // A half step is a bare tick, unless it's the setting: then it prints too
            const label = stop.label ?? (isOn ? readout : undefined);
            if (!label) {
              const [x1, y1] = polar(39, deg);
              const [x2, y2] = polar(43, deg);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isOn ? AMBER : "rgba(255,255,255,0.3)"} strokeWidth="1.2" />;
            }
            const [x, y] = polar(36, deg);
            const [tx1, ty1] = polar(42, deg);
            const [tx2, ty2] = polar(45, deg);
            return (
              <g key={i}>
                <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={isOn ? AMBER : "rgba(255,255,255,0.35)"} strokeWidth="1.2" />
                <text
                  x={x}
                  y={y}
                  transform={`rotate(${deg} ${x} ${y})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  className="font-mono"
                  fill={isOn ? "#fafafa" : "#71717a"}
                  fontWeight={isOn ? 600 : 400}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>
        <circle cx="60" cy="60" r="22" fill="url(#dial-cap)" stroke="rgba(255,255,255,0.08)" />
      </svg>
      <figcaption className="text-center leading-tight">
        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{name}</span>
        <span className="block font-mono text-sm text-zinc-100 mt-0.5">{readout}</span>
      </figcaption>
    </figure>
  );
}

/** The Fujifilm white balance shift grid: red to the right, blue up, −9 to +9 each. */
function WbShift({ kelvin, shift, order }: { kelvin?: string; shift: number[]; order: number }) {
  const [r, b] = shift;
  const cell = 80 / 18;
  const x = Math.round((60 + r * cell) * 100) / 100;
  const y = Math.round((60 - b * cell) * 100) / 100;
  const sign = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${-n}` : "0");
  const readout = [kelvin, `R ${sign(r)} B ${sign(b)}`].filter(Boolean).join(" · ");
  return (
    <figure className="flex flex-col items-center gap-2 rounded-xl bg-[#121215] border border-white/10 px-2 pt-4 pb-3">
      <svg viewBox="0 0 120 120" className="w-full max-w-[160px] aspect-square" role="img" aria-label={`White balance: ${readout}`}>
        <rect x="20" y="20" width="80" height="80" rx="3" fill="#16161a" stroke="rgba(255,255,255,0.14)" />
        {Array.from({ length: 19 }, (_, i) => {
          const p = Math.round((20 + i * cell) * 100) / 100;
          const major = i % 3 === 0;
          const stroke = i === 9 ? "rgba(255,255,255,0.28)" : major ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)";
          return (
            <g key={i}>
              <line x1={p} y1="20" x2={p} y2="100" stroke={stroke} strokeWidth="0.6" />
              <line x1="20" y1={p} x2="100" y2={p} stroke={stroke} strokeWidth="0.6" />
            </g>
          );
        })}
        <text x="60" y="13" textAnchor="middle" fontSize="9" className="font-mono" fill="#a1a1aa">B+</text>
        <text x="110" y="60" textAnchor="middle" dominantBaseline="central" fontSize="9" className="font-mono" fill="#a1a1aa">R+</text>
        <circle
          cx={x}
          cy={y}
          r="3.4"
          fill={AMBER}
          className="dial-drop"
          style={{ "--dial-delay": `${order * 70}ms` } as React.CSSProperties}
        />
      </svg>
      <figcaption className="text-center leading-tight">
        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">White balance</span>
        <span className="block font-mono text-sm text-zinc-100 mt-0.5">{readout}</span>
      </figcaption>
    </figure>
  );
}

// ---- Settings to stops ---------------------------------------------------------------

const SIMULATIONS: [string, string][] = [
  ["PV", "Provia"],
  ["VV", "Velvia"],
  ["AS", "Astia"],
  ["CC", "Classic Chrome"],
  ["RA", "Reala Ace"],
  ["NH", "Pro Neg Hi"],
  ["NS", "Pro Neg Std"],
  ["NC", "Classic Negative"],
  ["NN", "Nostalgic Neg"],
  ["ET", "Eterna"],
  ["EB", "Eterna Bleach Bypass"],
  ["AC", "Acros"],
  ["BW", "Monochrome"],
  ["SP", "Sepia"],
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

function simulationIndex(name: string): number {
  const n = norm(name);
  const i = SIMULATIONS.findIndex(([, full]) => n.startsWith(norm(full)) || norm(full).startsWith(n));
  return i < 0 ? 0 : i;
}

const signedLabel = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${-n}` : "0");

/** Whole and half stops from min to max; only whole numbers are printed. */
function numberStops(min: number, max: number, halves = false): { stops: Stop[]; indexOf: (v: number) => number } {
  const inc = halves ? 0.5 : 1;
  const stops: Stop[] = [];
  for (let v = min; v <= max; v += inc) stops.push({ label: Number.isInteger(v) ? signedLabel(v) : undefined });
  return { stops, indexOf: (v: number) => Math.round((v - min) / inc) };
}

const LEVELS = ["Off", "Weak", "Strong"];
const levelIndex = (v?: string) => Math.max(0, LEVELS.findIndex((l) => l.toLowerCase() === (v ?? "off").toLowerCase()));

const GRAIN: [string, string][] = [
  ["OFF", "Off"],
  ["W·S", "Weak, Small"],
  ["W·L", "Weak, Large"],
  ["S·S", "Strong, Small"],
  ["S·L", "Strong, Large"],
];

const DR = ["AUTO", "100", "200", "400"];

export function RecipeDials({ recipe }: { recipe: RecipeDetails }) {
  const tone = numberStops(-2, 4, true);
  const nine = numberStops(-4, 4);
  const clarity = numberStops(-5, 5);
  const signed = (v: number) => signedLabel(v);
  const kelvin = recipe.whiteBalance?.match(/^\S+/)?.[0];

  let order = 0;
  const dials: React.ReactNode[] = [];
  const push = (props: Omit<DialProps, "order">) => dials.push(<Dial key={props.name} {...props} order={order++} />);

  push({
    name: "Film simulation",
    readout: recipe.filmSimulation,
    stops: SIMULATIONS.map(([label]) => ({ label })),
    selected: simulationIndex(recipe.filmSimulation),
    rest: 0,
    step: 360 / SIMULATIONS.length,
    fontSize: 9.5,
  });
  if (recipe.wbShift) dials.push(<WbShift key="wb" kelvin={kelvin} shift={recipe.wbShift} order={order++} />);
  if (recipe.dynamicRange) {
    const dr = DR.indexOf(recipe.dynamicRange.replace(/^DR/i, "").toUpperCase());
    push({ name: "Dynamic range", readout: recipe.dynamicRange, stops: DR.map((label) => ({ label })), selected: Math.max(0, dr), rest: 1, step: 36, fontSize: 9.5 });
  }
  if (recipe.highlight !== undefined)
    push({ name: "Highlight", readout: signed(recipe.highlight), stops: tone.stops, selected: tone.indexOf(recipe.highlight), rest: tone.indexOf(0), step: 22 });
  if (recipe.shadow !== undefined)
    push({ name: "Shadow", readout: signed(recipe.shadow), stops: tone.stops, selected: tone.indexOf(recipe.shadow), rest: tone.indexOf(0), step: 22 });
  if (recipe.color !== undefined)
    push({ name: "Color", readout: signed(recipe.color), stops: nine.stops, selected: nine.indexOf(recipe.color), rest: nine.indexOf(0), step: 28 });
  if (recipe.grainEffect) {
    const g = GRAIN.findIndex(([, full]) => full.toLowerCase() === recipe.grainEffect!.toLowerCase());
    push({ name: "Grain", readout: recipe.grainEffect, stops: GRAIN.map(([label]) => ({ label })), selected: Math.max(0, g), rest: 0, step: 34, fontSize: 9.5 });
  }
  if (recipe.colorChromeEffect)
    push({ name: "Color chrome", readout: recipe.colorChromeEffect, stops: LEVELS.map((l) => ({ label: l.toUpperCase() })), selected: levelIndex(recipe.colorChromeEffect), rest: 0, step: 48, fontSize: 9.5 });
  if (recipe.colorChromeFXBlue)
    push({ name: "Chrome FX blue", readout: recipe.colorChromeFXBlue, stops: LEVELS.map((l) => ({ label: l.toUpperCase() })), selected: levelIndex(recipe.colorChromeFXBlue), rest: 0, step: 48, fontSize: 9.5 });
  if (recipe.clarity !== undefined)
    push({ name: "Clarity", readout: signed(recipe.clarity), stops: clarity.stops, selected: clarity.indexOf(recipe.clarity), rest: clarity.indexOf(0), step: 26 });
  if (recipe.sharpening !== undefined)
    push({ name: "Sharpness", readout: signed(recipe.sharpening), stops: nine.stops, selected: nine.indexOf(recipe.sharpening), rest: nine.indexOf(0), step: 28 });
  if (recipe.noiseReduction !== undefined)
    push({ name: "Noise reduction", readout: signed(recipe.noiseReduction), stops: nine.stops, selected: nine.indexOf(recipe.noiseReduction), rest: nine.indexOf(0), step: 28 });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-3">
      {/* Shared by every dial's centre cap */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <radialGradient id="dial-cap" cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#2a2a30" />
            <stop offset="100%" stopColor="#0d0d10" />
          </radialGradient>
        </defs>
      </svg>
      {dials}
    </div>
  );
}
