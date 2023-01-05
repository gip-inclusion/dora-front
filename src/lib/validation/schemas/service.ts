import type { ServicesOptions } from "$lib/types";
import * as v from "./utils";

export function allCategoriesHaveSubcategories() {
  return (name, value, data, servicesOptions: ServicesOptions, schema) => {
    const subcatRoots = new Set(
      data.subcategories.map((value) => value.split("--")[0])
    );

    // Pas besoin de vérifier les sous-catégories si le champs est optionnel
    const required = schema[name]?.required ?? false;
    if (!required) {
      return {
        valid: true,
      };
    }

    if (!servicesOptions) {
      console.log("Missing servicesOptions in rules check");
      return {
        valid: true,
      };
    }
    const catWithoutSubCat = data.categories
      .filter((value) => !subcatRoots.has(value))
      .map(
        (value) =>
          servicesOptions.categories.find((cat) => cat.value === value).label
      );
    return {
      valid: catWithoutSubCat.length === 0,
      msg: `Ces thématiques n’ont pas de besoin associé: ${catWithoutSubCat.join(
        ", "
      )} `,
    };
  };
}

export const baseSchema = {
  siret: {
    default: "",
    rules: [v.isSiret()],
  },
  structure: {
    default: "",
    rules: [v.isString(), v.maxStrLength(50)],
  },
  categories: {
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
    dependents: ["subcategories"],
  },
  subcategories: {
    default: [],
    rules: [
      v.isArray([v.isString(), v.maxStrLength(255)]),
      allCategoriesHaveSubcategories(),
    ],
  },
  kinds: {
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
  },
  name: {
    default: "",
    rules: [v.isString(), v.maxStrLength(140)],
    post: [v.trim],
  },
  shortDesc: {
    default: "",
    rules: [v.isString(), v.maxStrLength(280)],
    post: [v.trim],
  },
  recurrence: {
    default: "",
    rules: [v.isString(), v.maxStrLength(140)],
    post: [v.trim],
  },
  fullDesc: {
    default: "",
    rules: [v.isString()],
    post: [v.trim],
  },
  accessConditions: {
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },
  concernedPublic: {
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },
  requirements: {
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },
  isCumulative: {
    default: true,
    rules: [v.isBool()],
  },
  feeCondition: {
    default: "gratuit",
    rules: [v.isString()],
  },
  feeDetails: {
    default: "",
    post: [v.trim],
    rules: [
      v.isString(),
      (name, value, data) => ({
        valid: data.feeCondition === "gratuit" || value.length,
        msg: `Information requise`,
      }),
    ],
  },
  beneficiariesAccessModes: {
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
  },
  beneficiariesAccessModesOther: {
    default: "",
    rules: [
      v.isString(),
      v.maxStrLength(280),
      (name, value, data) => ({
        valid: data.beneficiariesAccessModes.includes("autre")
          ? !!value.length
          : true,
        msg: `Information requise`,
      }),
    ],
  },
  coachOrientationModes: {
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
  },
  coachOrientationModesOther: {
    default: "",
    rules: [
      v.isString(),
      v.maxStrLength(280),
      (name, value, data) => ({
        valid: data.coachOrientationModes.includes("autre")
          ? !!value.length
          : true,
        msg: `Information requise`,
      }),
    ],
  },

  credentials: {
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },
  forms: {
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(1024)])],
  },
  onlineForm: {
    default: "",
    rules: [v.isURL(), v.maxStrLength(200)],
    post: [v.trim],
  },
  contactName: {
    default: "",
    rules: [v.isString(), v.maxStrLength(140)],
    post: [v.trim],
  },
  contactPhone: {
    default: "",
    pre: [v.removeAllNonDigits],
    rules: [v.isPhone()],
  },
  contactEmail: {
    default: "",
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
  },
  isContactInfoPublic: {
    default: false,
    rules: [v.isBool()],
  },

  locationKinds: {
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
  },
  remoteUrl: {
    default: "",
    rules: [v.isURL(), v.maxStrLength(200)],
    post: [v.trim],
  },
  city: {
    default: "",
    rules: [
      v.isString(),
      v.maxStrLength(255),
      (name, value, data) => ({
        valid: data.locationKinds.includes("en-presentiel")
          ? !!value.length
          : true,
        msg: `Information requise`,
      }),
    ],
    post: [v.trim],
  },
  address1: {
    default: "",
    rules: [
      v.isString(),
      v.maxStrLength(255),
      (name, value, data) => ({
        valid: data.locationKinds.includes("en-presentiel")
          ? !!value.length
          : true,
        msg: `Information requise`,
      }),
    ],
    post: [v.trim],
    dependents: ["postalCode"],
  },
  address2: {
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
  },
  postalCode: {
    default: "",
    rules: [
      v.isPostalCode(),
      (name, value, data) => ({
        valid: data.locationKinds.includes("en-presentiel")
          ? !!value.length
          : true,
        msg: `Information requise`,
      }),
    ],
  },
  diffusionZoneType: {
    default: "",
    rules: [v.isString(), v.maxStrLength(10)],
  },

  diffusionZoneDetails: {
    default: "",
    rules: [
      v.isString(),
      v.maxStrLength(9),
      (name, value, data) => ({
        valid:
          data.diffusionZoneType && data.diffusionZoneType !== "country"
            ? !!value.length
            : true,
        msg: `Information requise`,
      }),
    ],
  },
  qpvOrZrr: {
    default: false,
    rules: [v.isBool()],
  },
  startDate: {
    default: null,
    rules: [v.isDate()],
    dependents: ["endDate"],
    post: [v.nullEmpty],
  },
  endDate: {
    default: null,
    rules: [
      v.isDate(),
      (name, value, data) => ({
        valid: !data.startDate || new Date(value) >= new Date(data.startDate),
        msg: `La date de fin doit être postérieure à la date de début`,
      }),
    ],
    post: [v.nullEmpty],
  },
  suspensionDate: {
    default: null,
    rules: [v.isDate()],
    post: [v.nullEmpty],
  },
  useInclusionNumeriqueScheme: {
    default: false,
    rules: [v.isBool()],
  },
};

export const serviceSchema = {
  structure: { ...baseSchema.structure, required: true },
  categories: { ...baseSchema.categories, required: true },
  subcategories: { ...baseSchema.subcategories, required: true },
  kinds: { ...baseSchema.kinds, required: true },
  name: { ...baseSchema.name, required: true },
  shortDesc: { ...baseSchema.shortDesc, required: true },
  fullDesc: { ...baseSchema.fullDesc },
  accessConditions: { ...baseSchema.accessConditions },
  concernedPublic: { ...baseSchema.concernedPublic },
  requirements: { ...baseSchema.requirements },
  isCumulative: { ...baseSchema.isCumulative },
  feeCondition: { ...baseSchema.feeCondition },
  feeDetails: { ...baseSchema.feeDetails },
  beneficiariesAccessModes: { ...baseSchema.beneficiariesAccessModes },
  beneficiariesAccessModesOther: {
    ...baseSchema.beneficiariesAccessModesOther,
  },
  coachOrientationModes: {
    ...baseSchema.coachOrientationModes,
    required: true,
  },
  coachOrientationModesOther: { ...baseSchema.coachOrientationModesOther },
  credentials: { ...baseSchema.credentials },
  forms: { ...baseSchema.forms },
  onlineForm: { ...baseSchema.onlineForm },
  contactName: { ...baseSchema.contactName },
  contactPhone: { ...baseSchema.contactPhone },
  contactEmail: { ...baseSchema.contactEmail, required: true },
  isContactInfoPublic: { ...baseSchema.isContactInfoPublic },
  locationKinds: { ...baseSchema.locationKinds, required: true },
  remoteUrl: { ...baseSchema.remoteUrl },
  city: { ...baseSchema.city },
  address1: { ...baseSchema.address1 },
  address2: { ...baseSchema.address2 },
  postalCode: { ...baseSchema.postalCode },
  diffusionZoneType: { ...baseSchema.diffusionZoneType, required: true },
  diffusionZoneDetails: { ...baseSchema.diffusionZoneDetails },
  qpvOrZrr: { ...baseSchema.qpvOrZrr },
  startDate: { ...baseSchema.startDate },
  endDate: { ...baseSchema.endDate },
  recurrence: { ...baseSchema.recurrence },
  suspensionDate: { ...baseSchema.suspensionDate },
  useInclusionNumeriqueScheme: { ...baseSchema.useInclusionNumeriqueScheme },
};

export const draftSchema = {
  structure: { ...baseSchema.structure, required: true },
  categories: { ...baseSchema.categories },
  subcategories: { ...baseSchema.subcategories },
  kinds: { ...baseSchema.kinds },
  name: { ...baseSchema.name, required: true },
  shortDesc: { ...baseSchema.shortDesc },
  fullDesc: { ...baseSchema.fullDesc },
  accessConditions: { ...baseSchema.accessConditions },
  concernedPublic: { ...baseSchema.concernedPublic },
  requirements: { ...baseSchema.requirements },
  isCumulative: { ...baseSchema.isCumulative },
  feeCondition: { ...baseSchema.feeCondition },
  feeDetails: { ...baseSchema.feeDetails },
  beneficiariesAccessModes: { ...baseSchema.beneficiariesAccessModes },
  beneficiariesAccessModesOther: {
    ...baseSchema.beneficiariesAccessModesOther,
  },
  coachOrientationModes: { ...baseSchema.coachOrientationModes },
  coachOrientationModesOther: { ...baseSchema.coachOrientationModesOther },
  credentials: { ...baseSchema.credentials },
  forms: { ...baseSchema.forms },
  onlineForm: { ...baseSchema.onlineForm },
  contactName: { ...baseSchema.contactName },
  contactPhone: { ...baseSchema.contactPhone },
  contactEmail: { ...baseSchema.contactEmail },
  isContactInfoPublic: { ...baseSchema.isContactInfoPublic },
  locationKinds: { ...baseSchema.locationKinds },
  remoteUrl: { ...baseSchema.remoteUrl },
  city: { ...baseSchema.city },
  address1: { ...baseSchema.address1 },
  address2: { ...baseSchema.address2 },
  postalCode: { ...baseSchema.postalCode },
  diffusionZoneType: { ...baseSchema.diffusionZoneType },
  diffusionZoneDetails: { ...baseSchema.diffusionZoneDetails },
  qpvOrZrr: { ...baseSchema.qpvOrZrr },
  startDate: { ...baseSchema.startDate },
  endDate: { ...baseSchema.endDate },
  recurrence: { ...baseSchema.recurrence },
  suspensionDate: { ...baseSchema.suspensionDate },
  useInclusionNumeriqueScheme: { ...baseSchema.useInclusionNumeriqueScheme },
};

export const contribSchema = {
  siret: { ...baseSchema.siret, required: true },
  categories: { ...baseSchema.categories, required: true },
  subcategories: { ...baseSchema.subcategories, required: true },
  kinds: { ...baseSchema.kinds, required: true },
  name: { ...baseSchema.name, required: true },
  shortDesc: { ...baseSchema.shortDesc, required: true },
  fullDesc: { ...baseSchema.fullDesc },
  accessConditions: { ...baseSchema.accessConditions },
  concernedPublic: { ...baseSchema.concernedPublic },
  requirements: { ...baseSchema.requirements },
  isCumulative: { ...baseSchema.isCumulative },
  feeCondition: { ...baseSchema.feeCondition },
  feeDetails: { ...baseSchema.feeDetails },
  contactName: { ...baseSchema.contactName },
  contactPhone: { ...baseSchema.contactPhone },
  contactEmail: { ...baseSchema.contactEmail },
  locationKinds: { ...baseSchema.locationKinds },
  remoteUrl: { ...baseSchema.remoteUrl },
  city: { ...baseSchema.city },
  address1: { ...baseSchema.address1 },
  address2: { ...baseSchema.address2 },
  postalCode: { ...baseSchema.postalCode },
};

export const modelSchema = {
  structure: { ...baseSchema.structure, required: true },
  categories: { ...baseSchema.categories, required: true },
  subcategories: { ...baseSchema.subcategories, required: true },
  kinds: { ...baseSchema.kinds },
  name: { ...baseSchema.name, required: true },
  shortDesc: { ...baseSchema.shortDesc, required: true },
  fullDesc: { ...baseSchema.fullDesc },
  accessConditions: { ...baseSchema.accessConditions },
  concernedPublic: { ...baseSchema.concernedPublic },
  requirements: { ...baseSchema.requirements },
  isCumulative: { ...baseSchema.isCumulative },
  feeCondition: { ...baseSchema.feeCondition },
  feeDetails: { ...baseSchema.feeDetails },
  beneficiariesAccessModes: { ...baseSchema.beneficiariesAccessModes },
  beneficiariesAccessModesOther: {
    ...baseSchema.beneficiariesAccessModesOther,
  },
  coachOrientationModes: {
    ...baseSchema.coachOrientationModes,
    required: true,
  },
  coachOrientationModesOther: { ...baseSchema.coachOrientationModesOther },
  credentials: { ...baseSchema.credentials },
  forms: { ...baseSchema.forms },
  onlineForm: { ...baseSchema.onlineForm },
  recurrence: { ...baseSchema.recurrence },
  suspensionDate: { ...baseSchema.suspensionDate },
};

// TODO move that somewhere else
export const suggestionSchema: any = {
  fullName: {
    default: "",
    required: true,
    rules: [v.isString(), v.maxStrLength(140)],
    post: [v.trim],
  },
  email: {
    default: "",
    required: true,
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
  },
  message: {
    default: "",
    required: true,
    rules: [v.isString()],
  },
};
