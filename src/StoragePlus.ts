import { StoragePlusOptions, StorageItem, SetOptions } from './types';

/**
 * StoragePlus - A wrapper for localStorage and sessionStorage with auto-expiry and namespacing
 */
export class StoragePlus {
  private storage: Storage;
  private namespace: string;
  private defaultTTL: number | null;
  private enableWarnings: boolean;

  constructor(storage: Storage, options: StoragePlusOptions = {}) {
    this.storage = storage;
    this.namespace = options.namespace ? `${options.namespace}:` : '';
    this.defaultTTL = options.defaultTTL || null;
    this.enableWarnings = options.enableWarnings ?? true;

    // Test if storage is available
    this.testStorage();
  }

  /**
   * Test if the storage is available and working
   */
  private testStorage(): void {
    try {
      const testKey = `${this.namespace}__test__`;
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Storage is not available or in private mode');
      }
    }
  }

  /**
   * Generate the full key with namespace prefix
   */
  private getKey(key: string): string {
    return `${this.namespace}${key}`;
  }

  /**
   * Check if an item has expired
   */
  private isExpired(item: StorageItem): boolean {
    if (item.expiresAt === null) {
      return false;
    }
    return Date.now() > item.expiresAt;
  }

  /**
   * Parse stored JSON data safely
   */
  private parseStoredData(data: string): StorageItem | null {
    try {
      const parsed = JSON.parse(data);
      // Validate the structure
      if (typeof parsed === 'object' && 'value' in parsed && 'createdAt' in parsed) {
        return parsed as StorageItem;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Store an item with optional expiry
   */
  set<T>(key: string, value: T, options: SetOptions = {}): boolean {
    try {
      const ttl = options.ttl ?? this.defaultTTL;
      const now = Date.now();
      const expiresAt = ttl ? now + ttl : null;

      const item: StorageItem<T> = {
        value,
        expiresAt,
        createdAt: now,
      };

      const fullKey = this.getKey(key);
      this.storage.setItem(fullKey, JSON.stringify(item));
      return true;
    } catch (error) {
      if (this.enableWarnings) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('StoragePlus: Storage quota exceeded');
        } else {
          console.warn('StoragePlus: Failed to set item', error);
        }
      }
      return false;
    }
  }

  /**
   * Retrieve an item, checking for expiry
   */
  get<T>(key: string): T | null {
    try {
      const fullKey = this.getKey(key);
      const data = this.storage.getItem(fullKey);

      if (data === null) {
        return null;
      }

      const item = this.parseStoredData(data);
      if (!item) {
        // Invalid data format, remove it
        this.storage.removeItem(fullKey);
        return null;
      }

      if (this.isExpired(item)) {
        // Item has expired, remove it
        this.storage.removeItem(fullKey);
        return null;
      }

      return item.value as T;
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Failed to get item', error);
      }
      return null;
    }
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove an item
   */
  remove(key: string): boolean {
    try {
      const fullKey = this.getKey(key);
      this.storage.removeItem(fullKey);
      return true;
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Failed to remove item', error);
      }
      return false;
    }
  }

  /**
   * Clear all items in the namespace
   */
  clear(): boolean {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.namespace)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => this.storage.removeItem(key));
      return true;
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Failed to clear storage', error);
      }
      return false;
    }
  }

  /**
   * Get all keys in the namespace (excluding expired items)
   */
  keys(): string[] {
    const keys: string[] = [];
    
    try {
      for (let i = 0; i < this.storage.length; i++) {
        const fullKey = this.storage.key(i);
        if (fullKey && fullKey.startsWith(this.namespace)) {
          const key = fullKey.substring(this.namespace.length);
          // Check if the item exists and is not expired
          if (this.has(key)) {
            keys.push(key);
          }
        }
      }
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Failed to get keys', error);
      }
    }

    return keys;
  }

  /**
   * Get the size of stored data in bytes (approximate)
   */
  size(): number {
    let totalSize = 0;
    
    try {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.namespace)) {
          const value = this.storage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Failed to calculate size', error);
      }
    }

    return totalSize;
  }

  /**
   * Clean up expired items
   */
  cleanup(): number {
    let removedCount = 0;
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < this.storage.length; i++) {
        const fullKey = this.storage.key(i);
        if (fullKey && fullKey.startsWith(this.namespace)) {
          const data = this.storage.getItem(fullKey);
          if (data) {
            const item = this.parseStoredData(data);
            if (item && this.isExpired(item)) {
              keysToRemove.push(fullKey);
            }
          }
        }
      }

      keysToRemove.forEach(key => {
        this.storage.removeItem(key);
        removedCount++;
      });
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Failed to cleanup expired items', error);
      }
    }

    return removedCount;
  }

  /**
   * Get information about a stored item
   */
  getInfo(key: string): { exists: boolean; createdAt?: number; expiresAt?: number | null; size?: number } {
    try {
      const fullKey = this.getKey(key);
      const data = this.storage.getItem(fullKey);

      if (data === null) {
        return { exists: false };
      }

      const item = this.parseStoredData(data);
      if (!item) {
        return { exists: false };
      }

      if (this.isExpired(item)) {
        // Clean up expired item
        this.storage.removeItem(fullKey);
        return { exists: false };
      }

      return {
        exists: true,
        createdAt: item.createdAt,
        expiresAt: item.expiresAt,
        size: data.length,
      };
    } catch (error) {
      if (this.enableWarnings) {
        console.warn('StoragePlus: Failed to get item info', error);
      }
      return { exists: false };
    }
  }
}