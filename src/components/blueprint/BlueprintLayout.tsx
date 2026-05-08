import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { BlueprintProgressBar } from "./BlueprintProgressBar";
import { ScriptPhasePanel } from "./ScriptPhasePanel";
import { BLUEPRINT_PAGES } from "@/lib/blueprintConfig";

interface BlueprintLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentPage: number;
  showBack?: boolean;
  backPath?: string;
}

export function BlueprintLayout({
  children,
  title,
  subtitle,
  currentPage,
  showBack = true,
  backPath,
}: BlueprintLayoutProps) {
  const navigate = useNavigate();
  const { isSaving, lastSaved, saveSession } = useBlueprintSession();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBack && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Link to="/" className="font-bold text-xl text-primary">
                GFunnel
              </Link>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Saved</span>
                </>
              ) : null}
              <Button variant="outline" size="sm" onClick={saveSession} disabled={isSaving}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-background border-b py-4">
        <div className="container mx-auto px-4">
          <BlueprintProgressBar currentPage={currentPage} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </div>

          {/* Page Content */}
          {children}

          {/* Phase Navigation */}
          <div className="mt-8 flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => {
                const prev = BLUEPRINT_PAGES.find((p) => p.id === currentPage - 1);
                if (prev) navigate(prev.path);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous phase
            </Button>
            <span className="text-xs text-muted-foreground">
              Phase {currentPage} of {BLUEPRINT_PAGES.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= BLUEPRINT_PAGES.length}
              onClick={() => {
                const next = BLUEPRINT_PAGES.find((p) => p.id === currentPage + 1);
                if (next) navigate(next.path);
              }}
            >
              Next phase
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
