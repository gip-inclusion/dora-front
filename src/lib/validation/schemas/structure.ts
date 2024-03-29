import * as v from "../schema-utils";

export const structureSchema: v.Schema = {
  siret: {
    label: "SIRET",
    default: "",
    rules: [v.isSiret()],
    readonly: true,
    maxLength: 14,
  },
  name: {
    label: "Nom de la structure",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    required: true,
    maxLength: 255,
  },
  typology: {
    label: "Typologie",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    required: true,
    maxLength: 255,
  },
  address1: {
    label: "Adresse",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    required: true,
    maxLength: 255,
  },
  address2: {
    label: "Complément d’adresse",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    maxLength: 255,
  },
  accesslibreUrl: {
    label: "Accessibilité",
    default: "",
    rules: [v.isString(), v.isURL(), v.maxStrLength(255), v.isAccessLibreUrl()],
    post: [v.trim],
    maxLength: 255,
  },
  postalCode: {
    label: "Code postal",
    default: "",
    rules: [v.isPostalCode()],
    required: true,
    maxLength: 5,
  },
  city: {
    label: "Ville",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    required: true,
    maxLength: 255,
  },
  phone: {
    label: "Téléphone",
    default: "",
    pre: [v.removeAllNonDigits],
    rules: [v.isPhone()],
    maxLength: 10,
  },
  email: {
    label: "Courriel",
    default: "",
    rules: [v.isEmail(), v.maxStrLength(254)],
    post: [v.lower, v.trim],
    maxLength: 254,
  },
  url: {
    label: "Site web",
    default: "",
    rules: [v.isURL(), v.maxStrLength(200)],
    post: [v.trim],
    maxLength: 200,
  },
  shortDesc: {
    label: "Résumé",
    default: "",
    rules: [v.isString(), v.maxStrLength(280)],
    post: [v.trim],
    maxLength: 280,
  },
  fullDesc: {
    label: "Présentation",
    default: "",
    rules: [v.isString()],
    post: [v.trim],
  },
  nationalLabels: {
    label: "Labels nationaux",
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
    maxLength: 255,
  },
  otherLabels: {
    label: "Autres labels",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    maxLength: 255,
  },
  openingHours: {
    label: "Horaires de la structure",
    default: "",
    rules: [v.isString(), v.osmHoursNotContainsInvalid(), v.maxStrLength(255)],
    post: [v.trim],
    maxLength: 255,
  },
  openingHoursDetails: {
    label: "Détail horaires",
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
    maxLength: 255,
  },
  cityCode: {
    default: "",
    rules: [],
    maxLength: 5,
  },
  longitude: {
    default: null,
    rules: [],
  },
  latitude: {
    default: null,
    rules: [],
  },
  ape: {
    default: "",
    rules: [],
  },
};
