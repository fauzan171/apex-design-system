/**
 * Worker entry point for API proxy.
 *
 * This Worker:
 * 1. Proxies /api/* requests to the backend API server
 * 2. Returns 404 for other requests (handled by SPA fallback via not_found_handling)
 *
 * Configuration:
 * - Set API_URL in Cloudflare Dashboard: Workers > apex-design-system > Settings > Variables
 * - For staging: API_URL = "https://appex-erp-be-staging.itobsidianmuda.workers.dev"
 * - For production: API_URL = "https://appex-erp-be-production.itobsidianmuda.workers.dev"
 *
 * Note: This worker only handles /api/* routes via run_worker_first configuration.
 * All other routes are served by static assets with SPA fallback.
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Proxy API requests to backend
    if (url.pathname.startsWith("/api/")) {
      return proxyAPI(request, env, url);
    }

    // Return 404 for non-API routes - SPA fallback will handle this
    return new Response(null, { status: 404 });
  },
};

/**
 * Proxy API requests to the backend server
 */
async function proxyAPI(request, env, url) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": url.origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Get backend URL from environment variable (set in Cloudflare Dashboard)
  const apiBaseUrl = env.API_URL || "https://appex-erp-be-staging.itobsidianmuda.workers.dev";

  // Construct target URL
  const targetUrl = new URL(url.pathname + url.search, apiBaseUrl);

  // Clone request headers and forward them
  const headers = new Headers(request.headers);
  headers.set("Host", targetUrl.host);

  // Create proxied request
  const proxiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: "manual",
  });

  try {
    // Forward request to backend
    const response = await fetch(proxiedRequest);

    // Clone response to modify headers
    const modifiedResponse = new Response(response.body, response);

    // Copy Set-Cookie headers and modify for cross-origin
    const setCookie = response.headers.get("Set-Cookie");
    if (setCookie) {
      // Remove Secure flag and adjust SameSite for development
      const modifiedCookie = setCookie
        .replace(/;\s*Secure/gi, "")
        .replace(/;\s*SameSite=Strict/gi, "; SameSite=Lax");
      modifiedResponse.headers.set("Set-Cookie", modifiedCookie);
    }

    // Add CORS headers if needed
    modifiedResponse.headers.set("Access-Control-Allow-Origin", url.origin);
    modifiedResponse.headers.set("Access-Control-Allow-Credentials", "true");
    modifiedResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    modifiedResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return modifiedResponse;
  } catch (error) {
    console.error("API proxy error:", error);
    return new Response(JSON.stringify({ error: "API proxy failed", message: error.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
