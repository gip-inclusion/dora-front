import type { ServicesOptions } from "$lib/types";
import * as v from "./utils";

export function allCategoriesHaveSubcategories() {
  return (name, value, data, servicesOptions: ServicesOptions, _schema) => {
    const subcatRoots = new Set(
      data.subcategories.map((value) => value.split("--")[0])
    );

    // TODO: fix that, but the required field is not in the schema anymore
    // Pas besoin de vérifier les sous-catégories si le champs est optionnel
    // const required = schema[name]?.required ?? false;
    // if (!required) {
    //   return {
    //     valid: true,
    //   };
    // }

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

export const serviceSchema = {
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

export const draftSchema = {
  structure: serviceSchema.structure,
  categories: serviceSchema.categories,
  subcategories: serviceSchema.subcategories,
  kinds: serviceSchema.kinds,
  name: serviceSchema.name,
  shortDesc: serviceSchema.shortDesc,
  fullDesc: serviceSchema.fullDesc,
  accessConditions: serviceSchema.accessConditions,
  concernedPublic: serviceSchema.concernedPublic,
  requirements: serviceSchema.requirements,
  isCumulative: serviceSchema.isCumulative,
  feeCondition: serviceSchema.feeCondition,
  feeDetails: serviceSchema.feeDetails,
  beneficiariesAccessModes: serviceSchema.beneficiariesAccessModes,
  beneficiariesAccessModesOther: serviceSchema.beneficiariesAccessModesOther,
  coachOrientationModes: serviceSchema.coachOrientationModes,
  coachOrientationModesOther: serviceSchema.coachOrientationModesOther,
  credentials: serviceSchema.credentials,
  forms: serviceSchema.forms,
  onlineForm: serviceSchema.onlineForm,
  contactName: serviceSchema.contactName,
  contactPhone: serviceSchema.contactPhone,
  contactEmail: serviceSchema.contactEmail,
  isContactInfoPublic: serviceSchema.isContactInfoPublic,
  locationKinds: serviceSchema.locationKinds,
  remoteUrl: serviceSchema.remoteUrl,
  city: serviceSchema.city,
  address1: serviceSchema.address1,
  address2: serviceSchema.address2,
  postalCode: serviceSchema.postalCode,
  diffusionZoneType: serviceSchema.diffusionZoneType,
  diffusionZoneDetails: serviceSchema.diffusionZoneDetails,
  qpvOrZrr: serviceSchema.qpvOrZrr,
  startDate: serviceSchema.startDate,
  endDate: serviceSchema.endDate,
  recurrence: serviceSchema.recurrence,
  suspensionDate: serviceSchema.suspensionDate,
  useInclusionNumeriqueScheme: serviceSchema.useInclusionNumeriqueScheme,
};

export const contribSchema = {
  siret: serviceSchema.siret,
  categories: serviceSchema.categories,
  subcategories: serviceSchema.subcategories,
  kinds: serviceSchema.kinds,
  name: serviceSchema.name,
  shortDesc: serviceSchema.shortDesc,
  fullDesc: serviceSchema.fullDesc,
  accessConditions: serviceSchema.accessConditions,
  concernedPublic: serviceSchema.concernedPublic,
  requirements: serviceSchema.requirements,
  isCumulative: serviceSchema.isCumulative,
  feeCondition: serviceSchema.feeCondition,
  feeDetails: serviceSchema.feeDetails,
  contactName: serviceSchema.contactName,
  contactPhone: serviceSchema.contactPhone,
  contactEmail: serviceSchema.contactEmail,
  locationKinds: serviceSchema.locationKinds,
  remoteUrl: serviceSchema.remoteUrl,
  city: serviceSchema.city,
  address1: serviceSchema.address1,
  address2: serviceSchema.address2,
  postalCode: serviceSchema.postalCode,
};

export const modelSchema = {
  structure: serviceSchema.structure,
  categories: serviceSchema.categories,
  subcategories: serviceSchema.subcategories,
  kinds: serviceSchema.kinds,
  name: serviceSchema.name,
  shortDesc: serviceSchema.shortDesc,
  fullDesc: serviceSchema.fullDesc,
  accessConditions: serviceSchema.accessConditions,
  concernedPublic: serviceSchema.concernedPublic,
  requirements: serviceSchema.requirements,
  isCumulative: serviceSchema.isCumulative,
  feeCondition: serviceSchema.feeCondition,
  feeDetails: serviceSchema.feeDetails,
  beneficiariesAccessModes: serviceSchema.beneficiariesAccessModes,
  beneficiariesAccessModesOther: serviceSchema.beneficiariesAccessModesOther,
  coachOrientationModes: serviceSchema.coachOrientationModes,
  coachOrientationModesOther: serviceSchema.coachOrientationModesOther,
  credentials: serviceSchema.credentials,
  forms: serviceSchema.forms,
  onlineForm: serviceSchema.onlineForm,
  recurrence: serviceSchema.recurrence,
  suspensionDate: serviceSchema.suspensionDate,
};

// TODO move that somewhere else
export const suggestionSchema: any = {
  fullName: {
    default: "",
    rules: [v.isString(), v.maxStrLength(140)],
    post: [v.trim],
  },
  email: {
    default: "",
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
  },
  message: {
    default: "",
    rules: [v.isString()],
  },
};
