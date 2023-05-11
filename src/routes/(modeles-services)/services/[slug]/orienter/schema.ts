import * as v from "$lib/validation/schema-utils";

export const orientationStep1Schema: v.Schema = {
  concernedPublic: {
    label:
      "Cochez les éléments correspondants à la situation de la personne orientée",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
    required: true,
  },

  hasOtherConcernedPublic: { rules: [] },

  otherConcernedPublic: {
    default: "",
    rules: [v.isString()],
    post: [v.trim],
    required: (data) => {
      return data?.hasOtherConcernedPublic?.length;
    },
  },

  requirements: {
    label: "Merci de cocher les critères auxquelles le bénéficiaire répond",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },

  accessConditions: {
    label: "",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },
};

export const orientationStep2Schema: v.Schema = {
  referentLastName: {
    label: "Nom",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    required: true,
    maxLength: 255,
  },
  referentFirstName: {
    label: "Prénom",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    required: true,
    maxLength: 255,
  },
  referentPhone: {
    label: "Téléphone",
    default: "",
    pre: [v.removeAllNonDigits],
    rules: [v.isPhone()],
    maxLength: 10,
    required: true,
  },
  referentEmail: {
    label: "E-mail",
    default: "",
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
    maxLength: 255,
    required: true,
  },

  beneficiaryLastName: {
    label: "Nom",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    required: true,
    maxLength: 255,
  },
  beneficiaryFirstName: {
    label: "Prénom",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    required: true,
    maxLength: 255,
  },
  beneficiaryPhone: {
    label: "Téléphone",
    default: "",
    pre: [v.removeAllNonDigits],
    rules: [v.isPhone()],
    maxLength: 10,
    required: (data) => {
      return data?.beneficiaryContactPreferences?.includes("phone");
    },
  },
  beneficiaryEmail: {
    label: "E-mail",
    default: "",
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
    maxLength: 255,
    required: (data) => {
      return data?.beneficiaryContactPreferences?.includes("email");
    },
  },
  beneficiaryContactPreferences: {
    label: "Préférence de contact",
    default: [],
    rules: [v.isArray([v.isString()])],
    required: true,
  },
  beneficiaryOtherContactMethod: {
    label: "Autre",
    default: "",
    rules: [v.isString()],
    post: [v.trim],
    required: (data) => {
      return data?.beneficiaryContactPreferences?.includes("other");
    },
  },
  beneficiaryDisponibility: {
    label: "Disponibilité",
    default: null,
    rules: [v.isDate()],
    post: [v.nullEmpty],
  },
  orientationReasons: {
    rules: [v.isString()],
    post: [v.trim],
  },
};
