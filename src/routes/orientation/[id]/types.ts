import type { Orientation } from "../../(modeles-services)/services/[slug]/orienter/types";

export interface SendOrientation extends Orientation {
  id: string;
  creationDate: string;
  processingDate?: string;
  status: "OUVERTE" | "VALIDÉE" | "REFUSÉE";
}
