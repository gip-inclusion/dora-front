import * as v from "./utils";

export const userProfileSchema: v.Schema = {
  firstName: {
    label: "Prénom",
    default: "",
    rules: [v.isString(), v.maxStrLength(140)],
    post: [v.trim],
    maxLength: 140,
  },
  lastName: {
    label: "Nom",
    default: "",
    rules: [v.isString(), v.maxStrLength(140)],
    post: [v.trim],
    maxLength: 140,
  },
  email: {
    label: "Courriel",
    default: "",
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
    maxLength: 255,
  },
  phoneNumber: {
    label: "Numéro de téléphone",
    default: "",
    pre: [v.removeAllNonDigits],
    rules: [v.isPhone()],
    required: true,
    maxLength: 10,
  },
  newsletter: {
    default: false,
    rules: [v.isBool()],
  },
};
