import { z } from "zod";
import * as v from "./utils";

export default z.object({
  siret: z
    .string()
    .trim()
    .regex(v.siretRegexp, "Un numéro SIRET est composé de 14 chiffres"),

  name: z.string().trim().min(1).max(255),

  typology: z.string().trim().min(1).max(255),

  city: z.string().trim().min(1).max(255),

  address1: z.string().trim().min(1).max(255),

  address2: z.string().trim().max(255).optional(),

  postalCode: z
    .string()
    .trim()
    .regex(v.postalCodeRegexp, "Veuillez saisir un code postal valide"),

  accesslibreUrl: z
    .string()
    .trim()
    .max(255)
    .url()
    .startsWith("https://acceslibre.beta.gouv.fr/", {
      message: "L’URL doit commencer par https://acceslibre.beta.gouv.fr/",
    })
    .nullable(),

  phone: z
    .preprocess((val) => {
      if (typeof val !== "string") {
        return val;
      }
      return val.replace(/\D/gu, "");
    }, z.string().trim().max(10))
    .optional(),
  // Veuillez saisir un numéro de téléphone valide (ex: 06 00 00 00 00 ou  0600000000

  email: z
    .string()
    .trim()
    .max(255)
    .email()
    .transform((v) => v.toLowerCase()),

  url: z
    .union([z.string().trim().max(200).url(), z.string().max(0)])
    .nullable(),

  shortDesc: z.string().trim().min(1).max(280),

  fullDesc: z.string().trim().nullable(),

  nationalLabels: z.string().trim().max(255).array().nullable(),

  otherLabels: z.string().trim().max(255).nullable(),

  // "Horaires incomplets. Veuillez finaliser la saisie de vos horaires, corriger les champs manquants ou incorrects."
  openingHours: z
    .string()
    .trim()
    .max(255)
    .refine((val) => val !== null)
    .nullable(),

  openingHoursDetails: z.string().trim().max(255).nullable(),

  // Hidden
  cityCode: z
    .string()
    .trim()
    .regex(/\d[0-9aAbB]\d{3}/, "Code INSEE incorrect")
    .nullable(),

  longitude: z.number().finite().gte(-180).lte(180).nullable(),

  latitude: z.number().finite().gte(-180).lte(180).nullable(),

  ape: z
    .string()
    .trim()
    .regex(/\d\d\.\d\d[A-Z]/, "Code APE incorrect")
    .nullable(),
});
