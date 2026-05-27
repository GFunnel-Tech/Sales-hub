import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { MemberProvider } from "@/hooks/useMember";
import { BlueprintProvider } from "@/hooks/useBlueprintSession";

// Pages
import SalesHub from "./pages/SalesHub";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import MemberEntry from "./pages/MemberEntry";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import SalesProcess from "./pages/SalesProcess";
import LogSale from "./pages/LogSale";
import MySales from "./pages/MySales";
import Scripts from "./pages/Scripts";
import ObjectionPlaybook from "./pages/ObjectionPlaybook";
import SalesTraining from "./pages/SalesTraining";
import SetupWizard from "./pages/SetupWizard";
import SetupInvites from "./pages/SetupInvites";
import BannerManager from "./pages/BannerManager";
import ScriptEditor from "./pages/ScriptEditor";
import Payouts from "./pages/Payouts";
import AdminPayouts from "./pages/AdminPayouts";
import SalesPhasesAdmin from "./pages/SalesPhasesAdmin";
import CompetitorLookupPage from "./pages/CompetitorLookupPage";
import CallAnalyzerPage from "./pages/CallAnalyzerPage";
import Documents from "./pages/Documents";
import DocumentsAdmin from "./pages/DocumentsAdmin";
import NotFound from "./pages/NotFound";

// Blueprint Pages
import BlueprintHandshake from "./pages/blueprint/BlueprintHandshake";
import BlueprintDreamState from "./pages/blueprint/BlueprintDreamState";
import BlueprintPainPoints from "./pages/blueprint/BlueprintPainPoints";
import BlueprintBridge from "./pages/blueprint/BlueprintBridge";
import BlueprintQualification from "./pages/blueprint/BlueprintQualification";
import BlueprintDiscovery from "./pages/blueprint/BlueprintDiscovery";
import BlueprintPresentation from "./pages/blueprint/BlueprintPresentation";
import BlueprintPricing from "./pages/blueprint/BlueprintPricing";
import BlueprintCompletion from "./pages/blueprint/BlueprintCompletion";
import BlueprintSuccess from "./pages/blueprint/BlueprintSuccess";

const queryClient = new QueryClient();

// Protected route for member-facing pages: requires EITHER a member ID session OR a logged-in account
function MemberRoute({ children }: { children: React.ReactNode }) {
  const { member, loading: memberLoading } = useMember();
  const { user, loading: authLoading } = useAuth();

  if (memberLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!member && !user) {
    return <Navigate to="/member-entry" replace />;
  }

  return <>{children}</>;
}

// Protected route for admin access (requires auth + admin role)
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public entry points */}
      <Route path="/member-entry" element={<MemberEntry />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/setup/:token" element={<SetupWizard />} />

      {/* Sales Hub - main landing page (gated) */}
      <Route path="/" element={<MemberRoute><SalesHub /></MemberRoute>} />

      {/* Member-gated sales tools */}
      <Route path="/sales-process" element={<MemberRoute><SalesProcess /></MemberRoute>} />
      <Route path="/log-sale" element={<MemberRoute><LogSale /></MemberRoute>} />
      <Route path="/my-sales" element={<MemberRoute><MySales /></MemberRoute>} />
      <Route path="/scripts" element={<MemberRoute><Scripts /></MemberRoute>} />
      <Route path="/dashboard" element={<MemberRoute><Dashboard /></MemberRoute>} />
      <Route path="/objection-playbook" element={<MemberRoute><ObjectionPlaybook /></MemberRoute>} />
      <Route path="/sales-training" element={<MemberRoute><SalesTraining /></MemberRoute>} />
      <Route path="/payouts" element={<MemberRoute><Payouts /></MemberRoute>} />
      <Route path="/competitor-lookup" element={<MemberRoute><CompetitorLookupPage /></MemberRoute>} />
      <Route path="/call-analyzer" element={<MemberRoute><CallAnalyzerPage /></MemberRoute>} />
      <Route path="/documents" element={<MemberRoute><Documents /></MemberRoute>} />
      <Route
        path="/admin/documents"
        element={
          <AdminRoute>
            <DocumentsAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/payouts"
        element={
          <AdminRoute>
            <AdminPayouts />
          </AdminRoute>
        }
      />

      {/* Blueprint Session Routes (gated) */}
      <Route path="/blueprint" element={<MemberRoute><BlueprintHandshake /></MemberRoute>} />
      <Route path="/blueprint/dream-state" element={<MemberRoute><BlueprintDreamState /></MemberRoute>} />
      <Route path="/blueprint/pain-points" element={<MemberRoute><BlueprintPainPoints /></MemberRoute>} />
      <Route path="/blueprint/bridge" element={<MemberRoute><BlueprintBridge /></MemberRoute>} />
      <Route path="/blueprint/qualification" element={<MemberRoute><BlueprintQualification /></MemberRoute>} />
      <Route path="/blueprint/discovery" element={<MemberRoute><BlueprintDiscovery /></MemberRoute>} />
      <Route path="/blueprint/presentation" element={<MemberRoute><BlueprintPresentation /></MemberRoute>} />
      <Route path="/blueprint/pricing" element={<MemberRoute><BlueprintPricing /></MemberRoute>} />
      <Route path="/blueprint/completion" element={<MemberRoute><BlueprintCompletion /></MemberRoute>} />
      <Route path="/blueprint/success" element={<MemberRoute><BlueprintSuccess /></MemberRoute>} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/setup-invites"
        element={
          <AdminRoute>
            <SetupInvites />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/banners"
        element={
          <AdminRoute>
            <BannerManager />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scripts"
        element={
          <AdminRoute>
            <ScriptEditor />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scripts/:id"
        element={
          <AdminRoute>
            <ScriptEditor />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sales-phases"
        element={
          <AdminRoute>
            <SalesPhasesAdmin />
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MemberProvider>
            <BlueprintProvider>
              <AppRoutes />
            </BlueprintProvider>
          </MemberProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
