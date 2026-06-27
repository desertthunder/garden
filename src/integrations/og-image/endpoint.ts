import type { APIRoute } from "astro";
import { generateOgImage } from "./template";

export const GET: APIRoute = async () => generateOgImage();

export function getStaticPaths() {
  return [{}];
}

export const prerender = true;
