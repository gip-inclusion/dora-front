import * as v from "./utils";

export default {
  siret: {
    default: "",
    rules: [v.isSiret()],
  },
  name: {
    default: "",
    required: true,
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
  },
  typology: {
    default: "",
    required: true,
    rules: [v.isString(), v.maxStrLength(255)],
  },
  address1: {
    default: "",
    required: true,
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
  },
  address2: {
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
  },
  accesslibreUrl: {
    default: "",
    rules: [v.isString(), v.isURL(), v.maxStrLength(255), v.isAccessLibreUrl()],
    post: [v.trim],
  },
  postalCode: {
    default: "",
    required: true,
    rules: [v.isPostalCode()],
  },
  city: {
    default: "",
    required: true,
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
  },
  phone: {
    default: "",
    pre: [v.removeAllNonDigits],
    rules: [v.isPhone()],
  },
  email: {
    default: "",
    required: true,
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
  },
  url: {
    default: "",
    rules: [v.isURL(), v.maxStrLength(200)],
    post: [v.trim],
  },
  shortDesc: {
    default: "",
    required: true,
    rules: [v.isString(), v.maxStrLength(280)],
    post: [v.trim],
  },
  fullDesc: {
    default: "",
    rules: [v.isString()],
    post: [v.trim],
  },
  nationalLabels: {
    default: [],
    rules: [v.isArray([v.isString(), v.maxStrLength(255)])],
    post: [],
  },
  otherLabels: {
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
  },
  openingHours: {
    default: "",
    rules: [v.isString(), v.isNotStringInvalid(), v.maxStrLength(255)],
    post: [v.trim],
  },
  openingHoursDetails: {
    default: "",
    rules: [v.isString(), v.maxStrLength(255)],
    post: [v.trim],
  },
  cityCode: {
    default: "",
    rules: [],
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
