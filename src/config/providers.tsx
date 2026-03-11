import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

/**
 * Application Provider Setup
 *
 * This shows how to properly initialize the app with:
 * - React Query for data fetching and caching
 * - Supabase Auth Provider for authentication state
 *
 * Usage:
 * ```tsx
 * function App() {
 *   return (
 *     <AppProviders>
 *       <YourRoutes />
 *     </AppProviders>
 *   );
 * }
 * ```
 */

// Create a root query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root provider component that wraps the entire application
 * Provides authentication and data fetching capabilities
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>{children}</AuthProvider>
  </QueryClientProvider>
);

export { queryClient };
