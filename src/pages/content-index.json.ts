import { getCollection } from "astro:content";
import { buildContentIndex, publicContentIndex } from "$lib/content/index";

export async function GET() {
  const entries = await getCollection("docs");
  const notes = publicContentIndex(buildContentIndex(entries));
  return new Response(JSON.stringify({ notes }), { headers: { "content-type": "application/json; charset=utf-8" } });
}
