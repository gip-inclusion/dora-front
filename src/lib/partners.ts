export const PARTNERS = [
  "cresus",
  "cheops",
  "ec2",
  "bpi",
  "bge",
  "ligueEnseignement",
  "fondationFace",
  "positivePlanet",
  "snc",
  "collectifEmploi",
  "nqt",
  "simplon",
  "cravateSolidaire",
  "konexio",
  "forceFemmes",
  "apprentisAuteuils",
  "afpa",
  "medNum",
  "renault",
  "uniopss",
  "orange",
  "anlci",
  "bonsClics",
  "socialBuilder",
  "mobin",
  "epide",
  "wimoov",
  "emploisInclusion",
  "jeVeuxAider",
  "google",
  "serviceCivique",
  "cnaf",
  "financesPedagogie",
];

function randomIntFromInterval(min: number, max: number) {
  // prettier-ignore
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

export function pickRandomPartners(size: number): string[] {
  const indexes = new Set<number>();
  while (indexes.size < size) {
    indexes.add(randomIntFromInterval(0, PARTNERS.length - 1));
  }

  const selectedPartners: string[] = [];
  indexes.forEach((index) => selectedPartners.push(PARTNERS[index]));
  return selectedPartners;
}
