import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Shield } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as "email" | "password"] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      toast({ title: mode === "signin" ? "Login Failed" : "Sign Up Failed", description: error.message, variant: "destructive" });
      return;
    }
    if (mode === "signup") {
      toast({ title: "Check your email", description: "We sent you a confirmation link to finish signing up." });
      return;
    }
    toast({ title: "Welcome back!", description: "You've been signed in." });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Access Sales Hub with your account"
                : "Sign up to access Sales Hub"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  disabled={loading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  disabled={loading}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={loading}
              onClick={async () => {
                const result = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (result.error) {
                  toast({
                    title: "Google sign-in failed",
                    description: result.error.message,
                    variant: "destructive",
                  });
                }
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="mt-4 text-center text-sm">
              {mode === "signin" ? (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary hover:underline"
                >
                  Don't have an account? Sign up
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-primary hover:underline"
                >
                  Already have an account? Sign in
                </button>
              )}
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
      </div>
    </div>
  );
}
