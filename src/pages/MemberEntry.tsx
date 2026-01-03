import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMember } from "@/hooks/useMember";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, BarChart3, FileText, Target, Shield } from "lucide-react";

export default function MemberEntry() {
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { lookupMember } = useMember();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!memberId.trim()) {
      setError("Please enter your Member ID");
      return;
    }

    setLoading(true);
    const result = await lookupMember(memberId);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      toast({
        title: "Access Denied",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome!",
        description: "You've been signed in successfully.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Sales Hub</CardTitle>
            <CardDescription>
              Enter your Member ID to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  type="text"
                  placeholder="e.g., SP001"
                  value={memberId}
                  onChange={(e) => {
                    setMemberId(e.target.value.toUpperCase());
                    setError("");
                  }}
                  className="text-center text-lg tracking-widest uppercase"
                  disabled={loading}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Access Dashboard"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-4">
                What you can do in Sales Hub:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span>Track Sales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>View Scripts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  <span>Sales Process</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Follow-ups</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Link 
                to="/admin-login" 
                className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="h-3 w-3" />
                Admin Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Don't have a Member ID? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
