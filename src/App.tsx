import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignLaunch from "./pages/CampaignLaunch";
import ContentStudio from "./pages/ContentStudio";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ExportCampaign from "./pages/ExportCampaign";
import MarketingStrategy from "./pages/MarketingStrategy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Auth page kept for compatibility but it's no longer needed */}
            <Route path="/auth" element={<Dashboard />} />
            {/* Marketing Strategy page - accessible without layout */}
            <Route path="/marketing-strategy" element={<MarketingStrategy />} />
            {/* All routes are now directly accessible without authentication */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/launch/:id" element={<CampaignLaunch />} />
              <Route path="/content" element={<ContentStudio />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/export-campaign" element={<ExportCampaign />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
