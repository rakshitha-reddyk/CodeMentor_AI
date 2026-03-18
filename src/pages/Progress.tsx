import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useUser";
import { useUserProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Progress from "@/components/Progress";

const ProgressPage = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { data: user } = useCurrentUser();
  const { data: progress } = useUserProgress(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="max-w-md mx-auto mt-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your progress.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Progress</h1>
          <Progress progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
