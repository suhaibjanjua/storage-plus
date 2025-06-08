/**
 * Configuration options for StoragePlus instances
 */
export interface StoragePlusOptions {
  /** Namespace prefix for all keys to avoid collisions */
  namespace?: string;
  /** Default TTL in milliseconds for stored items */
  defaultTTL?: number;
  /** Whether to show warnings when storage quota is exceeded */
  enableWarnings?: boolean;
}

/**
 * Stored item structure with expiry information
 */
export interface StorageItem<T = unknown> {
  /** The actual stored value */
  value: T;
  /** Timestamp when the item expires (null for no expiry) */
  expiresAt: number | null;
  /** Timestamp when the item was created */
  createdAt: number;
}

/**
 * Options for setting individual items
 */
export interface SetOptions {
  /** TTL in milliseconds for this specific item */
  ttl?: number;
}