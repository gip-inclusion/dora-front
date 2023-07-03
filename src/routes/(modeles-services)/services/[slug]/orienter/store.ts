import { writable } from "svelte/store";
import type { Orientation } from "./types";

export const orientation = writable<Orientation>({
  concernedPublic: [],
  otherConcernedPublic: "",
  accessConditions: [],
  requirements: [],
  structure: undefined,

  referentLastName: undefined,
  referentFirstName: undefined,
  referentPhone: undefined,
  referentEmail: undefined,

  beneficiaryLastName: undefined,
  beneficiaryFirstName: undefined,
  beneficiaryDisponibility: undefined,
  beneficiaryContactPreferences: undefined,
  beneficiaryPhone: undefined,
  beneficiaryEmail: undefined,
  beneficiaryOtherContactMethod: undefined,
  orientationReasons: undefined,
});
