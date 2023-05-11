import { writable } from "svelte/store";
import type { Orientation } from "./types";

export const orientation = writable<Orientation>({});
