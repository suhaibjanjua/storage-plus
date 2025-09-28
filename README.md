# StoragePlus

A lightweight TypeScript wrapper for `localStorage` and `sessionStorage` with auto-expiry and namespacing support.

## Features

✨ **Auto-expiry**: Store items with TTL (time-to-live) that automatically expire  
🏷️ **Namespacing**: Avoid key collisions with customizable namespace prefixes  
🔄 **Unified API**: Consistent interface for both localStorage and sessionStorage  
🛡️ **Type Safe**: Full TypeScript support with proper type definitions  
📦 **Lightweight**: No dependencies, minimal footprint  
🔧 **Fallback Handling**: Graceful degradation when storage is unavailable  

## Installation

```bash
npm install @sj-utils/storage-plus
```

## Quick Start

```typescript
import { storage, createLocalStorage, createSessionStorage } from '@sj-utils/storage-plus';

// Use default instances
storage.local.set('user', { name: 'John', age: 30 });
storage.session.set('token', 'abc123', { ttl: 3600000 }); // 1 hour

// Or create custom instances
const userStorage = createLocalStorage({ 
  namespace: 'user', 
  defaultTTL: 86400000 // 24 hours
});

userStorage.set('preferences', { theme: 'dark' });
```

## API Reference

### Creating Storage Instances

#### `createLocalStorage(options?)`
Creates a StoragePlus instance using localStorage.

#### `createSessionStorage(options?)`
Creates a StoragePlus instance using sessionStorage.

#### Options
```typescript
interface StoragePlusOptions {
  namespace?: string;        // Prefix for all keys
  defaultTTL?: number;      // Default TTL in milliseconds
  enableWarnings?: boolean; // Show console warnings (default: true)
}
```

### Storage Methods

#### `set(key, value, options?)`
Store a value with optional expiry.

```typescript
storage.local.set('user', { name: 'John' });
storage.local.set('temp', 'data', { ttl: 5000 }); // Expires in 5 seconds
```

#### `get(key)`
Retrieve a value. Returns `null` if not found or expired.

```typescript
const user = storage.local.get('user');
const temp = storage.local.get('temp'); // null if expired
```

#### `has(key)`
Check if a key exists and is not expired.

```typescript
if (storage.local.has('user')) {
  console.log('User data exists');
}
```

#### `remove(key)`
Remove a specific key.

```typescript
storage.local.remove('user');
```

#### `clear()`
Remove all keys in the namespace.

```typescript
storage.local.clear();
```

## License

MIT © [Suhaib Janjua](mailto:suhaib.janjua@gmail.com)