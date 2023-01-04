import { browser } from "$app/environment";
import { writable } from "svelte/store";
import type { ZodType } from "zod";

import { z } from "zod";

// https://zod.dev/ERROR_HANDLING?id=customizing-errors-with-zoderrormap
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "null") {
    return {
      message: "Information requise.",
    };
  }
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === "email") {
      return {
        message:
          "Veuillez saisir une adresse courriel valide (ex: nom.prenom@organisation.fr).",
      };
    }
    if (issue.validation === "url") {
      return {
        message: "Veuillez saisir une URL valide (ex: https://exemple.fr).",
      };
    }
  }
  if (issue.code === z.ZodIssueCode.too_small && issue.minimum === 1) {
    return {
      message: "Information requise.",
    };
  }
  if (issue.code === z.ZodIssueCode.too_big) {
    return {
      message: `Ce champ ne doit pas depasser ${issue.maximum} caractères.`,
    };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export type ValidationContext = {
  onBlur: (evt: any) => Promise<void>;
  onChange: (evt: any) => Promise<void>;
  onInput: (evt: any) => Promise<void>;
};
export const contextValidationKey = {};
// TODO: type it properly
export const formErrors: any = writable({});

function addError(fieldName, msg) {
  formErrors.update((previousErrors) => {
    previousErrors[fieldName] = previousErrors[fieldName]?.length
      ? [...previousErrors[fieldName], msg]
      : [msg];
    return previousErrors;
  });
}

function clearError(fieldName) {
  formErrors.update((previousErrors) => {
    delete previousErrors[fieldName];
    return previousErrors;
  });
}

function scrollToField(fieldName) {
  if (browser) {
    const elt = document.getElementsByName(fieldName);
    elt?.[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function validate<T>(
  data: T,
  schema: ZodType,
  {
    noScroll = false,
    showErrors = true,
    fieldName = undefined,
  }: {
    noScroll?: boolean;
    showErrors?: boolean;
    fieldName?: string;
  } = {}
) {
  let validatedData = {};
  const errorFields: string[] = [];

  // Effacement des erreurs
  if (showErrors) {
    if (fieldName) {
      clearError(fieldName);
    } else {
      for (const fieldName in schema) {
        clearError(fieldName);
      }
    }
  }

  const parseResult = schema.safeParse(data);

  if (parseResult.success) {
    validatedData = { ...parseResult.data };
  } else if (showErrors) {
    if (fieldName) {
      // On n'affiche les erreurs que sur le champ courant
      if (!parseResult.success) {
        const errors = parseResult.error.flatten().fieldErrors;
        if (fieldName in errors) {
          addError(fieldName, errors[fieldName][0]);
          errorFields.push(fieldName);
        }
      }
    } else {
      // Validation de l'ensemble du formulaire, on affiche
      // toutes les erreurs
      let firstError = true;
      if (!parseResult.success) {
        const errors = parseResult.error.flatten().fieldErrors;
        for (const fieldName in errors) {
          addError(fieldName, errors[fieldName][0]);
          errorFields.push(fieldName);
          if (firstError) {
            if (!noScroll) scrollToField(fieldName);
            firstError = false;
          }
        }
      }
    }
  }

  // Ensure we pass the fields that are not in the validation schema untouched
  // Those are mostly the hidden fields

  // TODO: do we want fields not in the validation schema?
  // use strict in zod ?
  validatedData = { ...data, ...validatedData };

  return { validatedData, valid: parseResult.success, errorFields };
}

function parseServerError(error) {
  // https://www.django-rest-framework.org/api-guide/exceptions/#exception-handling-in-rest-framework-views
  // We need to differenciate ValidationErrors from the rest of them
  if (error.detail) {
    // Other error
    return { nonFieldErrors: [{ ...error.detail }] };
  }
  // Validation error
  return error;
}

export function injectAPIErrors(err, serverErrorsTranslation) {
  let doneOnce = false;
  const parsedErrors = parseServerError(err);

  Object.entries(parsedErrors).forEach(
    ([key, errors]: [string, { code: string; message: string }[]]) => {
      const fieldName = key;
      errors.forEach((value) => {
        const errorCode = value.code;
        const errorMsg =
          (serverErrorsTranslation[fieldName] &&
            serverErrorsTranslation[fieldName][errorCode]) ||
          (serverErrorsTranslation._default &&
            serverErrorsTranslation._default[errorCode]) ||
          value.message;

        addError(fieldName, errorMsg);

        if (!doneOnce) {
          scrollToField(fieldName);
          doneOnce = true;
        }
      });
    }
  );
}
