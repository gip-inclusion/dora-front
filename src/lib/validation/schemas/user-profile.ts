import { z } from "zod";

export default z.object({
  firstName: z.string().trim().min(1).max(140),
  lastName: z.string().trim().min(1).max(140),
  email: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .email()
    .transform((v) => v.toLowerCase()),
  // Veuillez saisir un numéro de téléphone valide (ex: 06 00 00 00 00 ou  0600000000

  phoneNumber: z
    .preprocess((val) => {
      if (typeof val !== "string") {
        return val;
      }
      return val.replace(/\D/gu, "");
    }, z.string().trim().max(10))
    .optional(),
});
