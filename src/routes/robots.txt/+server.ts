import { ENVIRONMENT } from "$lib/env";

const productionContent = `
User-agent: *
Disallow: /mon-compte/
Disallow: /auth/
`.trim();

const devContent = `
User-agent: *
Disallow: /
`.trim();

const content = ENVIRONMENT === "production" ? productionContent : devContent;

export async function GET() {
  return new Response(content, {
    headers: { "content-type": "text/plain" },
  });
}
