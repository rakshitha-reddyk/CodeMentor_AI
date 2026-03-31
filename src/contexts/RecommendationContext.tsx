import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { recommendationService } from "@/services/recommendationService";

interface RecommendationContextType {
  invalidateRecommendations: (userId: string) => void;
  refreshRecommendations: (userId: string) => void;
}

const RecommendationContext = createContext<
  RecommendationContextType | undefined
>(undefined);

export const RecommendationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const invalidateRecommendations = useCallback((userId: string) => {
    recommendationService.invalidateCache(userId);
  }, []);

  const refreshRecommendations = useCallback((userId: string) => {
    recommendationService.refreshUserRecommendations(userId);
  }, []);

  const value: RecommendationContextType = {
    invalidateRecommendations,
    refreshRecommendations,
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendationContext = (): RecommendationContextType => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error(
      "useRecommendationContext must be used within RecommendationProvider",
    );
  }
  return context;
};
