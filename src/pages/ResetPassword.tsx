import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import fabcLogo from "@/assets/fabc-logo.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingRecovery, setIsCheckingRecovery] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, ""),
    );
    const searchParams = new URLSearchParams(window.location.search);
    const hasRecoveryParams =
      hashParams.has("access_token") ||
      hashParams.has("refresh_token") ||
      hashParams.get("type") === "recovery" ||
      searchParams.has("code") ||
      searchParams.get("type") === "recovery";

    // Avoid flashing the invalid-link UI while Supabase is still resolving
    // the recovery session from the URL tokens.
    const fallbackTimer = window.setTimeout(
      () => {
        if (isMounted) {
          setIsCheckingRecovery(false);
        }
      },
      hasRecoveryParams ? 2000 : 0,
    );

    const checkInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (session) {
        setIsRecovery(true);
        setIsCheckingRecovery(false);
        return;
      }

      if (error) {
        toast({
          title: "Invalid reset link",
          description: error.message,
          variant: "destructive",
        });
      }

      if (!hasRecoveryParams) {
        setIsCheckingRecovery(false);
      }
    };

    checkInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setIsRecovery(true);
        setIsCheckingRecovery(false);
        return;
      }

      if (event === "INITIAL_SESSION" && !session && !hasRecoveryParams) {
        setIsCheckingRecovery(false);
      }
    });

    subscriptionRef.current = subscription;

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    if (!isRecovery) {
      toast({
        title: "Invalid reset link",
        description:
          "Open the latest password reset link from your email and try again.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        subscriptionRef.current?.unsubscribe();
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
        });
        setSuccess(true);

        await supabase.auth.signOut();
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Success State UI
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Password updated!
            </h1>
            <p className="text-muted-foreground">
              Your new password is set. We're taking you back to the login
              page...
            </p>
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="w-full"
            variant="outline"
          >
            Go to Login Now
          </Button>
        </div>
      </div>
    );
  }

  if (isCheckingRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-3">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Verifying reset link
          </h1>
          <p className="text-muted-foreground">
            Please wait while we validate your password reset session.
          </p>
        </div>
      </div>
    );
  }

  // 2. Invalid Session State UI
  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Invalid Link
            </h1>
            <p className="text-muted-foreground">
              This reset link has expired or was already used.
            </p>
          </div>
          <Link to="/forgot-password">
            <Button className="w-full">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Main Form UI
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={fabcLogo} alt="FABC" className="h-10 w-auto" />
          <span className="font-display text-2xl font-bold text-foreground">
            Festac<span className="text-primary">Connect</span>
          </span>
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Set new password
        </h1>
        <p className="text-muted-foreground mb-8">
          Almost there! Enter your new secure password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
