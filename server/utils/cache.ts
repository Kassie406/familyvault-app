export type CacheEntry<T = any> = { value: T; expires: number };
const cache = new Map<string, CacheEntry>();

export function cacheKey(path: string, body: unknown) {
  return `${path}::${JSON.stringify(body)}`;
}

export function getCache<T>(key: string): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) { cache.delete(key); return null; }
  return hit.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, { value, expires: Date.now() + ttlMs });
}