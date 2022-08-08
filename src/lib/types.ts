export type Structure = {
  name: string;
  slug: string;
  numServices: number;
};

/*
export enum ServiceStatus {
  draft = "DRAFT",
  suggestion = "SUGGESTION",
  published = "PUBLISHED",
  archived = "ARCHIVED",
}
*/

export type Service = {
  name: string;
  slug: string;
  isAvailable: boolean;
  structureInfo: Structure;
  // status: ServiceStatus;
  diffusionZoneDetailsDisplay: string | undefined;
};
