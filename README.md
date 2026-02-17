
<div align="center">

# 🧭 KCET Compass
### The Ultimate Companion for Karnataka CET Aspirants

![KCET Compass Banner](https://via.placeholder.com/1200x400/0f172a/38bdf8?text=KCET+Compass)

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

[Features](#-features) • [Coded Labs](#-coded-labs) • [Hidden Tricks](#-hidden-tricks--easter-eggs) • [Installation](#-installation) • [Data Pipeline](#-data-pipeline)

</div>

---

## 🚀 Overview

**KCET Compass** is a comprehensive, open-source platform designed to simplify the complex admission process for Karnataka Common Entrance Test (KCET) aspirants. From predicting your rank to simulating the counseling process, **KCET Compass** covers every step of the journey with precision and clarity.

> **Disclaimer:** This is an independent project and is not affiliated with the Karnataka Examination Authority (KEA).

---

## ✨ Features

### 🎯 Core Admission Tools

| Feature | Description |
|---------|-------------|
| **📊 Cutoff Explorer** | Explore over **250,000+** historical cutoff records (2023-2025) across all rounds and categories. Filter by college, branch, and category with ease. |
| **🏆 Rank Predictor** | Estimate your KCET rank based on your PCM marks and board percentages. Uses historical data trends for high accuracy. |
| **🎓 College Finder** | Input your rank and get a tailored list of colleges you have a high chance of getting into. Includes "Safe", "Moderate", and "Ambitious" markers. |
| **🔄 Mock Simulator** | Experience the real option entry process. Sort, add, and rearrange your college preferences in a simulated environment. |
| **📅 Round Tracker** | Stay updated with the latest counseling schedule. Track Round 1, Round 2, and Extended Round dates seamlessly. |
| **📝 Option Entry Analyzer** | Upload your official KEA Option Entry PDF to visualize and analyze your choices. Detect missing top colleges or illogical orderings. |

### 🎮 Gamified Learning & Social

*   **⚔️ Cutoff Clash**: A "Higher or Lower" style game to test your knowledge of engineering college cutoffs.
*   **📅 Daily Challenge**: A daily quiz or task related to KCET preparation and counseling logic.
*   **🤝 Squad Finder**: Connect with students who share your rank range and college preferences to find potential future batchmates.
*   **💬 College Community**: Join discussions specific to each college.

### 📚 Information & Resources

*   **🤖 AI Counselor**: Get instant answers to your counseling queries powered by a trained AI assistant.
*   **📰 CET News**: A dedicated news feed aggregating the latest updates from KEA and major news outlets.
*   **📋 Documents Checklist**: An interactive checklist for all documents required during verification (Study Certificates, Income Certificates, etc.).
*   **📖 Info Centre**: Curated articles explaining the counseling process, document verification, and reservation categories.
*   **💾 Materials**: Access to study materials, previous year question papers, and important forms.
*   **⭐ Reviews**: Authentic, student-submitted reviews for engineering colleges across Karnataka.

### 🧪 Coded Labs (Experimental)

*   **🚇 Metro Mapper**: Visualize Bangalore engineering colleges relative to Namma Metro lines to find the most commutable campuses.
*   **💎 Hidden Gems**: AI-driven analysis to identify colleges with excellent placement stats and infrastructure that are often overlooked.

---

## ⌨️ Hidden Tricks & Easter Eggs

We believe in making tools fun. KCET Compass is packed with hidden features:

1.  **Command Palette**: Press `Ctrl + K` (or `Cmd + K`) to instantly search and navigate to any page or college.
2.  **Keyboard Shortcuts HUD**: Press `?` anywhere to view a list of all available keyboard shortcuts.
3.  **Konami Code**: Try entering the legendary Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`) for a surprise party mode! 🎉

---

## 🛠️ Tech Stack

### Frontend
-   **Framework:** [React 18](https://react.dev/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
-   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
-   **Routing:** [React Router v6](https://reactrouter.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Charts:** [Recharts](https://recharts.org/)
-   **Icons:** [Lucide React](https://lucide.dev/)

### Data & Backend
-   **Python:** For complex data extraction (PDF parsing, OCR, Excel processing).
-   **Pandas/OpenPyXL:** Data manipulation and cleaning.
-   **Node.js:** Helper scripts for data migration and API interfacing.
-   **Supabase:** (Optional) Backend for user analytics and live features.

---

## 📦 Installation

### Prerequisites
-   **Node.js** (v18 or higher)
-   **Python** (3.8 or higher) - *Optional, only for running data extraction scripts*

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/kcet-compass.git
    cd kcet-compass
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧬 Data Pipeline

Our data is the heart of the application. We use a sophisticated Python pipeline to extract, clean, and merge data from KEA's official PDF and Excel documents.

### How to Regenerate Data

If you need to update the dataset with new KCET results:

1.  **Place Data Files:**
    Put the KEA PDF/XLSX files in `public/cutoffs/`.

2.  **Run the Extractor:**
    ```bash
    # Install Python dependencies
    pip install -r requirements.txt
    
    # Run the comprehensive extractor
    python scripts/extract_all_kcet_data.py
    ```

    This script will:
    *   Extract mock, round 1, round 2, and extended round data.
    *   Parse complex 2025 PDF layouts using `pdfplumber`.
    *   Merge data from 2023, 2024, and 2025.
    *   Output `public/data/kcet_extracted_all.json` (>20MB) and a CSV version.

---

## 🤝 Contributing

We welcome contributions! Whether it's fixing a bug, adding a college review, or improving the rank prediction algorithm.

1.  **Fork** the project.
2.  **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  **Open** a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ for KCET Aspirants**

[Report Bug](https://github.com/yourusername/kcet-compass/issues) • [Request Feature](https://github.com/yourusername/kcet-compass/issues)

</div>
