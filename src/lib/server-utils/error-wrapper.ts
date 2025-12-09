import { error as logError } from "@/lib/helper/logger";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface AppError extends Error {
  code?: string;
  status?: number;
}

/**
 * Wraps async server action functions with error handling
 * @param fn - The async function to wrap
 * @returns The wrapped function that returns ApiResponse
 */
export function withErrorWrapper<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<ApiResponse<T>> {
  return async (...args: Args) => {
    try {
      const data = await fn(...args);
      return {
        success: true,
        data,
      };
    } catch (err) {
      const error = err as AppError;
      const errorMessage = error?.message || "An unexpected error occurred";
      const errorCode = error?.code || "INTERNAL_ERROR";

      logError("SERVER_ACTION_ERROR:", {
        message: errorMessage,
        code: errorCode,
        stack: error?.stack,
      });

      return {
        success: false,
        error: {
          message: errorMessage,
          code: errorCode,
        },
      };
    }
  };
}

/**
 * Wraps async functions and throws AppError on failure
 * @param fn - The async function to wrap
 * @param errorCode - Custom error code for this operation
 * @returns The wrapped function that throws AppError
 */
export function withThrowError<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  errorCode: string = "OPERATION_FAILED"
): (...args: Args) => Promise<T> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (err) {
      const error = err as AppError;
      const errorMessage = error?.message || "An unexpected error occurred";

      logError("WRAPPED_OPERATION_ERROR:", {
        message: errorMessage,
        code: errorCode,
        stack: error?.stack,
      });

      const appError = new Error(errorMessage) as AppError;
      appError.code = errorCode;
      throw appError;
    }
  };
}

/**
 * Safe error handler utility
 * Handles errors gracefully without throwing
 */
export function handleError(err: unknown): ApiResponse<null> {
  const error = err as AppError;
  const errorMessage = error?.message || "An unexpected error occurred";
  const errorCode = error?.code || "INTERNAL_ERROR";

  logError("ERROR_HANDLER:", {
    message: errorMessage,
    code: errorCode,
  });

  return {
    success: false,
    error: {
      message: errorMessage,
      code: errorCode,
    },
  };
}
