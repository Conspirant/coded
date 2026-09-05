// ===================================================================
//   PROJECT RESTORED — Full site active
//   To pause again: replace App with the PausedNotice version
// =================================================================== 

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import { DonationButton } from "./components/DonationButton";
import { CommandPalette } from "./components/CommandPalette";
import { KonamiEasterEgg, KeyboardShortcutsHUD, DinoEasterEgg } from "./components/EasterEggs";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import RankPredictor from "./pages/RankPredictor";
import CutoffExplorer from "./pages/CutoffExplorer";
import { ScopeNotification } from "./components/ScopeNotification";
import { UnsupportedExamRedirect } from "./components/UnsupportedExamRedirect";
import CollegePredictor from "./pages/CollegePredictor";
import MockSimulator from "./pages/MockSimulator";
import RoundTracker from "./pages/RoundTracker";
import CollegeCompare from "./pages/CollegeCompare";
import Documents from "./pages/Documents";
import MockVerification from "./pages/MockVerification";
import Reviews from "./pages/Reviews";
import CollegeReviewPage from "./pages/CollegeReviewPage";
import InfoCentre from "./pages/InfoCentre";
import Materials from "./pages/Materials";
import AICounselor from "./pages/AICounselor";
import NotFound from "./pages/NotFound";
import DailyChallenge from "./pages/DailyChallenge";
import CutoffClash from "./pages/CutoffClash";
import DinoGame from "./pages/DinoGame";
import CETNews from "./pages/CETNews";
import BlogList from "./pages/BlogList";
import BlogPostDetail from "./pages/BlogPostDetail";
import CollegeDetail from "./pages/CollegeDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import PaymentPolicy from "./pages/PaymentPolicy";
import SquadFinder from "./pages/SquadFinder";
import MetroMapper from "./pages/MetroMapper";
import BmtcMapper from './pages/BmtcMapper';
import FeeCalculator from "./pages/FeeCalculator";
import HiddenGems from "./pages/HiddenGems";
import CollegeCutoffs from "./pages/CollegeCutoffs";
import CollegeInfoHub from "./pages/CollegeInfoHub";
import About from "./pages/About";
import FeatureRequest from "./pages/FeatureRequest";
import PYQTest from "./pages/PYQTest";
import CutoffTrends from "./pages/CutoffTrends";
import RoundPredictor from "./pages/RoundPredictor";
import Donate from "./pages/Donate";
import Supporters from "./pages/Supporters";
import Forum from "./pages/Forum";
import ThreadDetailPage from "./pages/ThreadDetailPage";
import AdminHub from "./pages/AdminHub";
import { ExamModeProvider, useExamMode } from "./contexts/ExamModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { ResourceLimitModal } from "@/components/ResourceLimitModal";
import { Calibrate2027Modal } from "./components/Calibrate2027Modal";
import { DynamicPopupManager } from "./components/DynamicPopupManager";
import { WebsiteReviewPrompt } from "@/components/WebsiteReviewPrompt";
import { GlobalPollPopup } from "./components/GlobalPollPopup";
import { MusicPlayer } from "./components/MusicPlayer";
import { PresenceAndBlockProvider } from "./contexts/PresenceAndBlockProvider";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ExamModeProvider>
        <AuthProvider>
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
              <PresenceAndBlockProvider>
                <CommandPalette />
                <KonamiEasterEgg />
                <DinoEasterEgg />
                <KeyboardShortcutsHUD />
                <ScopeNotification />
                <DisclaimerBanner />
                <ResourceLimitModal />
                <Calibrate2027Modal />
                <DynamicPopupManager />

                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/daily-challenge" element={<DailyChallenge />} />
                  <Route path="/cutoff-clash" element={<CutoffClash />} />
                  <Route path="/dino" element={<DinoGame />} />
                  <Route path="/game" element={<Navigate to="/dino" replace />} />
                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/rank-predictor" element={<Layout><RankPredictor /></Layout>} />
                  <Route path="/cutoff-explorer" element={<Layout><CutoffExplorer /></Layout>} />
                  {/* Gracefully redirect former NEET & COMEDK routes with professional notice */}
                  <Route path="/neet" element={<UnsupportedExamRedirect examName="NEET" />} />
                  <Route path="/neetcoded" element={<UnsupportedExamRedirect examName="NEET" />} />
                  <Route path="/neet-*" element={<UnsupportedExamRedirect examName="NEET" />} />
                  <Route path="/comedk" element={<UnsupportedExamRedirect examName="COMEDK" />} />
                  <Route path="/comedk-*" element={<UnsupportedExamRedirect examName="COMEDK" />} />
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
                <DonationButton />
                <MusicPlayer />
                <GlobalPollPopup />
              </PresenceAndBlockProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ExamModeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

