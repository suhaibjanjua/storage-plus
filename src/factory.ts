import { StoragePlus } from './StoragePlus';
import { StoragePlusOptions } from './types';

/**
 * Factory functions for creating StoragePlus instances
 */

/**
 * Create a StoragePlus instance for localStorage
 */
export function createLocalStorage(options?: StoragePlusOptions): StoragePlus {
  return new StoragePlus(window.localStorage, options);
}

/**
 * Create a StoragePlus instance for sessionStorage
 */
export function createSessionStorage(options?: StoragePlusOptions): StoragePlus {
  return new StoragePlus(window.sessionStorage, options);
}

/**
 * Default localStorage instance with no namespace
 */
export const localStoragePlus = createLocalStorage();

/**
 * Default sessionStorage instance with no namespace
 */
export const sessionStoragePlus = createSessionStorage();