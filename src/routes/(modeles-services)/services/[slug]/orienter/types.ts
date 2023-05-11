import type { CustomizableFK } from "$lib/types";

export interface Orientation {
  nom: string;
  accessConditions: CustomizableFK[];
  concernedPublic: CustomizableFK[];
}
