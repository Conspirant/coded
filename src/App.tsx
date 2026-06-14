// ╔══════════════════════════════════════════════════════════════════╗
// ║  PROJECT PAUSED — All routes redirect to PausedNotice page     ║
// ║  To restore: uncomment the original App below and remove the   ║
// ║  paused version.                                               ║
// ╚══════════════════════════════════════════════════════════════════╝

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import PausedNotice from "./pages/PausedNotice";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Analytics />
        <Routes>
          <Route path="*" element={<PausedNotice />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

// ═══════════════════════════════════════════════════════════════════
// ORIGINAL APP — UNCOMMENT EVERYTHING BELOW TO RESTORE FULL SITE
// ═══════════════════════════════════════════════════════════════════
/*
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { DonationButton } from "./components/DonationButton";
import { CommandPalette } from "./components/CommandPalette";
import { KonamiEasterEgg, KeyboardShortcutsHUD } from "./components/EasterEggs";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import RankPredictor from "./pages/RankPredictor";
import ComedkRankPredictor from "./pages/ComedkRankPredictor";
import CutoffExplorer from "./pages/CutoffExplorer";
import ComedkExplorer from "./pages/ComedkExplorer";
import CollegeFinder from "./pages/CollegeFinder";
import MockSimulator from "./pages/MockSimulator";
import RoundTracker from "./pages/RoundTracker";
import CollegeCompare from "./pages/CollegeCompare";
import Documents from "./pages/Documents";
import MockVerification from "./pages/MockVerification";
import Planner from "./pages/Planner";
import ErrorBoundary from "./components/ErrorBoundary";
import Reviews from "./pages/Reviews";
import CollegeReviewPage from "./pages/CollegeReviewPage";
import InfoCentre from "./pages/InfoCentre";
import Materials from "./pages/Materials";
import AICounselor from "./pages/AICounselor";
import NotFound from "./pages/NotFound";
import DailyChallenge from "./pages/DailyChallenge";
import CutoffClash from "./pages/CutoffClash";
import CETNews from "./pages/CETNews";
import CollegeDetail from "./pages/CollegeDetail";
import CollegeList from "./pages/CollegeList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import SquadFinder from "./pages/SquadFinder";
import MetroMapper from "./pages/MetroMapper";
import BmtcMapper from './pages/BmtcMapper';
import HiddenGems from "./pages/HiddenGems";
import CollegeCutoffs from "./pages/CollegeCutoffs";
import About from "./pages/About";
import FeatureRequest from "./pages/FeatureRequest";
import PYQTest from "./pages/PYQTest";
import CutoffTrends from "./pages/CutoffTrends";
import Donate from "./pages/Donate";
import AdminHub from "./pages/AdminHub";
import ResultChecker from "./pages/ResultChecker";
import CopingZone from "./pages/CopingZone";
import { ExamModeProvider, useExamMode } from "./contexts/ExamModeContext";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { ResourceLimitModal } from "./components/ResourceLimitModal";
import { Calibrate2027Modal } from "./components/Calibrate2027Modal";

const ExamAwareCutoffExplorer = () => {
  const { examMode } = useExamMode();
  return examMode === "COMEDK" ? <ComedkExplorer /> : <CutoffExplorer />;
};

const ExamAwareRankPredictor = () => {
  const { examMode } = useExamMode();
  return examMode === "COMEDK" ? <ComedkRankPredictor /> : <RankPredictor />;
};

const OriginalApp = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ExamModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Analytics />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <CommandPalette />
            <KonamiEasterEgg />
            <KeyboardShortcutsHUD />
            <DisclaimerBanner />
            <ResourceLimitModal />
            <Calibrate2027Modal />

            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/daily-challenge" element={<DailyChallenge />} />
              <Route path="/cutoff-clash" element={<CutoffClash />} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/rank-predictor" element={<Layout><ExamAwareRankPredictor /></Layout>} />
              <Route path="/cutoff-explorer" element={<Layout><ExamAwareCutoffExplorer /></Layout>} />
              <Route path="/comedk-explorer" element={<Layout><ComedkExplorer /></Layout>} />
              <Route path="/college-finder" element={<Layout><CollegeFinder /></Layout>} />
              <Route path="/cutoff-trends" element={<Layout><CutoffTrends /></Layout>} />
              <Route path="/mock-simulator" element={<Layout><MockSimulator /></Layout>} />
              <Route path="/round-tracker" element={<Layout><RoundTracker /></Layout>} />
              <Route path="/college-compare" element={<Layout><CollegeCompare /></Layout>} />
              <Route path="/planner" element={<Layout><ErrorBoundary><Planner /></ErrorBoundary></Layout>} />
              <Route path="/documents" element={<Layout><Documents /></Layout>} />
              <Route path="/document-verification" element={<Layout><MockVerification /></Layout>} />
              <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
              <Route path="/reviews/:collegeCode" element={<Layout><CollegeReviewPage /></Layout>} />
              <Route path="/college-list" element={<Layout><CollegeCutoffs /></Layout>} />
              <Route path="/college-cutoffs" element={<Layout><CollegeCutoffs /></Layout>} />
              <Route path="/info-centre" element={<Layout><InfoCentre /></Layout>} />
              <Route path="/materials" element={<Layout><Materials /></Layout>} />
              <Route path="/cet-news" element={<Layout><CETNews /></Layout>} />
              <Route path="/ai-counselor" element={<Layout><AICounselor /></Layout>} />
              <Route path="/results" element={<Layout><ResultChecker /></Layout>} />
              <Route path="/college/:collegeCode" element={<Layout><CollegeDetail /></Layout>} />
              <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/request-feature" element={<Layout><FeatureRequest /></Layout>} />
              <Route path="/pyq-test" element={<Layout><PYQTest /></Layout>} />
              <Route path="/donate" element={<Layout><Donate /></Layout>} />
              <Route path="/squad-finder" element={<SquadFinder />} />
              <Route path="/metro-mapper" element={<MetroMapper />} />
              <Route path="/bmtc-mapper" element={<BmtcMapper />} />
              <Route path="/hidden-gems" element={<HiddenGems />} />
              <Route path="/coping-zone" element={<CopingZone />} />
              <Route path="/admin" element={<AdminHub />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DonationButton />
            <PWAInstallBanner />
          </BrowserRouter>
        </TooltipProvider>
      </ExamModeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
*/
