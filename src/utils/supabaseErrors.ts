import { PostgrestError } from "@supabase/supabase-js";

export class SupabaseError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: string,
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

export const handleSupabaseError = (error: PostgrestError | null): void => {
  if (!error) return;

  const supabaseError = new SupabaseError(
    error.code || "UNKNOWN_ERROR",
    error.message || "An unknown error occurred",
    error.details,
  );

  console.error("Supabase Error:", supabaseError);
  throw supabaseError;
};

export const isSupabaseError = (error: unknown): error is PostgrestError => {
  return error instanceof Object && "code" in error && "message" in error;
};

export const formatSupabaseError = (error: unknown): string => {
  if (error instanceof SupabaseError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
