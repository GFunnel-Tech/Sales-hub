import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PartnerHome from "./pages/PartnerHome";
import CommissionStructure from "./pages/CommissionStructure";
import PartnerRanks from "./pages/PartnerRanks";
import IncomeCalculator from "./pages/IncomeCalculator";
import LearningResources from "./pages/LearningResources";
import Leaderboard from "./pages/Leaderboard";
import PrizesIncentives from "./pages/PrizesIncentives";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PartnerHome />} />
          <Route path="/commissions" element={<CommissionStructure />} />
          <Route path="/ranks" element={<PartnerRanks />} />
          <Route path="/calculator" element={<IncomeCalculator />} />
          <Route path="/learning" element={<LearningResources />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/incentives" element={<PrizesIncentives />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
