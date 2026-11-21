# Paint Studio — Brand & System Documentation

## 1. Overview
**Paint Studio** is a modern, high-performance, single-page web drawing application built with **React 18**, **Vite**, and **Tailwind CSS v4**. It is a pixel-perfect recreation of the native-feeling Paint Studio desktop canvas experience with zero external UI/icon dependencies.

---

## 2. Brand Identity & Visual Design

### 2.1 Logo & Mark
- **Dimensions**: 30px × 30px with 9px rounded corners (`border-radius: 9px`).
- **Gradient**: Conic gradient spanning multi-color stops from 210 degrees:
  `conic-gradient(from 210deg, #ff5d7a, #ffb84d, #3fd6a0, #3a8bff, #8a5bff, #ff5d7a)`
- **Center Element**: 12px × 12px circular punch-hole matching the current chrome background (`var(--chrome)`).

### 2.2 Typography
- **Font Stack**: System native font stack:
  `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- **Tabular Numerics**: Applied on numeric counters, zoom percentage, pointer coordinates, dimensions, and brush sizes (`tabular-nums`).

### 2.3 Color Palette & Theme Tokens
Color tokens are managed using CSS variables with light and dark mode specifications:

| Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| `--chrome` | `#ffffff` | `#151a30` | Top header, aside panel, and card backgrounds |
| `--chrome2` | `#f4f6fb` | `#1c2240` | Outer background, button hover, secondary containers |
| `--ink` | `#141a33` | `#e9ecfa` | Primary text and dark icon colors |
| `--mut` | `#667091` | `#8f99bd` | Secondary muted text and placeholder color |
| `--line` | `#e2e6f1` | `#2a3254` | Borders and dividers |
| `--acc` | `#3a46e8` | `#8b94ff` | Primary accent color |
| `--acc2` | `#6a4df0` | `#b39bff` | Secondary accent gradient tone |
| `--accsoft` | `#e9ebff` | `#272f5e` | Soft accent background for active/hover states |
| `--ws` | `#e6eaf3` | `#0d111f` | Workspace canvas backdrop |
| `--dot` | `#c9d0e2` | `#1f2744` | Dotted grid pattern color |
| `--sh` | `0 1px 2px rgba(20,26,51,.08), 0 10px 30px rgba(20,26,51,.14)` | `0 1px 2px rgba(0,0,0,.5), 0 12px 34px rgba(0,0,0,.55)` | Elevation shadows |

---

## 3. Architecture & Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 using `@tailwindcss/vite`
- **Icons**: 100% custom lightweight inline SVG icons consolidated in `Icon.jsx`
- **State Architecture**:
  - Drawing buffers, pointer snapshots, and undo/redo stacks reside in `useRef` to maintain 60 FPS drawing performance without React re-render cycles.
  - UI states (tool selection, active colors, brush size, gradients, zoom, modal dialogs) are managed through reactive state hooks.

---

## 4. Key Modules & Directory Structure

```
Paint_Studio/
├── Brand.md/
│   └── System.md               # Brand & System Architecture Spec
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Actions, Zoom, Theme, Navigation
│   │   ├── Toolbar.jsx         # Tools & 27 Shape Selectors
│   │   ├── CanvasArea.jsx      # Interactive workspace with text overlay
│   │   ├── RightPanel.jsx      # Color palette, Gradient, Size, Style & Shortcuts
│   │   ├── GradientEditor.jsx  # Multi-stop linear/radial gradient engine
│   │   ├── HistoryPage.jsx     # IndexedDB drawing library
│   │   ├── Dialog.jsx          # Custom modal dialog
│   │   ├── Toast.jsx           # Floating status toasts
│   │   ├── StatusBar.jsx       # Coordinates, Canvas size & file status
│   │   └── Icon.jsx            # SVG icon repository
│   ├── hooks/
│   │   ├── usePaint.js         # Canvas engine, event capture, undo/redo
│   │   └── useShortcuts.js     # Keyboard shortcuts
│   └── lib/
│       ├── shapes.js           # 27 Vector shape geometries
│       ├── flood.js            # Tolerance-based flood & gradient fill
│       ├── gradient.js         # Canvas gradient builders & presets
│       └── db.js               # IndexedDB storage adapter
```

---

## 5. Core Feature Matrix

1. **Drawing Tools**:
   - Pencil, Brush, Eraser, Fill bucket (solid & gradient mode), Color picker, and Text tool.
2. **27 Vector Shapes**:
   - Lines, Arrows, Rectangles, Ellipse, Triangles, Stars (4, 5, 6 points), Heart, Cloud, Lightning, Speech bubble, Cylinder, Directions.
   - Shift key lock for exact 1:1 aspect ratios and 45° straight lines.
3. **Color & Gradient Engine**:
   - Outline & Fill swatches, swap button, 20-color quick palette.
   - Gradient generator: Linear & Radial modes, custom angle (0–360°), 2 to 6 color stops, and 8 presets (Sunset, Ocean, Rainbow, Berry, Mint, Fire, Candy, Night).
4. **Local IndexedDB Persistence**:
   - Database: `paint-studio`, ObjectStore: `d`
   - Real-time thumbnail generation, search filter, rename, delete, and download PNG capabilities.
