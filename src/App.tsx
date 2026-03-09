import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import QuranPage from "./pages/QuranPage";
import QuranSearchPage from "./pages/QuranSearchPage";
import SurahView from "./pages/SurahView";
import AzkarPage from "./pages/AzkarPage";
import TasbihPage from "./pages/TasbihPage";
import KhatmaPage from "./pages/KhatmaPage";
import DedicationPage from "./pages/DedicationPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import { useAzkarReminder } from "./components/AzkarReminder";

const queryClient = new QueryClient();

function AppContent() {
  useAzkarReminder();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quran" element={<QuranPage />} />
        <Route path="/quran/search" element={<QuranSearchPage />} />
        <Route path="/quran/:number" element={<SurahView />} />
        <Route path="/azkar" element={<AzkarPage />} />
        <Route path="/tasbih" element={<TasbihPage />} />
        <Route path="/khatma" element={<KhatmaPage />} />
        <Route path="/dedication" element={<DedicationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
