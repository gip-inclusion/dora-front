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
}
