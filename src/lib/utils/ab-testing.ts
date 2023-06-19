import { browser } from "$app/environment";
import * as Sentry from "@sentry/browser";
import { getRandomIntBetween } from "./random";

const AB_TESTING_KEY = "testingGroups";

type AbTestingData = { name: string; groupNames: string[] };

const CURRENT_AB_TESTS: AbTestingData[] = [
  {
    name: "mobilisation",
    groupNames: [
      "mobilisation--fond-bleu",
      "mobilisation--fond-blanc",
      "mobilisation--ancien-design",
    ],
  },
];
type UserAbTestingGroups = Record<string, string>;

function getUserAbTestingGroups(): UserAbTestingGroups {
  const abTestingUserGroups =
    window.localStorage.getItem(AB_TESTING_KEY) || "{}";
  try {
    return JSON.parse(abTestingUserGroups);
  } catch (_err) {
    return {};
  }
}

export function refreshExperiments() {
  const abTestingUserGroups = getUserAbTestingGroups();

  // Pas de groupes existants, on les initialise
  if (Object.keys(abTestingUserGroups).length === 0) {
    const newAbTestingUserGroups: UserAbTestingGroups = {};
    CURRENT_AB_TESTS.forEach((abTest) => {
      newAbTestingUserGroups[abTest.name] =
        abTest.groupNames[getRandomIntBetween(1, abTest.groupNames.length) - 1];
    });
    window.localStorage.setItem(
      AB_TESTING_KEY,
      JSON.stringify(newAbTestingUserGroups)
    );
    return;
  }

  // On vérifie que les groupes existants sont toujours valides tout en retirant les anciens
  const userExperimentsNames = Object.keys(abTestingUserGroups);
  const newAbTestingUserGroups: UserAbTestingGroups = {};

  CURRENT_AB_TESTS.map((abTest) => abTest.name).forEach((abTestName) => {
    if (userExperimentsNames.includes(abTestName)) {
      // On conserve le groupe existant
      console.log("keep", abTestName);
      newAbTestingUserGroups[abTestName] = abTestingUserGroups[abTestName];
    } else {
      // On ajoute le nouveau groupe
      console.log("add", abTestName);
      const abTest = CURRENT_AB_TESTS.find(({ name }) => name === abTestName);
      if (abTest) {
        newAbTestingUserGroups[abTestName] =
          abTest.groupNames[
            getRandomIntBetween(1, abTest.groupNames.length) - 1
          ];
      }
    }
  });

  console.log(abTestingUserGroups);
  console.log(newAbTestingUserGroups);

  window.localStorage.setItem(
    AB_TESTING_KEY,
    JSON.stringify(newAbTestingUserGroups)
  );
}

export function getAbTestingUserGroup(abTestingName: string): string {
  const abTest = CURRENT_AB_TESTS.find(({ name }) => name === abTestingName);
  if (!abTest) {
    Sentry.captureException(
      `${abTestingName} non trouvé dans les AB-tests en cours`
    );
    return "";
  }

  // Pour le SEO, affichage du premier groupe
  if (!browser) {
    return abTest.groupNames[0];
  }

  const abTestUserGroup = getUserAbTestingGroups()[abTestingName];
  if (!abTestUserGroup) {
    refreshExperiments();
  }

  return getUserAbTestingGroups()[abTestingName];
}
