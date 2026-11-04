// Pages Function: GET /api/announcement
// Proxies the banner from your worker. No wrangler.toml needed: add the service binding in the
// Cloudflare dashboard (Pages project > Settings > Bindings > Add > Service binding, name: ANNOUNCE).
const URL_FALLBACK = "https://ride-metro.felixfeger46.workers.dev/api/announcement";

export async function onRequestGet({ env }) {  // visit /api/announcement to see errors
  try {
    const res = env.ANNOUNCE
      ? await env.ANNOUNCE.fetch(URL_FALLBACK, { headers: { Accept: "application/json" } })
      : await fetch(URL_FALLBACK, { headers: { Accept: "application/json" } });
    const text = await res.text();
    if (!res.ok) throw new Error("upstream HTTP " + res.status + ": " + text.slice(0, 200));
    try { JSON.parse(text); } catch { throw new Error("upstream did not return JSON: " + text.slice(0, 100)); }
    return new Response(text, {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "announcement unavailable", detail: String(e.message || e), binding: !!env.ANNOUNCE }), {
      status: 502, headers: { "Content-Type": "application/json" },
    });
  }
}
