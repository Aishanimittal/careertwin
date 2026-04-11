import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: ""
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ username: formData.username, password: formData.password });
      } else {
        await register(formData);
      }
      setLocation("/");
    } catch (error) {
      // Error is handled by hook toasts
    }
  };

  const isPending = isLoggingIn || isRegistering;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left side - Branding */}
      <div className="relative hidden overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Unsplash beautiful abstract architectural/career paths visual */}
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80" 
          alt="Abstract architecture representing career paths" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-3 animate-in-fade">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105">
            <img
              src="/favicon.png"
              alt="CareerTwin logo"
              className="h-7 w-7 object-contain"
            />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">CareerTwin</span>
        </div>
        
        <div className="relative z-10 max-w-lg space-y-6 animate-in-slide-up delay-200">
          <h1 className="text-5xl font-display font-bold leading-tight">
            Map your future with data-driven precision.
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Input your skills, academic background, and interests. Our AI-driven engine predicts your optimal career path and generates a step-by-step roadmap to get you there.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-xs font-bold">JD</div>
              <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-700 flex items-center justify-center text-xs font-bold">AS</div>
              <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-primary flex items-center justify-center text-xs font-bold">+2k</div>
            </div>
            <p className="text-sm text-zinc-400 font-medium">Join thousands predicting their future.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-in-fade">
          <div className="text-center lg:text-left animate-in-slide-up opacity-0 stagger-1">
            <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isLogin ? "Enter your details to access your dashboard." : "Start your career journey today."}
            </p>
          </div>

          <Card className="panel-shine animate-in-scale p-8 border-border/50 bg-card/70 shadow-xl shadow-black/10 backdrop-blur-sm opacity-0 stagger-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="h-12 bg-background"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="johndoe" 
                  className="h-12 bg-background"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && <a href="#" className="classic-hover text-xs font-medium text-primary">Forgot password?</a>}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 bg-background"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Create account"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="classic-hover font-semibold text-primary"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
