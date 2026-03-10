import { useState, useEffect } from "react";
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
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check if we already have a session (user just clicked the link)
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Initial session detected");
        setIsRecovery(true);
      }
    };
    checkInitialSession();

    // 2. Listen for the specific PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      // We attempt the update directly. If the session is invalid, 
      // Supabase will return an error which we catch below.
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // SUCCESS PATH
        setSuccess(true);
        
        // Final cleanup: Sign out so they have to log in with the NEW password
        await supabase.auth.signOut();
        
        // Automatic redirect after a short delay
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      console.error("Exception:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
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
            <h1 className="font-display text-3xl font-bold text-foreground">Password updated!</h1>
            <p className="text-muted-foreground">
              Your new password is set. We're taking you back to the login page...
            </p>
          </div>
          <Button onClick={() => navigate("/login")} className="w-full" variant="outline">
            Go to Login Now
          </Button>
        </div>
      </div>
    );
  }

  // 2. Invalid Session State UI
  if (!isRecovery && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-foreground">Invalid Link</h1>
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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