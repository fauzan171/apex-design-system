export const onRequest = async (context) => {
  // This dummy middleware allows Cloudflare Pages to recognize this project 
  // as having Functions, which unlocks the ability to use Environment Variables
  // in the Cloudflare Dashboard for "static assets only" projects.
  return context.next();
};
