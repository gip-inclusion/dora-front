import type { ServicesOptions } from "$lib/types";
import { z } from "zod";
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

const fields = {
  contrib: [
    "siret",
    "categories",
    "subcategories",
    "kinds",
    "name",
    "shortDesc",
    "fullDesc",
    "accessConditions",
    "concernedPublic",
    "requirements",
    "isCumulative",
    "feeCondition",
    "feeDetails",
    "contactName",
    "contactPhone",
    "contactEmail",
    "locationKinds",
    "remoteUrl",
    "city",
    "address1",
    "address2",
    "postalCode",
  ],
  service: [
    "structure",
    "categories",
    "subcategories",
    "kinds",
    "name",
    "shortDesc",
    "fullDesc",
    "accessConditions",
    "concernedPublic",
    "requirements",
    "isCumulative",
    "feeCondition",
    "feeDetails",
    "beneficiariesAccessModes",
    "beneficiariesAccessModesOther",
    "coachOrientationModes",
    "coachOrientationModesOther",
    "credentials",
    "forms",
    "onlineForm",
    "contactName",
    "contactPhone",
    "contactEmail",
    "isContactInfoPublic",
    "locationKinds",
    "remoteUrl",
    "city",
    "address1",
    "address2",
    "postalCode",
    "diffusionZoneType",
    "diffusionZoneDetails",
    "qpvOrZrr",
    "startDate",
    "endDate",
    "recurrence",
    "suspensionDate",
    "useInclusionNumeriqueScheme",
  ],
  model: [
    "structure",
    "categories",
    "subcategories",
    "kinds",
    "name",
    "shortDesc",
    "fullDesc",
    "accessConditions",
    "concernedPublic",
    "requirements",
    "isCumulative",
    "feeCondition",
    "feeDetails",
    "beneficiariesAccessModes",
    "beneficiariesAccessModesOther",
    "coachOrientationModes",
    "coachOrientationModesOther",
    "credentials",
    "forms",
    "onlineForm",
    "recurrence",
    "suspensionDate",
  ],
};

const fieldsRequired = {
  contrib: [
    "siret",
    "categories",
    "subcategories",
    "kinds",
    "name",
    "shortDesc",
  ],
  service: [
    "structure",
    "categories",
    "subcategories",
    "kinds",
    "name",
    "shortDesc",
    "coachOrientationModes",
    "diffusionZoneType",
    "locationKinds",
    "contactEmail",
  ],
  draft: ["structure", "name"],
  model: [
    "structure",
    "categories",
    "name",
    "shortDesc",
    "coachOrientationModes",
  ],
};

export const serviceSchema = z.object({
  siret: z
    .string()
    .trim()
    .regex(v.siretRegexp, "Un numéro SIRET est composé de 14 chiffres")
    .catch(),

  structure: z.string().trim().min(1).max(50).catch(),

  categories: z.string().trim().max(255).array().catch([]),
  // dependents: ["subcategories"],

  subcategories: z.string().trim().max(255).array().catch([]),
  //       allCategoriesHaveSubcategories(),

  kinds: z.string().trim().max(255).array().catch(),

  name: z.string().trim().min(1).max(140).catch(""),

  shortDesc: z.string().trim().min(1).max(280).catch(),

  recurrence: z.string().trim().min(1).max(140).catch(),

  fullDesc: z.string().trim().catch(),

  accessConditions: z
    .union([z.string().trim().min(1), z.number().int().gt(0)])
    .array()
    .catch(),

  concernedPublic: z
    .union([z.string().trim().min(1), z.number().int().gt(0)])
    .array()
    .catch(),

  requirements: z
    .union([z.string().trim().min(1), z.number().int().gt(0)])
    .array()
    .catch(),

  isCumulative: z.boolean().catch(),

  feeCondition: z.string().trim().catch(),

  feeDetails: z.string().trim().catch(),
  // (name, value, data) => ({
  //         valid: data.feeCondition === "gratuit" || value.length,
  //         msg: `Information requise`,
  //       }),

  beneficiariesAccessModes: z.string().trim().max(255).array().catch(),
  beneficiariesAccessModesOther: z.string().trim().max(280).catch(),
  // (name, value, data) => ({
  //    valid: data.beneficiariesAccessModes.includes("autre")
  //      ? !!value.length
  //      : true,
  //    msg: `Information requise`,
  //  }),

  coachOrientationModes: z.string().trim().max(255).array().catch(),
  coachOrientationModesOther: z.string().trim().max(280).catch(),

  // (name, value, data) => ({
  //   valid: data.coachOrientationModes.includes("autre")
  //     ? !!value.length
  //     : true,
  //   msg: `Information requise`,
  // }),

  credentials: z
    .union([z.string().trim().min(1), z.number().int().gt(0)])
    .array(),

  forms: z.string().trim().max(1024).array(),

  onlineForm: z.string().trim().url().max(200),
  contactName: z.string().trim().max(140),

  contactPhone: z.preprocess((val) => {
    if (typeof val !== "string") {
      return val;
    }
    return val.replace(/\D/gu, "");
  }, z.string().trim().max(10)),
  contactEmail: z
    .string()
    .trim()
    .max(255)
    .email()
    .transform((v) => v.toLowerCase()),

  isContactInfoPublic: z.boolean(),

  locationKinds: z.string().trim().max(255).array(),
  remoteUrl: z.string().trim().url().max(200),

  city: z.string().trim().max(255),
  // (name, value, data) => ({
  //      valid: data.locationKinds.includes("en-presentiel")
  //        ? !!value.length
  //        : true,
  //      msg: `Information requise`,
  //    }),

  address1: z.string().trim().max(255),
  // (name, value, data) => ({
  //      valid: data.locationKinds.includes("en-presentiel")
  //        ? !!value.length
  //        : true,
  //      msg: `Information requise`,
  //    }),

  //  dependents: ["postalCode"],

  address2: z.string().trim().max(255),
  postalCode: z
    .string()
    .trim()
    .regex(v.postalCodeRegexp, "Veuillez saisir un code postal valide"),
  // (name, value, data) => ({
  //         valid: data.locationKinds.includes("en-presentiel")
  //           ? !!value.length
  //           : true,
  //         msg: `Information requise`,
  //       }),

  // TODO: type with the proper enum
  diffusionZoneType: z.string().trim().max(10),

  diffusionZoneDetails: z.string().trim().max(9),
  //     (name, value, data) => ({
  //         valid:
  //           data.diffusionZoneType && data.diffusionZoneType !== "country"
  //             ? !!value.length
  //             : true,
  //         msg: `Information requise`,
  //       }),

  qpvOrZrr: z.boolean(),

  startDate: z.date(),

  // dependents: ["endDate"],
  // post: [v.nullEmpty],
  endDate: z.date(),
  //
  //   v.isDate(),
  //   (name, value, data) => ({
  //     valid: !data.startDate || new Date(value) >= new Date(data.startDate),
  //     msg: `La date de fin doit être postérieure à la date de début`,
  //   }),
  // ],
  // post: [v.nullEmpty],
  suspensionDate: z.date(),

  useInclusionNumeriqueScheme: z.boolean(),
});

// TODO fix typing
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

// export const serviceSchema: any = v.formatSchema(
//   schema,
//   fields.service,
//   fieldsRequired.service
// );

export const modelSchema: any = v.formatSchema(
  serviceSchema,
  fields.model,
  fieldsRequired.model
);

export const contribSchema = serviceSchema.pick({
  name: true,
  categories: true,
  subcategories: true,
});

// export const contribSchema: any = v.formatSchema(
//   serviceSchema,
//   fields.contrib,
//   fieldsRequired.contrib
// );

export const draftSchema: any = v.formatSchema(
  serviceSchema,
  fields.service,
  fieldsRequired.draft
);
