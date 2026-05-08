import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { MemberProvider, useMember } from "@/hooks/useMember";
import { BlueprintProvider } from "@/hooks/useBlueprintSession";

// Pages
import SalesHub from "./pages/SalesHub";
import AdminLogin from "./pages/AdminLogin";
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

// Protected route for member access (no auth required, just member ID)
function MemberRoute({ children }: { children: React.ReactNode }) {
  const { member, loading } = useMember();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!member) {
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
      {/* Sales Hub - main landing page */}
      <Route path="/" element={<SalesHub />} />
      
      {/* Sales tools - open access for now */}
      <Route path="/sales-process" element={<SalesProcess />} />
      <Route path="/log-sale" element={<LogSale />} />
      <Route path="/my-sales" element={<MySales />} />
      <Route path="/scripts" element={<Scripts />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/objection-playbook" element={<ObjectionPlaybook />} />
      <Route path="/sales-training" element={<SalesTraining />} />
      <Route path="/payouts" element={<Payouts />} />
      <Route
        path="/admin/payouts"
        element={
          <AdminRoute>
            <AdminPayouts />
          </AdminRoute>
        }
      />
      
      {/* Blueprint Session Routes */}
      <Route path="/blueprint" element={<BlueprintHandshake />} />
      <Route path="/blueprint/dream-state" element={<BlueprintDreamState />} />
      <Route path="/blueprint/pain-points" element={<BlueprintPainPoints />} />
      <Route path="/blueprint/bridge" element={<BlueprintBridge />} />
      <Route path="/blueprint/qualification" element={<BlueprintQualification />} />
      <Route path="/blueprint/discovery" element={<BlueprintDiscovery />} />
      <Route path="/blueprint/presentation" element={<BlueprintPresentation />} />
      <Route path="/blueprint/pricing" element={<BlueprintPricing />} />
      <Route path="/blueprint/completion" element={<BlueprintCompletion />} />
      <Route path="/blueprint/success" element={<BlueprintSuccess />} />
      
      {/* Admin routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/setup/:token" element={<SetupWizard />} />
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
