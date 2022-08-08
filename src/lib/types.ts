export type Structure = {
  name: string;
  slug: string;
  numServices: number;
};

// eslint considère à tort que les valeurs enum ne sont pas utilisées...
export enum SERVICE_STATUSES {
  // eslint-disable-next-line no-unused-vars
  DRAFT = "DRAFT",
  // eslint-disable-next-line no-unused-vars
  SUGGESTION = "SUGGESTION",
  // eslint-disable-next-line no-unused-vars
  PUBLISHED = "PUBLISHED",
  // eslint-disable-next-line no-unused-vars
  ARCHIVED = "ARCHIVED",
}

// eslint considère à tort que les valeurs enum ne sont pas utilisées...
export enum SERVICE_UPDATE_STATUS {
  // eslint-disable-next-line no-unused-vars
  NOT_NEEDED = "NOT_NEEDED",
  // eslint-disable-next-line no-unused-vars
  NEEDED = "NEEDED",
  // eslint-disable-next-line no-unused-vars
  REQUIRED = "REQUIRED",
}

export type Service = {
  name: string;
  slug: string;

  contactName: string | undefined;
  contactPhone: string | undefined;
  contactEmail: string | undefined;

  locationKinds: string[] | undefined;
  remoteUrl: string | undefined;
  postalCode: string | undefined;
  address1: string | undefined;
  address2: string | undefined;
  city: string | undefined;

  department: string;
  isAvailable: boolean;
  structureInfo: Structure;
  canWrite: boolean;
  structure: string;
  status: SERVICE_STATUSES;
  model: string | undefined;
  shortDesc: string | undefined;
  hasAlreadyBeenUnpublished: boolean;
  isCumulative: boolean;
  hasFee: boolean;
  feeDetails: string | undefined;
  recurrence: string | undefined;
  creationDate: string;
  modificationDate: string | undefined;
  diffusionZoneDetailsDisplay: string | undefined;
};
