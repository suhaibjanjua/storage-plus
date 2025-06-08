export { StoragePlus } from './StoragePlus';
export { createLocalStorage, createSessionStorage, localStoragePlus, sessionStoragePlus } from './factory';
export type { StoragePlusOptions, StorageItem, SetOptions } from './types';

// Import for convenience exports
import { localStoragePlus, sessionStoragePlus } from './factory';

// Convenience exports
export const storage = {
  local: localStoragePlus,
  session: sessionStoragePlus,
};