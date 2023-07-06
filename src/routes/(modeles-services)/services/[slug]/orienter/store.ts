import { writable } from "svelte/store";
import type { Orientation } from "./types";

export const orientation = writable<Orientation>({
  // TODO: valeurs par defaut temporaires pour faciliter les tests du formulaire

  situation: ["Public femme en difficulté"],
  situationOther: "autre...",
  requirements: ["prerequis-1"],
  prescriberStructure: "nenettes-co-le-resea",

  referentLastName: "RefName",
  referentFirstName: "RefFirstname",
  referentPhone: "1111111111",
  referentEmail: "ref@example.com",

  beneficiaryLastName: "BenName",
  beneficiaryFirstName: "BenFirstname",
  beneficiaryAvailability: "2023-07-04",
  beneficiaryContactPreferences: ["telephone", "autre"],
  beneficiaryPhone: "2222222222",
  beneficiaryEmail: "ben@example.com",
  beneficiaryOtherContactMethod: "autre mode de contact",
  orientationReasons: "Motif de l‘orientation",

  attachments: {},

  // situation: [],
  // situationOther: "",
  // situationOther: [],
  // requirements: [],
  // prescriberStructure: undefined,
  //
  // referentLastName: undefined,
  // referentFirstName: undefined,
  // referentPhone: undefined,
  // referentEmail: undefined,
  //
  // beneficiaryLastName: undefined,
  // beneficiaryFirstName: undefined,
  // beneficiaryAvailability: undefined,
  // beneficiaryContactPreferences: undefined,
  // beneficiaryPhone: undefined,
  // beneficiaryEmail: undefined,
  // beneficiaryOtherContactMethod: undefined,
  // orientationReasons: undefined,
});
