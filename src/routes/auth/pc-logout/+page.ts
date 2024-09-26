import { CANONICAL_URL } from "$lib/env";
import { disconnect, setToken } from "$lib/utils/auth";
import { redirect } from "@sveltejs/kit";

export const load = () => {
	console.log("PC_LOGOUT");
	disconnect();
	redirect(302, "https://localhost/oidc/pre_logout");
};
