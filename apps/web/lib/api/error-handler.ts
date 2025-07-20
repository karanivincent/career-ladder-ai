export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: any): never {
  console.error('API Error:', error);

  // Network errors
  if (error.message === 'Failed to fetch') {
    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection.',
      0,
    );
  }

  // Timeout errors
  if (error.name === 'AbortError') {
    throw new ApiError('Request timed out. Please try again.', 408);
  }

  // API errors with status codes
  if (error instanceof ApiError) {
    throw error;
  }

  // Rate limiting
  if (error.statusCode === 429) {
    throw new ApiError(
      'Too many requests. Please slow down and try again.',
      429,
    );
  }

  // Server errors
  if (error.statusCode >= 500) {
    throw new ApiError(
      'Server error. Please try again later.',
      error.statusCode,
    );
  }

  // Client errors
  if (error.statusCode >= 400) {
    throw new ApiError(
      error.message || 'Invalid request. Please check your input.',
      error.statusCode,
    );
  }

  // Unknown errors
  throw new ApiError(
    'An unexpected error occurred. Please try again.',
    500,
    error,
  );
}

// Toast notification helper
export function showErrorToast(error: any) {
  const message = error instanceof ApiError 
    ? error.message 
    : 'An unexpected error occurred';
  
  // In a real app, you'd use a toast library like react-hot-toast
  // For now, we'll use alert
  alert(message);
}