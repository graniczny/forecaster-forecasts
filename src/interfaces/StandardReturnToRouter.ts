// Pilnować tej struktury odpowiedzi, error jako string.
export interface StandardReturnToRouter {
  status: number;
  body?: any;
  error?: string;
  message?: string;
}
