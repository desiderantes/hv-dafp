# Formato Único Hoja de Vida - Persona Natural (DAFP Colombia)

> **¿Español?** [Click aquí](README.es.md)

This is a modern, offline-first Progressive Web Application (PWA) designed to easily fill out, auto-calculate, preview, and print/export the official Colombian DAFP (*Departamento Administrativo de la Función Pública*) **Formato Único de Hoja de Vida - Persona Natural** (Laws 190 of 1995, 489 and 443 of 1998).

I built this site because the original template is outdated and lacking, and it is not a fillable form. I also wanted to learn how to use Vite, modern React, Bun, and practice using AI in personal projects.

> **DISCLAIMER:** This app is about 60% AI slop. I didn't remember much from my React days, so I built most of it in tandem with Google Antigravity.
> Some tech decisions are mine (using Bun, making it a PWA), while for others I trusted the AI and had it fix whatever was wrong with its initial choices (for instance, it initially used an older Vite version).
> I do believe using AI can hamper learning to code, but this project wasn't about learning React; it was about learning how to leverage AI while solving a real need for a couple of friends.

---

## 🌟 Key Features

- **Official Format Parity**: Layout based on the existing DAFP template across 3 fixed pages and dynamic additional work experience pages.
- **Dynamic Employment Pagination**: Automatically generates formatted employment pages when adding jobs (`Añadir Empleo`), keeping `EMPLEO ACTUAL` fixed on Slot #1 of Page 2 and `EMPLEO ANTERIOR` on subsequent pages.
- **Real-Time Total Experience Calculation**: Section 4 (*TIEMPO TOTAL DE EXPERIENCIA*) is 100% non-editable and auto-computes durations for Public Sector, Private Sector, and Independent work in real-time, dynamically using "today's date" for active employment.
- **100% Offline-First PWA**: Installable on desktop and mobile browsers, working completely offline via Workbox Service Workers and automatic `localStorage` persistence.
- **Easy Print/Export to PDF**: `@media print` styles with exact background color preservation (`-webkit-print-color-adjust: exact`).
- **Interactive Digital Signature**: Modal popover allowing users to draw, clear, or upload digital signatures directly onto the document.
- **UI Toolbar**: Custom zoom control (50% to 200%), sample data loading, JSON export/import, and quick clear.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Runtime & Package Manager** | [Bun](https://bun.sh/) (v1.3.14) |
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool & Bundler** | Vite 5 |
| **Styling & CSS Architecture** | Vanilla CSS with CSS Custom Properties (`:root`) |
| **Icons & Micro-interactions** | Lucide React & `canvas-confetti` |
| **PWA Engine** | `vite-plugin-pwa` with Workbox Service Worker |
| **Typography** | Google Fonts (`Arimo` metric-compatible with Arial, and `Inter` for the UI) |

---

## 🚀 Getting Started

### Prerequisites

Bun. It probably works with other runtimes, but I've only tested it with Bun.

```bash
bun --version
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/desiderantes/hv-dafp.git
   cd hv-dafp
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

Run the local development server with hot module replacement (HMR):

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Build the optimized production app and PWA assets:

```bash
bun run build
```

The compiled output will be generated in the `dist/` directory.

---

## 📄 License

This project is open source and available under the MIT License.
