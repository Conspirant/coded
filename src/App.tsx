import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import RankPredictor from "./pages/RankPredictor";
import CutoffExplorer from "./pages/CutoffExplorer";
import CollegeFinder from "./pages/CollegeFinder";
import MockSimulator from "./pages/MockSimulator";
import RoundTracker from "./pages/RoundTracker";
import CollegeCompare from "./pages/CollegeCompare";
import Documents from "./pages/Documents";
import Planner from "./pages/Planner";
import ErrorBoundary from "./components/ErrorBoundary";
import Reviews from "./pages/Reviews";
import InfoCentre from "./pages/InfoCentre";
import Materials from "./pages/Materials";
import AICounselor from "./pages/AICounselor";
// Vercel build fix trigger
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { DisclaimerBanner } from "./components/DisclaimerBanner";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <DisclaimerBanner />
        <Routes>
          {/* Homepage without sidebar layout */}
          <Route path="/" element={<Homepage />} />

          {/* All other pages with sidebar layout */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/rank-predictor" element={<Layout><RankPredictor /></Layout>} />
          <Route path="/cutoff-explorer" element={<Layout><CutoffExplorer /></Layout>} />
          <Route path="/college-finder" element={<Layout><CollegeFinder /></Layout>} />
          <Route path="/mock-simulator" element={<Layout><MockSimulator /></Layout>} />
          <Route path="/round-tracker" element={<Layout><RoundTracker /></Layout>} />
          <Route path="/college-compare" element={<Layout><CollegeCompare /></Layout>} />
          <Route path="/planner" element={
            <Layout>
              <ErrorBoundary>
                <Planner />
              </ErrorBoundary>
            </Layout>
          } />
          <Route path="/documents" element={<Layout><Documents /></Layout>} />
          <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
          <Route path="/info-centre" element={<Layout><InfoCentre /></Layout>} />
          <Route path="/materials" element={<Layout><Materials /></Layout>} />
          <Route path="/ai-counselor" element={<Layout><AICounselor /></Layout>} />
          {/* More routes will be added here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PWAInstallBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
