module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:svelte/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.cjs"],
  overrides: [{
    files: ["*.svelte"],
    parser: "svelte-eslint-parser",
    parserOptions: {
      parser: "@typescript-eslint/parser"
    }
  }],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"]
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  rules: {
    "array-callback-return": "error",
    "block-scoped-var": "error",
    camelcase: "error",
    "consistent-return": "error",
    "consistent-this": "error",
    curly: "error",
    "default-case": "error",
    "default-case-last": "error",
    "default-param-last": ["error"],
    "dot-notation": "error",
    eqeqeq: ["error", "smart"],
    "id-length": [
      "error",
      { min: 3, exceptions: ["i", "a", "b", "x", "y", "id", "ok", "to"] }
    ],
    "func-style": [
      "error",
      "declaration",
      {
        allowArrowFunctions: true
      }
    ],
    "guard-for-in": "error",
    "no-alert": "warn",
    "no-await-in-loop": "error",
    "no-console": "warn",
    "no-constant-binary-expression": "error",
    "no-empty-function": "warn",
    "no-eval": "error",
    "no-extra-boolean-cast": ["error", { enforceForLogicalOperands: true }],
    "no-implicit-coercion": [2, { allow: ["!!"] }],
    "no-implied-eval": "error",
    "no-irregular-whitespace": "off",
    "no-mixed-operators": "error",
    "no-nested-ternary": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-shadow": "error",
    "no-unneeded-ternary": "error",
    "no-use-before-define": "error",
    "no-var": "error",
    "no-warning-comments": [
      "warn",
      {
        location: "start",
        terms: ["todo", "hack", "xxx", "fixme"]
      }
    ],
    "prefer-const": "error",
    "require-await": "error",
    "svelte/no-at-html-tags": "warn",
    "svelte/valid-compile": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "off"
  }
};
