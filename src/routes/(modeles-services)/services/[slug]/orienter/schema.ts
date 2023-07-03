import * as v from "$lib/validation/schema-utils";

export const orientationStep1Schema: v.Schema = {
  concernedPublic: {
    label:
      "Cochez les éléments correspondants à la situation du ou de la bénéficiaire",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
    required: true,
  },

  hasOtherConcernedPublic: { rules: [] },

  otherConcernedPublic: {
    default: "",
    post: [v.trim],
    rules: [v.isString(), v.maxStrLength(480)],
    maxLength: 480,
    required: (data) => {
      return data?.concernedPublic?.includes("other");
    },
  },
  requirements: {
    label: "Cochez les critères auxquels le ou la bénéficiaire répond",
    default: [],
    required: true,
    rules: [v.isArray([v.isCustomizablePK()])],
  },

  accessConditions: {
    label: "",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },
};

export const orientationStep2Schema: v.Schema = {
  structure: {
    label: "Confirmez votre structure",
    rules: [v.isString(), v.maxStrLength(255)],
    maxLength: 255,
    required: true,
  },
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
    label: "Autre méthode de contact",
    default: "",
    rules: [v.isString()],
    maxLength: 600,
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
    rules: [v.isString(), v.maxStrLength(480)],
    maxLength: 600,
    post: [v.trim],
  },
};
