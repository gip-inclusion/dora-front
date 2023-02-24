export const PARTNERS = [
  // "Action logement",
  "Crésus",
  "Cheops",
  "E2C",
  "BPI France",
  "BGE",
  "La ligue de l’enseignement",

  "Fondation FACE",
  "Positive Planet",
  "SNC",
  "Collectif Emploi",
  "NQT",
  "Simplon.Co",
  "La cravate solidaire",
  "Konexio",
  "Force Femmes",
  "Apprentis d’Auteuil",
  "AFPA",
  "La MedNum",
  "Renault",
  "UNIOPSS",
  "Orange",
  "ANLCI",
  "Les bons clics",
  "Social Builder",
  "Mobin",
  "EPIDE",
  "Wimoov",
  "Les emplois de l'inclusion",
  "JeVeuxAider",
  "Google - Ateliers numériques",
  "Service Civique",
  "CNAF - Mon enfant.fr",
  "Service Civique",
  "Finances et pédagogie (Caisse d’épargne)",
];

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
