export class Web3Error extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'Web3Error';
  }
}

export class IPFSError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'IPFSError';
  }
}

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    // MetaMask errors
    if ('code' in error && typeof error.code === 'number') {
      switch (error.code) {
        case 4001:
          return new Web3Error('Transaction rejected by user', 'USER_REJECTED');
        case -32602:
          return new Web3Error('Invalid parameters', 'INVALID_PARAMS');
        default:
          return new Web3Error(error.message, `CODE_${error.code}`, error);
      }
    }
    return error;
  }
  return new Error('An unknown error occurred');
}

export function isUserRejection(error: unknown): boolean {
  return error instanceof Web3Error && error.code === 'USER_REJECTED';
} 