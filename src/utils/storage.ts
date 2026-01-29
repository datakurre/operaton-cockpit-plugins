/**
 * Storage abstraction for testable localStorage access
 *
 * @module utils/storage
 */

/**
 * Storage interface for dependency injection
 */
export interface Storage {
  /**
   * Get a value from storage
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  get(key: string): string | null;

  /**
   * Set a value in storage
   * @param key - The storage key
   * @param value - The value to store
   */
  set(key: string, value: string): void;

  /**
   * Remove a value from storage
   * @param key - The storage key
   */
  remove(key: string): void;
}

/**
 * Default localStorage implementation
 */
class LocalStorageAdapter implements Storage {
  /** Get a value from localStorage */
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  /** Set a value in localStorage */
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage may be unavailable or full
      console.warn(`Failed to save to localStorage: ${key}`);
    }
  }

  /** Remove a value from localStorage */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage may be unavailable
    }
  }
}

/**
 * In-memory storage for testing
 */
export class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  /** Get a value from memory */
  get(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  /** Set a value in memory */
  set(key: string, value: string): void {
    this.data.set(key, value);
  }

  /** Remove a value from memory */
  remove(key: string): void {
    this.data.delete(key);
  }

  /** Clear all stored values */
  clear(): void {
    this.data.clear();
  }
}

/** Default storage instance using localStorage */
let currentStorage: Storage = new LocalStorageAdapter();

/**
 * Get the current storage instance
 * @returns The active storage implementation
 */
export function getStorage(): Storage {
  return currentStorage;
}

/**
 * Set the storage implementation (useful for testing)
 * @param storage - The storage implementation to use
 */
export function setStorage(storage: Storage): void {
  currentStorage = storage;
}

/**
 * Reset storage to default localStorage implementation
 */
export function resetStorage(): void {
  currentStorage = new LocalStorageAdapter();
}
