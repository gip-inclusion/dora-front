import { writable } from "svelte/store";

export const preventInclusionFormAutoSwitch = writable<boolean>(false);
