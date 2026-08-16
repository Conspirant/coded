import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { DonationButton } from "./components/DonationButton";
import { CommandPalette } from "./components/CommandPalette";
import { KonamiEasterEgg, KeyboardShortcutsHUD } from "./components/EasterEggs";
import { ExamModeProvider, useExamMode } from "./contexts/ExamModeContext";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { ResourceLimitModal } from "@/components/ResourceLimitModal";
import { Calibrate2027Modal } from "./components/Calibrate2027Modal";
import { DynamicPopupManager } from "./components/DynamicPopupManager";
import { GlobalPollPopup } from "./components/GlobalPollPopup";
import { MusicPlayer } from "./components/MusicPlayer";
import { PresenceAndBlockProvider } from "./contexts/PresenceAndBlockProvider";

// Lightweight Instant Page Loader for Low-End Devices
const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">Loading Resource...</span>
  </div>
);

// Route-Based Code Splitting (React.lazy)
const Homepage = lazy(() => import("./pages/Homepage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const RankPredictor = lazy(() => import("./pages/RankPredictor"));
const ComedkRankPredictor = lazy(() => import("./pages/ComedkRankPredictor"));
const CutoffExplorer = lazy(() => import("./pages/CutoffExplorer"));
const ComedkExplorer = lazy(() => import("./pages/ComedkExplorer"));
const CollegePredictor = lazy(() => import("./pages/CollegePredictor"));
const MockSimulator = lazy(() => import("./pages/MockSimulator"));
const RoundTracker = lazy(() => import("./pages/RoundTracker"));
const CollegeCompare = lazy(() => import("./pages/CollegeCompare"));
const Documents = lazy(() => import("./pages/Documents"));
const MockVerification = lazy(() => import("./pages/MockVerification"));
const Reviews = lazy(() => import("./pages/Reviews"));
const CollegeReviewPage = lazy(() => import("./pages/CollegeReviewPage"));
const InfoCentre = lazy(() => import("./pages/InfoCentre"));
const Materials = lazy(() => import("./pages/Materials"));
const AICounselor = lazy(() => import("./pages/AICounselor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DailyChallenge = lazy(() => import("./pages/DailyChallenge"));
const CutoffClash = lazy(() => import("./pages/CutoffClash"));
const CETNews = lazy(() => import("./pages/CETNews"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPostDetail = lazy(() => import("./pages/BlogPostDetail"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const PaymentPolicy = lazy(() => import("./pages/PaymentPolicy"));
const SquadFinder = lazy(() => import("./pages/SquadFinder"));
const MetroMapper = lazy(() => import("./pages/MetroMapper"));
const BmtcMapper = lazy(() => import("./pages/BmtcMapper"));
const FeeCalculator = lazy(() => import("./pages/FeeCalculator"));
const HiddenGems = lazy(() => import("./pages/HiddenGems"));
const CollegeCutoffs = lazy(() => import("./pages/CollegeCutoffs"));
const CollegeInfoHub = lazy(() => import("./pages/CollegeInfoHub"));
const About = lazy(() => import("./pages/About"));
const FeatureRequest = lazy(() => import("./pages/FeatureRequest"));
const PYQTest = lazy(() => import("./pages/PYQTest"));
const CutoffTrends = lazy(() => import("./pages/CutoffTrends"));
const RoundPredictor = lazy(() => import("./pages/RoundPredictor"));
const Donate = lazy(() => import("./pages/Donate"));
const Supporters = lazy(() => import("./pages/Supporters"));
const Forum = lazy(() => import("./pages/Forum"));
const ThreadDetailPage = lazy(() => import("./pages/ThreadDetailPage"));
const AdminHub = lazy(() => import("./pages/AdminHub"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 mins cache
      gcTime: 1000 * 60 * 30, // 30 mins GC
      refetchOnWindowFocus: false,
    },
  },
});

const ExamAwareCutoffExplorer = () => {
  const { examMode } = useExamMode();
  return examMode === "COMEDK" ? <ComedkExplorer /> : <CutoffExplorer />;
};

const ExamAwareRankPredictor = () => {
  const { examMode } = useExamMode();
  return examMode === "COMEDK" ? <ComedkRankPredictor /> : <RankPredictor />;
};

const App = () => (
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
              v7_relativeSplatPath: true,
            }}
          >
            <PresenceAndBlockProvider>
              <CommandPalette />
              <KonamiEasterEgg />
              <KeyboardShortcutsHUD />
              <DisclaimerBanner />
              <ResourceLimitModal />
              <Calibrate2027Modal />
              <DynamicPopupManager />

              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/daily-challenge" element={<DailyChallenge />} />
                  <Route path="/cutoff-clash" element={<CutoffClash />} />
                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/rank-predictor" element={<Layout><ExamAwareRankPredictor /></Layout>} />
                  <Route path="/cutoff-explorer" element={<Layout><ExamAwareCutoffExplorer /></Layout>} />
                  <Route path="/comedk-explorer" element={<Layout><ComedkExplorer /></Layout>} />
                  <Route path="/college-predictor" element={<Layout><CollegePredictor /></Layout>} />
                  <Route path="/college-finder" element={<Navigate to="/college-predictor" replace />} />
                  <Route path="/cutoff-trends" element={<Layout><CutoffTrends /></Layout>} />
                  <Route path="/cutoff-predictor" element={<Layout><RoundPredictor /></Layout>} />
                  <Route path="/round-predictor" element={<Layout><RoundPredictor /></Layout>} />
                  <Route path="/mock-simulator" element={<Layout><MockSimulator /></Layout>} />
                  <Route path="/round-tracker" element={<Layout><RoundTracker /></Layout>} />
                  <Route path="/college-compare" element={<Layout><CollegeCompare /></Layout>} />
                  <Route path="/fee-calculator" element={<Layout><FeeCalculator /></Layout>} />
                  <Route path="/documents" element={<Layout><Documents /></Layout>} />
                  <Route path="/document-verification" element={<Layout><MockVerification /></Layout>} />
                  <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
                  <Route path="/reviews/:collegeCode" element={<Layout><CollegeReviewPage /></Layout>} />
                  <Route path="/colleges" element={<Layout><CollegeInfoHub /></Layout>} />
                  <Route path="/college-list" element={<Layout><CollegeInfoHub /></Layout>} />
                  <Route path="/college-cutoffs" element={<Layout><CollegeCutoffs /></Layout>} />
                  <Route path="/info-centre" element={<Layout><InfoCentre /></Layout>} />
                  <Route path="/materials" element={<Layout><Materials /></Layout>} />
                  <Route path="/cet-news" element={<Layout><CETNews /></Layout>} />
                  <Route path="/blog" element={<Layout><BlogList /></Layout>} />
                  <Route path="/blog/:slug" element={<Layout><BlogPostDetail /></Layout>} />
                  <Route path="/ai-counselor" element={<Layout><AICounselor /></Layout>} />
                  <Route path="/college/:collegeCode" element={<Layout><CollegeDetail /></Layout>} />
                  <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
                  <Route path="/terms" element={<Layout><Terms /></Layout>} />
                  <Route path="/payment-policy" element={<Layout><PaymentPolicy /></Layout>} />
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/request-feature" element={<Layout><FeatureRequest /></Layout>} />
                  <Route path="/pyq-test" element={<Layout><PYQTest /></Layout>} />
                  <Route path="/donate" element={<Layout><Donate /></Layout>} />
                  <Route path="/supporters" element={<Layout><Supporters /></Layout>} />
                  <Route path="/squad-finder" element={<Layout><SquadFinder /></Layout>} />
                  <Route path="/forum" element={<Layout><Forum /></Layout>} />
                  <Route path="/forum/:postId" element={<Layout><ThreadDetailPage /></Layout>} />
                  <Route path="/community" element={<Navigate to="/forum" replace />} />
                  <Route path="/metro-mapper" element={<Layout><MetroMapper /></Layout>} />
                  <Route path="/bmtc-mapper" element={<Layout><BmtcMapper /></Layout>} />
                  <Route path="/hidden-gems" element={<Layout><HiddenGems /></Layout>} />
                  <Route path="/admin" element={<AdminHub />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              <DonationButton />
              <MusicPlayer />
              <PWAInstallBanner />
              <GlobalPollPopup />
            </PresenceAndBlockProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ExamModeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
