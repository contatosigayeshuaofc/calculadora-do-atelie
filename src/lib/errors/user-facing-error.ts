const DEFAULT_USER_FACING_ERROR = "Nao foi possivel concluir a acao. Tente novamente.";

export const technicalErrorPattern =
  /(?:NEXT_PUBLIC_|SUPABASE_|[a-z]+_[a-z_]+|[A-Z]{2,}_|permission denied|duplicate key|violates|schema cache|invalid input syntax|relation |function |table |column |uuid|JSON|SQL|PostgREST|PGRST|AuthApiError|[{}[\]`"])/i;

export function getUserFacingErrorMessage(
  error: unknown,
  fallback = DEFAULT_USER_FACING_ERROR,
): string {
  const message = error instanceof Error ? error.message : "";
  const trimmedMessage = message.trim();

  if (!trimmedMessage || technicalErrorPattern.test(trimmedMessage)) {
    return fallback;
  }

  return trimmedMessage;
}
