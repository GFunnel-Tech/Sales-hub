import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { MemberProvider, useMember } from "@/hooks/useMember";

// Pages
import SalesHub from "./pages/SalesHub";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import SalesProcess from "./pages/SalesProcess";
import LogSale from "./pages/LogSale";
import MySales from "./pages/MySales";
import Scripts from "./pages/Scripts";
import NotFound from "./pages/NotFound";

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
      
      {/* Admin routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
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
            <AppRoutes />
          </MemberProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
