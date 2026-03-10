/**
 * Worker entry point for serving static assets with environment variable support.
 *
 * This Worker serves the built static assets (React SPA) and enables
 * environment variables and secrets in the Cloudflare Dashboard.
 *
 * Routing:
 * - Static assets (HTML, CSS, JS) are served automatically
 * - All other requests fall through to this Worker
 * - SPA routing: non-asset requests return index.html
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Example: Add API routes here if needed
    // if (url.pathname.startsWith("/api/")) {
    //   return handleAPI(request, env);
    // }

    // Serve static assets via the ASSETS binding
    // This handles SPA routing automatically (not_found_handling: "single-page-application")
    return env.ASSETS.fetch(request);
  },
};
