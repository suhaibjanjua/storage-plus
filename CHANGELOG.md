# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-09

### Added
- Initial release of StoragePlus
- Auto-expiry functionality with TTL support
- Namespacing to avoid key collisions
- Unified API for localStorage and sessionStorage
- TypeScript support with full type definitions
- Graceful fallback handling for unavailable storage
- Comprehensive test suite
- Factory functions for easy instantiation
- Storage size monitoring and cleanup utilities
- Detailed item information retrieval

### Features
- `set(key, value, options)` - Store items with optional TTL
- `get(key)` - Retrieve items with automatic expiry checking
- `has(key)` - Check if key exists and is not expired
- `remove(key)` - Remove specific items
- `clear()` - Clear all items in namespace
- `keys()` - Get all active keys
- `size()` - Calculate storage size in bytes
- `cleanup()` - Remove expired items
- `getInfo(key)` - Get detailed item metadata

### Configuration Options
- `namespace` - Custom prefix for keys
- `defaultTTL` - Default time-to-live in milliseconds
- `enableWarnings` - Control console warning output

### Browser Support
- All modern browsers with localStorage/sessionStorage support
- ES2018+ compatibility
- Graceful degradation in private browsing mode