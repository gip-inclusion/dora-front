import * as v from "$lib/validation/schema-utils";

export const orientationStep1Schema: v.Schema = {
  concernedPublic: {
    label:
      "Cochez les critères correspondants à la situation de la personne orientée",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
    required: true,
  },

  requirements: {
    label: "Merci de cocher les critères auxquelles le bénéficiaire répond",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },

  accessConditions: {
    label: "Merci de cocher les critères auxquelles le bénéficiaire répond",
    default: [],
    rules: [v.isArray([v.isCustomizablePK()])],
  },
};

export const orientationStep2Schema: v.Schema = {};
