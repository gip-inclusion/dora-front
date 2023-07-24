import content from "$lib/utils/cgu/content.md?raw";

export function GET() {
  return new Response(content, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
