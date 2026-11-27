// ===================================================================
//   PROJECT RESTORED — Full site active
//   Lazy-loaded routes for fast initial load & smooth transitions
// ===================================================================

import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import { DonationButton } from "./components/DonationButton";
import { CommandPalette } from "./components/CommandPalette";
import { KonamiEasterEgg, KeyboardShortcutsHUD, DinoEasterEgg } from "./components/EasterEggs";
import Homepage from "./pages/Homepage";
import { ScopeNotification } from "./components/ScopeNotification";
import { UnsupportedExamRedirect } from "./components/UnsupportedExamRedirect";
import { ExamModeProvider } from "./contexts/ExamModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { ResourceLimitModal } from "@/components/ResourceLimitModal";
import { Calibrate2027Modal } from "./components/Calibrate2027Modal";
import { DynamicPopupManager } from "./components/DynamicPopupManager";
import { GlobalPollPopup } from "./components/GlobalPollPopup";
import { MusicPlayer } from "./components/MusicPlayer";
import { PresenceAndBlockProvider } from "./contexts/PresenceAndBlockProvider";

// Lazy-loaded route pages for optimal bundle splitting and smooth navigation
const Dashboard = lazy(() => import("./pages/Dashboard"));
const RankPredictor = lazy(() => import("./pages/RankPredictor"));
const CutoffExplorer = lazy(() => import("./pages/CutoffExplorer"));
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
const DinoGame = lazy(() => import("./pages/DinoGame"));
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
const PYQArchive = lazy(() => import("./pages/PYQArchive"));
const CutoffTrends = lazy(() => import("./pages/CutoffTrends"));
const RoundPredictor = lazy(() => import("./pages/RoundPredictor"));
const Donate = lazy(() => import("./pages/Donate"));
const Supporters = lazy(() => import("./pages/Supporters"));
const StudentReviews = lazy(() => import("./pages/StudentReviews"));
const Forum = lazy(() => import("./pages/Forum"));
const ThreadDetailPage = lazy(() => import("./pages/ThreadDetailPage"));
const AdminHub = lazy(() => import("./pages/AdminHub"));
const CounsellorApply = lazy(() => import("./pages/CounsellorApply"));
const Guides = lazy(() => import("./pages/Guides"));
const PucHub = lazy(() => import("./pages/PucHub"));

const PucMarksCalculator = lazy(() => import("./pages/PucPages").then((m) => ({ default: m.PucMarksCalculator })));
const PucQuestionPapers = lazy(() => import("./pages/PucPages").then((m) => ({ default: m.PucQuestionPapers })));
const PucSubjects = lazy(() => import("./pages/PucPages").then((m) => ({ default: m.PucSubjects })));
const PucStudyPlanner = lazy(() => import("./pages/PucPages").then((m) => ({ default: m.PucStudyPlanner })));
const PucPracticals = lazy(() => import("./pages/PucPages").then((m) => ({ default: m.PucPracticals })));
const PucQuestionBanks = lazy(() => import("./pages/PucPages").then((m) => ({ default: m.PucQuestionBanks })));
const PucQuestionBankTest = lazy(() => import("./pages/PucQuestionBankTest"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-primary animate-spin" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          Loading
        </span>
      </div>
    </div>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <ExamModeProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={200}>
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

                  <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      <Route path="/" element={<Homepage />} />
                      <Route path="/puc" element={<Layout><PucHub /></Layout>} />
                      <Route path="/puc/subjects" element={<Layout><PucSubjects /></Layout>} />
                      <Route path="/puc/practicals" element={<Layout><PucPracticals /></Layout>} />
                      <Route path="/puc/question-banks" element={<Layout><PucQuestionBanks /></Layout>} />
                      <Route path="/puc/practice-tests" element={<Layout><PucQuestionBankTest /></Layout>} />
                      <Route path="/puc/question-banks/test" element={<Layout><PucQuestionBankTest /></Layout>} />
                      <Route path="/puc/question-papers" element={<Layout><PucQuestionPapers /></Layout>} />
                      <Route path="/puc/marks-calculator" element={<Layout><PucMarksCalculator /></Layout>} />
                      <Route path="/puc/study-planner" element={<Layout><PucStudyPlanner /></Layout>} />
                      <Route path="/puc/updates" element={<Layout><PucQuestionPapers /></Layout>} />
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
                      <Route path="/guides" element={<Layout><Guides /></Layout>} />
                      <Route path="/puc/guides" element={<Layout><Guides /></Layout>} />
                      <Route path="/cet-news" element={<Layout><CETNews /></Layout>} />
                      <Route path="/blog" element={<Layout><BlogList /></Layout>} />
                      <Route path="/blog/:slug" element={<Layout><BlogPostDetail /></Layout>} />
                      <Route path="/ai-counselor" element={<Layout><AICounselor /></Layout>} />
                      <Route path="/counsellor-apply" element={<Layout><CounsellorApply /></Layout>} />
                      <Route path="/become-counsellor" element={<Navigate to="/counsellor-apply" replace />} />
                      <Route path="/college/:collegeCode" element={<Layout><CollegeDetail /></Layout>} />
                      <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
                      <Route path="/terms" element={<Layout><Terms /></Layout>} />
                      <Route path="/payment-policy" element={<Layout><PaymentPolicy /></Layout>} />
                      <Route path="/about" element={<Layout><About /></Layout>} />
                      <Route path="/request-feature" element={<Layout><FeatureRequest /></Layout>} />
                      <Route path="/pyq-test" element={<Layout><PYQTest /></Layout>} />
                      <Route path="/puc/pyq" element={<Layout><PYQArchive /></Layout>} />
                      <Route path="/puc/pyq-archive" element={<Layout><PYQArchive /></Layout>} />
                      <Route path="/pyq" element={<Navigate to="/puc/pyq" replace />} />
                      <Route path="/pyqs" element={<Navigate to="/puc/pyq" replace />} />
                      <Route path="/donate" element={<Layout><Donate /></Layout>} />
                      <Route path="/supporters" element={<Layout><Supporters /></Layout>} />
                      <Route path="/student-reviews" element={<Layout><StudentReviews /></Layout>} />
                      <Route path="/puc/student-reviews" element={<Layout><StudentReviews /></Layout>} />
                      <Route path="/reddit-reviews" element={<Navigate to="/student-reviews" replace />} />
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
                  <GlobalPollPopup />
                </PresenceAndBlockProvider>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ExamModeProvider>
      </MotionConfig>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
