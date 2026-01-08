import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { CheckCircle2, Home, Plus, FileText, BarChart3 } from "lucide-react";

export default function BlueprintSuccess() {
  const { session, resetSession } = useBlueprintSession();

  useEffect(() => {
    // Clean up session after viewing success page
    return () => {
      resetSession();
    };
  }, []);

  const getDispositionLabel = (disposition: string) => {
    const labels: Record<string, string> = {
      closed: "Closed - Won",
      free: "Started Free Trial",
      follow_up: "Follow-Up Scheduled",
      not_qualified: "Not Qualified",
      no_show: "No Show",
    };
    return labels[disposition] || disposition;
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Session Complete!</h1>
            <p className="text-muted-foreground mb-6">
              Your blueprint session has been saved successfully.
            </p>

            {/* Session Summary */}
            <div className="bg-background rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Session Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prospect:</span>
                  <span className="font-medium">{session.prospectName}</span>
                </div>
                {session.prospectCompany && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{session.prospectCompany}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outcome:</span>
                  <span className="font-medium">{getDispositionLabel(session.disposition)}</span>
                </div>
                {session.selectedPlan && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium capitalize">
                      {session.selectedPlan.replace("_", " ")}
                    </span>
                  </div>
                )}
                {session.followUpDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Follow-up:</span>
                    <span className="font-medium">
                      {new Date(session.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/blueprint">
                  <Plus className="mr-2 h-5 w-5" />
                  Start New Session
                </Link>
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Sales Hub
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
