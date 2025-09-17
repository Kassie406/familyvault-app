const store = new Map<string, { at: number; data: any }>();
export function memo<T>(key: string, ttlMs: number, fn: () => Promise<T>) {
  return async () => {
    const hit = store.get(key);
    const now = Date.now();
    if (hit && now - hit.at < ttlMs) return hit.data as T;
    const data = await fn();
    store.set(key, { at: now, data });
    return data;
  };
}