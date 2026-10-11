import { rm } from 'node:fs/promises';

// Remove only generated build output so deployment never includes stale chunks.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
