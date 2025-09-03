export async function postJson<T>(url: string, body: unknown, opts?: { timeoutMs?: number }) {
  const timeoutMs = opts?.timeoutMs ?? 15000; // 15s cap
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: ctrl.signal,
      credentials: "include",
    });

    const ct = res.headers.get("content-type") || "";
    const text = await res.text();

    // ensure JSON
    if (!ct.includes("application/json")) {
      throw new Error(`Non-JSON response: status=${res.status} body=${text.slice(0,120)}`);
    }

    const data = JSON.parse(text);
    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    return data as T;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      // user-visible, but do NOT throw to overlay
      throw new Error("Generation timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(t);
  }
}