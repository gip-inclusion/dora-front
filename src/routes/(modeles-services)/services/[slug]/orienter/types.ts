export interface Orientation {
  situation: string[];
  situationOther: string;
  requirements: string[];

  referentLastName?: string;
  referentFirstName?: string;
  referentPhone?: string;
  referentEmail?: string;
  prescriberStructure?: string;

  beneficiaryLastName?: string;
  beneficiaryFirstName?: string;
  beneficiaryAvailability?: string;
  beneficiaryContactPreferences?: string[];
  beneficiaryPhone?: string;
  beneficiaryEmail?: string;
  beneficiaryOtherContactMethod?: string;
  orientationReasons?: string;

  attachments: { [key: string]: string[] };
}

export interface SendOrientation extends Orientation {
  id: string;
  creationDate: string;
  emailSubject: string;
  answerDate?: string;
  status: "ACCEPTED" | "REFUSED" | "PENDING";
}
