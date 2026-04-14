# ⚛️ ResearchAgent UI (Frontend)

A premium, real-time research dashboard featuring glassmorphism design and live telemetry.

## 🎨 Design Philosophy
- **Glassmorphism**: Backdrop blurs and subtle borders for a modern, high-tech feel.
- **Framer Motion**: Smooth node transitions and streaming animations.
- **Real-time Telemetry**: Live log console and workflow highlighting.

## 🛠 Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Typography Plugin
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Streaming**: Server-Sent Events (SSE) via native `EventSource`

## 📡 Streaming Protocol
The frontend listens to a specialized SSE stream from the FastAPI backend:
- `step_start`: Highlights the active node in the sidebar.
- `log`: Appends a new timestamped entry to the Telemetry Console.
- `report_chunk`: Incremental report generation with a "typing" effect.
- `usage`: Live token consumption tracking.
- `done`: Finalizes the state and reveals utility actions (Download/Copy).

## 🚀 Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
