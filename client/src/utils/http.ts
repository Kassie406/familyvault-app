type Json = Record<string, any>;

export async function postJsonNoAbort<T = Json>(
  url: string,
  body: Json,
  { timeoutMs = 15000 }: { timeoutMs?: number } = {}
): Promise<T> {
  // Promise that resolves to a timeout result (no AbortError)
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Service timeout: no response from server")), timeoutMs);
  });

  // The real network call
  const fetchPromise = (async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {}),
      credentials: "include",
      cache: "no-store",
    });

    const ct = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!ct.includes("application/json")) {
      throw new Error(`Non-JSON response (likely SPA/HTML). status=${res.status} body=${text.slice(0,120)}`);
    }
    const data = JSON.parse(text);
    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    return data as T;
  })();

  // Race them WITHOUT AbortController
  return Promise.race([fetchPromise, timeoutPromise]);
}