import type { CustomizableFK, Service } from "$lib/types";

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
  service?: Service;

  beneficiaryLastName?: string;
  beneficiaryFirstName?: string;
  beneficiaryDisponibility?: string;
  beneficiaryContactPreferences?: string[];
  beneficiaryPhone?: string;
  beneficiaryEmail?: string;
  beneficiaryOtherContactMethod?: string;
  orientationReasons?: string;

  files?: string[];
}

export interface SendOrientation extends Orientation {
  id: string;
  uid: string;
  sendDate: string;
  emailSubject: string;
  status: "ACCEPTED" | "REFUSED" | "PENDING";
  answerDate?: Date;
}
