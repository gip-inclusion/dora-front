import { CANONICAL_URL } from "$lib/env";
import { setToken } from "$lib/utils/auth";
import { redirect } from "@sveltejs/kit";

export const load = ({ params }) => {
	console.log("PC_CALLBACK");
	
	const token = params.token;
	setToken(token);

	// home pour l'instant
	redirect(302, CANONICAL_URL);
};
