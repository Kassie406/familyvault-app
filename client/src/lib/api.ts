const inflight = new Map<string, AbortController>();

function key(url: string, init?: RequestInit) {
  const m = (init?.method || "GET").toUpperCase();
  const b = init?.body && typeof init.body !== "string"
    ? JSON.stringify(init.body)
    : (init?.body as string | undefined);
  return `${m}:${url}:${b ?? ""}`;
}

export async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const k = key(url, init);
  const prev = inflight.get(k);
  if (prev) prev.abort();

  const ctrl = new AbortController();
  inflight.set(k, ctrl);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) {
      let msg = res.statusText;
      try { msg = await res.text(); } catch {}
      throw new Error(msg || `HTTP ${res.status}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return (await res.json()) as T;
    return (await res.text()) as unknown as T;
  } finally {
    inflight.delete(k);
  }
}