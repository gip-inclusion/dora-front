import { shuffleArray } from "./array";

const PARTNERS = [
  "afpa",
  "anlci",
  "apprentisAuteuils",
  "bge",
  "bonsClics",
  "bpi",
  "cheops",
  "collectifEmploi",
  "cravateSolidaire",
  "cresus",
  "e2c",
  "fondationFace",
  "emploisInclusion",
  "orange",
  "socialBuilder",
  "financesPedagogie",
  "ligueEnseignement",
  "positivePlanet",
  "uniopss",
  "forceFemmes",
  "medNum",
  "renault",
  "wimoov",
  "epide",
  "google",
  "mobin",
  "serviceCivique",
  "jeVeuxAider",
  "monEnfant",
  "simplon",
  "konexio",
  "nqt",
  "snc",
];

export function getPartners(limit?: number) {
  if (!limit) {
    limit = PARTNERS.length;
  }
  return shuffleArray(PARTNERS).slice(0, limit);
}
