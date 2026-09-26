# Mihail Kovashki (MiKo) · Photography Portfolio

> An editorial, magazine-grade photography portfolio and personal visual journal. Showcasing street scenes, landscapes, and quiet moments captured across East Asia and Europe on the **Fujifilm X-T5** and **Fujinon XF** optics.

---

## ✨ Overview & Creative Philosophy

This project is built as a bespoke digital exhibition rather than a generic photo grid. It bridges fine-art photography with modern frontend engineering craft, pairing an analog darkroom aesthetic with physical, spring-damped micro-interactions.

- **Photographer:** Mihail Kovashki ([@mi_ko.jpg](https://instagram.com/mi_ko.jpg))
- **Camera System:** FUJIFILM X-T5 (40.2MP X-Trans CMOS 5 HR)
- **Primary Optics:** Fujinon XF23mmF1.4 R LM WR · Fujinon XF35mmF2 R WR
- **Locations Featured:** Prague, Seoul, Hokkaido, Český Krumlov, Sokcho, Kutná Hora

---

## 🎨 Design & Engineering Highlights

### 1. Kinetic Editorial Typography
- **Spring-Damped Destination Flipper:** Smooth mechanical reel transitions cycling through travel archives with custom spring physics and kinetic motion-blur.
- **Zero Layout Shifts:** Fixed-height letterbox container preventing vertical jitter across words of varying lengths while accommodating Playfair Display's italics and diacritics.
- **Monograph Scale Hierarchy:** A subdued premise (*"Visual Notes from"*) stepping back to give center stage to the monumental destination title.

### 2. Optical Lens Spotlight
- **Photographic Light Physics:** A mouse-reactive ambient spotlight that follows the cursor with organic spring lag, mimicking light passing through vintage coated glass.
- **Analog Palette:** Blends signature Fujifilm red (`#d93829`) into warm 3200K darkroom amber with a soft specular center.
- **Feathered Elliptical Vignette Mask:** GPU-composited CSS alpha masking (`mask-image: radial-gradient(ellipse ...)`) ensuring the light softly dissolves before touching any component boundary—eliminating hard box edges.

### 3. Interactive Floating Photo Peeks
- **Cursor-Tracking Contact Sheet:** Hovering over the active destination reveals an understated, frosted-glass miniature photo slide that glides with the cursor.
- **Randomized Archive Sampling:** Automatically draws a fresh random frame from that specific series on every hover.
- **Seamless Navigation:** Clicking the destination smoothly filters the gallery and scrolls directly to the collection.

### 4. Dual Curated Gallery Modes
- **Masonry Mosaic (`Grid`):** Multi-column responsive layout preserving native aspect ratios, featuring mobile-optimized inline captions and undimmed thumbnail previews.
- **Editorial Story Mode (`Story`):** Single-column photobook flow with full-width high-resolution exports and inline EXIF technical metadata (`focal length · aperture · shutter speed · ISO`).

### 5. High-Precision Photographic Lightbox
- **Touch & Swipe Gestures:** Zero-flicker touch navigation with inertia tracking.
- **Deep Zoom Inspection:** Desktop click-to-zoom for 1:1 pixel inspection of 40MP details.
- **EXIF & Film Simulation Drawer:** Live readout of camera parameters and custom Fujifilm simulation recipes (highlight/shadow curves, grain roughness, color chrome effect, white balance shifts).
- **Deep-Linked URL State:** Synchronizes open photos with the browser history (`?photo=[id]`), allowing direct link sharing and native back/forward button navigation.

### 6. Tactile Collection Tabs
- **Drag-to-Scroll UX:** Horizontal series filter supporting click-and-drag mouse physics alongside standard touch and mouse-wheel scrolling.
- **Scroll Affordance Fade:** Dynamic CSS linear-gradient edge masks that visually dissolve when content is cut off, solving the classic UI *"illusion of completeness"*.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Core Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation & Motion:** [Framer Motion v12](https://www.framer.com/motion/)
- **Typography:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (Editorial Serif), [Geist & Geist Mono](https://vercel.com/font)
- **Icons:** [Lucide React](https://lucide.dev/)
- **EXIF Pipeline:** `exiftool-vendored`, `exifr`

---

## 📂 Project Structure

```text
photo-portfolio/
├── public/
│   └── photos/
│       ├── display/      # 2048px optimized high-resolution web exports
│       └── thumb/        # 600px lightweight thumbnails
├── scripts/
│   └── ingest.mjs        # Automated CLI for EXIF extraction & image processing
├── src/
│   ├── app/
│   │   ├── globals.css   # Tailored theme tokens & film-grain shaders
│   │   ├── layout.tsx    # Root layout & Google Fonts integration
│   │   └── page.tsx      # Main application state & gallery coordinator
│   ├── components/
│   │   ├── Hero.tsx          # Kinetic flipper, optical spotlight & photo peeks
│   │   ├── Lightbox.tsx      # Fullscreen swipe & zoom inspection modal
│   │   ├── Navbar.tsx        # Masthead navigation & series switcher
│   │   ├── PhotoCard.tsx     # Adaptive card for Grid & Story modes
│   │   ├── PhotoGrid.tsx     # Masonry column coordinator
│   │   ├── SeriesFilter.tsx  # Drag-and-scroll collection pills with fade masks
│   │   └── GearModal.tsx     # Camera gear & creative philosophy drawer
│   └── data/
│       └── photos.ts     # Generated typed photo repository & EXIF metadata
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
git clone https://github.com/your-username/photo-portfolio.git
cd photo-portfolio
npm install
```

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Building for Production

Create an optimized static production bundle:

```bash
npm run build
npm run start
```

---

## 📸 Ingestion Pipeline

The project includes an automated ingestion pipeline that reads raw photo exports, extracts complete EXIF camera parameters and Fujifilm custom recipe tags, generates WebP/JPEG thumbnails, computes blur placeholders, and writes type-safe data to `src/data/photos.ts`:

```bash
# Ingest photos from a folder as a named series
npm run ingest "/path/to/exported/photos" "Prague 26"

# Optional overrides:
npm run ingest "/path/to/exported/photos" "Seoul 25" --lens="XF23mmF1.4 R LM WR"
```

---

## 📄 License & Copyright

- **Code:** Licensed under the [MIT License](LICENSE).
- **Photographs:** © Mihail Kovashki. All photographs are personal works and copyrighted. All rights reserved. Unauthorized reproduction, distribution, or commercial use is strictly prohibited.
