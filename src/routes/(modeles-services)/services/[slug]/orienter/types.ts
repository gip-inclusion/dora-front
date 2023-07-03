import type { CustomizableFK } from "$lib/types";

export interface Orientation {
  otherConcernedPublic: string;
  requirements: CustomizableFK[];
  accessConditions: CustomizableFK[];
  concernedPublic: CustomizableFK[];

  referentLastName?: string;
  referentFirstName?: string;
  referentPhone?: string;
  referentEmail?: string;
  structure?: string;

  beneficiaryLastName?: string;
  beneficiaryFirstName?: string;
  beneficiaryDisponibility?: string;
  beneficiaryContactPreferences?: string[];
  beneficiaryPhone?: string;
  beneficiaryEmail?: string;
  beneficiaryOtherContactMethod?: string;
  orientationReasons?: string;
}
