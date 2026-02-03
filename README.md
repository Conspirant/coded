# KCET Coded - Comprehensive KCET Admission Guide

A comprehensive web application for Karnataka CET (KCET) aspirants to explore college cutoffs, find suitable colleges, predict ranks, and make informed admission decisions.

> **Disclaimer:** This is an independent project and is not affiliated with r/kcet community or its moderation team in any way.

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (optional, for advanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/noimnothim/kcetcode.git
   cd kcetcode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your actual credentials (if using Supabase)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Available Scripts
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests
npm run test:ui          # Run tests with UI
```

## 🔒 Security & Environment Variables

- **Never commit `.env` files** - They contain sensitive credentials
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Use `env.example` as a template for your environment variables

### Required Environment Variables

```bash
# Supabase Configuration (Optional)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: News API
NEWS_API_KEY=your_news_api_key_here
WEBHOOK_SECRET=your_webhook_secret_here
```

## 🚀 Features

### ✅ Fully Implemented Features

#### 1. **Dashboard**
- Real-time statistics from KCET data (109,000+ records)
- Data overview with total records, colleges, and branches
- Year-wise and category-wise distributions
- Quick access to all features
- KCET News & Updates section with YouTube integration
- CET 2026 exam schedule display
- Reddit community links (r/kcet and r/KCETCoded)

#### 2. **Rank Predictor**
- KCET rank prediction from marks input
- KCET marks (0-180) and PUC percentage input
- Category-wise predictions (GM, SC, ST, 1G, 2A, 2B, 3A, 3B)
- Confidence gauge with animated counters
- College suggestions based on predicted rank
- Save and manage prediction results
- Download results as PNG

#### 3. **College Finder**
- Advanced search based on KCET rank
- Multiple filters: category, location, course preferences, year, round
- Admission probability indicators (High/Moderate/Borderline/Exact)
- Sparkline trend visualization for cutoff history
- Bookmark functionality for colleges
- Compare selected colleges
- Real-time filtering and sorting
- Export results to CSV
- XLSX file support for latest cutoff data

#### 4. **Cutoff Explorer**
- Complete cutoff data browser with 109,000+ records
- Filter by year, category, college, branch, round
- Real-time search functionality
- Comprehensive data table with sorting
- Advanced filtering options
- Data export capabilities

#### 5. **Mock Simulator**
- Simulate seat allotment process
- Add and manage preference list
- Drag-and-drop preference ordering
- Safety level indicators for each preference
- Round-wise simulation using historical data
- Detailed simulation results

#### 6. **Option Entry Analyzer (Planner)**
- Upload KEA Option Entry PDF
- Automatic extraction of preferences
- View options exactly as they appear in KEA PDF
- Summary statistics (total options, unique colleges, unique branches)
- Integration with Mock Simulator for analysis

#### 7. **Analytics**
- Dataset overview with entry counts
- Live results tracking from College Finder
- Institute, course, and category breakdowns
- Year coverage information

#### 8. **Round Tracker**
- Counseling round tracking
- Real-time round status updates
- Progress tracking for each round
- Important alerts and notifications
- Timeline visualization

#### 9. **Documents**
- Complete document checklist for KCET counseling
- Essential academic documents list
- KCET/NEET related documents
- Category-specific requirements
- Document copy requirements

#### 10. **Info Centre**
- Educational articles about Karnataka engineering education
- VTU affiliation history and information
- Additional resources and links

#### 11. **Engineering Loadout**
- Fun, gamified gear recommendation system
- Branch-specific equipment suggestions (CSE/ISE/ECE vs Mech/Civil)
- Inventory-style UI with item inspection
- Hostel essentials included

#### 12. **Materials**
- Study materials and resources
- Category-organized content

#### 13. **Reviews**
- College review system
- User-submitted reviews with ratings

### 🚧 Under Development Features

#### 1. **College Compare**
- Side-by-side college comparison
- Cutoff trends, fees, and ratings comparison

#### 2. **Fee Calculator**
- Estimate annual costs across colleges
- Category-wise fee calculations

## 📊 Data Coverage

- **109,920+ records** extracted from KCET PDFs (2023-2025)
- **Multiple years**: 2023, 2024, 2025 data with round-wise cutoffs
- **Comprehensive colleges**: 180+ engineering colleges across Karnataka
- **All categories**: GM, SC, ST, 1G, 2A, 2B, 3A, 3B
- **All seat types**: Government quota with multiple rounds
- **100+ branches**: From Computer Science to specialized engineering streams

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Data Management**: Local JSON + XLSX support + Supabase integration
- **PDF Processing**: pdf-parse + custom extraction logic
- **Routing**: React Router v6
- **State Management**: Zustand + React Query + React Hooks
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── CollegeFinder.tsx
│   ├── RankPredictor.tsx
│   ├── MockSimulator.tsx
│   ├── CutoffExplorer.tsx
│   ├── Analytics.tsx
│   ├── Planner.tsx
│   ├── Loadout.tsx
│   └── ...
├── lib/                # Utility functions and helpers
├── store/              # State management (Zustand)
├── hooks/              # Custom React hooks
└── data/               # Static data files
```

## 🚀 Performance Features

- **Lazy Loading**: Components load on demand
- **Data Pagination**: Large datasets are efficiently paginated
- **Search Optimization**: Fast filtering algorithms
- **Caching**: Local data caching for faster access
- **Responsive Design**: Optimized for all device sizes
- **Error Handling**: Comprehensive error boundaries
- **Fast Mode**: Dashboard fast loading option via summary data

## 🔮 Upcoming Features

- [ ] **College Compare**: Side-by-side comparison
- [ ] **Fee Calculator**: Cost estimation tools
- [ ] **Mobile App**: React Native version
- [ ] **Real-time Updates**: Live data synchronization
- [ ] **Seat Matrix**: Detailed seat availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Karnataka Examination Authority (KEA)** for providing cutoff data
- **shadcn/ui** for the excellent component library
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool

## 📞 Support

For support, questions, or feature requests:
- Join [r/KCETCoded](https://www.reddit.com/r/KCETCoded/) on Reddit
- Create an issue on [GitHub](https://github.com/noimnothim/kcetcode/issues)
- Email: gwakamoliyeah@gmail.com

---

*Helping students make informed decisions for their engineering future*

**Last Updated:** January 2026
