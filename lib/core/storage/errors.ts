/**
 * Core Storage - Errors
 * Errori tipizzati per gestione consistente degli errori storage
 */

export type StorageErrorCode = 
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'PROVIDER_ERROR'
  | 'STORAGE_FULL'
  | 'UNKNOWN';

export class StorageError extends Error {
  public readonly code: StorageErrorCode;
  public readonly retryable: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: StorageErrorCode,
    retryable: boolean = false,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'StorageError';
    this.code = code;
    this.retryable = retryable;
    this.details = details;

    // Mantiene lo stack trace corretto in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      retryable: this.retryable,
      details: this.details,
    };
  }
}

// Factory functions per errori comuni

export function notFoundError(resource: string, id?: string): StorageError {
  const message = id 
    ? `${resource} con id "${id}" non trovato`
    : `${resource} non trovato`;
  return new StorageError(message, 'NOT_FOUND', false, { resource, id });
}

export function alreadyExistsError(resource: string, identifier?: string): StorageError {
  const message = identifier
    ? `${resource} "${identifier}" esiste già`
    : `${resource} esiste già`;
  return new StorageError(message, 'ALREADY_EXISTS', false, { resource, identifier });
}

export function validationError(message: string, field?: string): StorageError {
  return new StorageError(message, 'VALIDATION_ERROR', false, { field });
}

export function rateLimitedError(retryAfter?: number): StorageError {
  return new StorageError(
    'Troppi tentativi. Riprova più tardi.',
    'RATE_LIMITED',
    true,
    { retryAfter }
  );
}

export function networkError(originalError?: Error): StorageError {
  return new StorageError(
    'Errore di connessione. Verifica la tua connessione internet.',
    'NETWORK_ERROR',
    true,
    { originalError: originalError?.message }
  );
}

export function unauthorizedError(): StorageError {
  return new StorageError(
    'Sessione scaduta. Effettua nuovamente il login.',
    'UNAUTHORIZED',
    false
  );
}

export function forbiddenError(action?: string): StorageError {
  const message = action
    ? `Non hai i permessi per ${action}`
    : 'Non hai i permessi per questa azione';
  return new StorageError(message, 'FORBIDDEN', false, { action });
}

export function providerError(message: string, originalError?: Error): StorageError {
  return new StorageError(
    message,
    'PROVIDER_ERROR',
    true,
    { originalError: originalError?.message }
  );
}

export function storageFullError(): StorageError {
  return new StorageError(
    'Spazio di archiviazione esaurito.',
    'STORAGE_FULL',
    false
  );
}

// Type guard per verificare se è uno StorageError
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

// Helper per gestire errori in modo consistente
export function handleStorageError(error: unknown): StorageError {
  if (isStorageError(error)) {
    return error;
  }

  if (error instanceof Error) {
    // Gestisce errori di quota localStorage
    if (error.name === 'QuotaExceededError') {
      return storageFullError();
    }

    // Gestisce errori di rete
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return networkError(error);
    }

    return providerError(error.message, error);
  }

  return new StorageError(
    'Errore sconosciuto',
    'UNKNOWN',
    false,
    { originalError: String(error) }
  );
}


