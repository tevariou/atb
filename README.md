# ATB - Bike Geometry Visualization Tool

A comprehensive web application for visualizing and comparing bicycle geometry parameters. This tool helps cyclists understand how different geometry parameters affect bike fit, handling, and rider position.

## 🚴 Features

### Interactive Bike Visualization
- **Rendering** of bicycle geometry using D3.js
- **Side-by-side comparison** between two bike configurations
- **Toggle visibility** of main bike and shadow bike for focused comparison

### Advanced Analysis
- **Riding position angle** calculation and comparison
- **Standover height** analysis with rider inseam comparison
- **Ground pedal clearance** measurements
- **Toe overlap clearance** calculations
- **Trail** measurements for handling characteristics
- **Seatpost length** requirements

### User Experience
- **Pre-built bike presets** for quick comparison
- **Form validation** with helpful warnings and constraints
- **Responsive design** that works on desktop and mobile
- **Real-time updates** as parameters are modified
- **Side-by-side measurements table** showing deltas and status indicators

## 🛠️ Technology Stack

- **Frontend:** Next.js 15 with React 19
- **Styling:** Tailwind CSS 4
- **State Management:** Redux Toolkit
- **Visualization:** D3.js 
- **Forms:** React Hook Form with Zod validation
- **Type Safety:** TypeScript throughout
- **Testing:** Jest with React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ 
- pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd atb
```

2. Install dependencies:
```bash
cd ui
pnpm i
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open [https://localhost:3000](https://localhost:3000) in your browser

## 🧪 Testing

```bash
pnpm run test
```

## 📄 License

This project is licensed under the MIT License.

---

**Ad Astra ✨**

