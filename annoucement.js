// Pages Function: GET /api/announcement
// Proxies the banner from your worker. No wrangler.toml needed: add the service binding in the
// Cloudflare dashboard (Pages project > Settings > Bindings > Add > Service binding, name: ANNOUNCE).
const URL_FALLBACK = "https://ride-metro.felixfeger46.workers.dev/api/announcement";

export async function onRequestGet({ env }) {
  try {
    const res = env.ANNOUNCE
      ? await env.ANNOUNCE.fetch(URL_FALLBACK, { headers: { Accept: "application/json" } })
      : await fetch(URL_FALLBACK, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return new Response(await res.text(), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "announcement unavailable" }), {
      status: 502, headers: { "Content-Type": "application/json" },
    });
  }
}
