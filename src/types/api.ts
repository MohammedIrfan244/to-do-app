
// Utility / Generic API Response
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | null;
}