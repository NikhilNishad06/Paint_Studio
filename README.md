# 🎨 Paint Studio — Next-Gen Web Drawing & Vector Suite

A modern, high-performance, responsive drawing application built from the ground up using **React 18**, **Vite**, and **Tailwind CSS v4**. It features an in-depth native-canvas drawing engine, 27 vector shapes, full gradient support, zero external UI libraries, and persistent offline storage using **IndexedDB**.

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: [https://github.com/NikhilNishad06/Paint_Studio](https://github.com/NikhilNishad06/Paint_Studio)

---

## 🛠️ Tech Stack & Tools Used

### 1. Core Framework & Build Tool
- **React 18 (JSX)**: Component-based modular architecture, hooks (`useRef`, `useState`, `useCallback`, `useEffect`).
- **Vite 8**: Ultra-fast next-gen build tool and HMR (Hot Module Replacement) development server.
- **JavaScript (ES Modules)**: Native ES6+ syntax without heavy abstraction layers.

### 2. Styling & Design System
- **Tailwind CSS v4 (`@tailwindcss/vite`)**: Modern CSS-first configuration using `@theme` and `@variant dark`.
- **Pure CSS Variables**: Seamless dynamic Light & Dark mode theming (`--chrome`, `--chrome2`, `--ink`, `--mut`, `--acc`, `--acc2`, `--ws`, `--dot`).
- **System Fonts**: Zero external font dependencies, native OS rendering stack (`system-ui`, `Segoe UI`, `Roboto`).
- **Responsive Layout**: Custom CSS Grid & Flexbox setup supporting split panels, 3-column / 2-column toolbars, and responsive mobile/tablet breakpoints (`max-width: 900px`).

### 3. Graphics & Canvas Engine
- **HTML5 Canvas 2D API (`willReadFrequently: true`)**: Direct buffer manipulation for ultra-fast rendering.
- **`useRef` State Engine**: Canvas drawing buffers, snap states, pointer events, and undo/redo stacks live entirely in `useRef` to maintain **60 FPS zero-latency drawing** without causing React component re-renders.
- **Custom Flood Fill Algorithm**: Stack-based color tolerance (tolerance: 60) fill algorithm supporting both solid color and gradient fill.
- **Custom Vector Shape Generator**: Exact mathematical point mapping for 27 unique shapes (polygons, stars, arrows, callout, heart, cloud, cylinders).
- **Custom Inline SVG Icons**: Zero icon libraries — all SVG paths are clean, scalable inline components wrapped in a unified `<Icon name="..." />` system.

### 4. Data Persistence & Storage
- **IndexedDB**: Browser-native database (`paint-studio` database, `d` objectStore) storing full drawings with high-resolution image blobs and live thumbnails.
- **In-Memory Fallback**: Automatic graceful fallback to `Map()` if IndexedDB is blocked in private/restricted browsing mode.

---

## ✨ Key Features & Capabilities

- **🖌️ Creative Tools**: Pencil, Brush (dynamic preview), Eraser, Fill Bucket (Solid & Gradient), Color Picker (Eyedropper), and Inline Text Tool.
- **📐 27 Shapes & Shift Lock**: Lines, Rectangles, Rounded Rects, Ellipses, Stars (4, 5, 6 points), Triangles, Cloud, Heart, Lightning, Speech Bubble, Cylinder, and Directional Arrows. Holding `Shift` snaps to 45° angles and 1:1 aspect ratios.
- **🌈 Advanced Gradient Studio**:
  - Linear & Radial gradient generator.
  - 0° to 360° interactive angle controller.
  - Multi-stop color picker (2 to 6 customizable color stops).
  - 8 Built-in Presets: *Sunset, Ocean, Rainbow, Berry, Mint, Fire, Candy, Night*.
- **🎨 Color Management**: Color 1 (Outline / Left-click) and Color 2 (Fill / Right-click) with swap shortcut (`X`) and a 20-color quick palette.
- **⏪ Undo / Redo & Canvas Resizing**: 40-step undo/redo snapshot stack, zoom controls (25% to 300%), and custom dimension resizing (up to 4000 × 4000 px).
- **📂 Drawing History**: Searchable gallery of saved projects with auto-generated thumbnails, Rename, Download (PNG), and Delete controls.
- **⌨️ Complete Keyboard Shortcuts**:
  - `P` (Pencil), `B` (Brush), `E` (Eraser), `F` (Fill), `I` (Picker), `T` (Text)
  - `[` / `]` (Brush Size) | `X` (Swap Colors) | `G` (Gradient Toggle)
  - `Ctrl + Z` (Undo) | `Ctrl + Y` (Redo) | `Ctrl + S` (Save) | `Ctrl + Shift + S` (Save Copy)
  - `Ctrl + E` (Export PNG) | `Ctrl + O` (Open Image) | `Alt + N` (New Canvas) | `Alt + H` (History)

---

## 📦 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/NikhilNishad06/Paint_Studio.git

# 2. Navigate to project directory
cd Paint_Studio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

---

## 👨‍💻 Author
- **Nikhil Nishad** — [GitHub Profile](https://github.com/NikhilNishad06)
