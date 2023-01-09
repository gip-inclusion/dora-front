import * as v from "./utils";

export const addUserSchema = {
  email: {
    default: "",
    rules: [v.isEmail(), v.maxStrLength(255)],
    post: [v.lower, v.trim],
  },
  level: {
    default: "",
    rules: [
      v.isString(),
      (name, value, _data) => ({
        valid: value === "user" || value === "admin",
        msg: `Choix incorrect`,
      }),
    ],
  },
};

export const modifyUserSchema = {
  level: {
    default: "",
    rules: [
      v.isString(),
      (name, value, _data) => ({
        valid: value === "user" || value === "admin",
        msg: `Choix incorrect`,
      }),
    ],
  },
};
