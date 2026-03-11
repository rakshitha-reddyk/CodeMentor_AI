import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Code, Brain, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SignInDialog } from "./SignInDialog";
import heroImage from "@/assets/hero-coding-ai.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const handleGetStarted = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      setShowSignInDialog(true);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-brand-secondary/15 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
          >
            <Zap className="w-4 h-4 mr-2" />
            🚀 AI-Powered Learning Revolution
          </Badge>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 animate-slide-up">
            <span className="block">🎓 Welcome to</span>
            <span className="text-gradient block">CodeMentor AI</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-2xl md:text-3xl text-muted-foreground mb-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            🚀 Empowering Students to Code{" "}
            <span className="text-brand-accent font-semibold">Smarter</span>,{" "}
            <span className="text-brand-primary font-semibold">Faster</span>,
            and{" "}
            <span className="text-brand-secondary font-semibold">Better</span>
          </p>

          <p
            className="text-xl text-muted-foreground mb-12 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            🌟 Learn. Debug. Grow. Repeat.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              variant="hero"
              size="lg"
              className="shadow-brand animate-pulse-glow"
              onClick={handleGetStarted}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Learning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-brand-primary/30 hover:bg-brand-primary/10"
              onClick={handleGetStarted}
            >
              <Code className="w-5 h-5 mr-2" />
              Try Interactive Demo
            </Button>
          </div>

          {/* Feature Pills */}
          <div
            className="flex flex-wrap justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex items-center px-4 py-2 bg-surface-elevated rounded-full border border-brand-primary/20">
              <Brain className="w-4 h-4 mr-2 text-brand-primary" />
              <span className="text-sm">Real-time AI Feedback</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-surface-elevated rounded-full border border-brand-secondary/20">
              <Code className="w-4 h-4 mr-2 text-brand-secondary" />
              <span className="text-sm">Multi-Language Support</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-surface-elevated rounded-full border border-brand-accent/20">
              <Zap className="w-4 h-4 mr-2 text-brand-accent" />
              <span className="text-sm">24/7 AI Mentor</span>
            </div>
          </div>
        </div>
      </div>
      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
      />
    </section>
  );
};

export default Hero;
