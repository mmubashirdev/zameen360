import { isAxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
): string => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }

  if (error && typeof error === "object") {
    const customError = error as {
      message?: unknown;
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
    };

    if (typeof customError.message === "string" && customError.message) {
      return customError.message;
    }

    if (
      customError.response?.data?.message ||
      customError.response?.data?.error
    ) {
      return (
        customError.response.data.message ||
        customError.response.data.error ||
        fallback
      );
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
