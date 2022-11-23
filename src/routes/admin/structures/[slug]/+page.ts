import { error } from "@sveltejs/kit";
import { getStructureAdmin } from "$lib/admin";

export async function load({ params }) {
  const structure = await getStructureAdmin(params.slug);
  if (!structure) {
    throw error(404, "Page Not Found");
  }

  return {
    structure,
  };
}