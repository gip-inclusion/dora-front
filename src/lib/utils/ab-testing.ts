import { between } from "./random";
import { difference } from "./array";
import { browser } from "$app/environment";

const AB_TESTING_KEY = "testingGroups";

type ABTestingData = { name: string; groupNames: string[] };

const CURRENT_AB_TESTS: ABTestingData[] = [
  {
    name: "mobilization",
    groupNames: [
      "mobilisation-fond-bleu",
      "mobilisation-fond-blanc",
      "mobilisation-ancien-design",
    ],
  },
];
type ABTestingUserGroups = Record<string, string>;

function getABTestingUserGroups(): ABTestingUserGroups {
  const abTestingUserGroups =
    window.localStorage.getItem(AB_TESTING_KEY) || "{}";
  try {
    return JSON.parse(abTestingUserGroups);
  } catch (_err) {
    return {};
  }
}

export function refreshExperiments() {
  const abTestingUserGroups = getABTestingUserGroups();

  // Pas de groupes existants, on les initialise
  if (Object.keys(abTestingUserGroups).length === 0) {
    const newAbTestingUserGroups: ABTestingUserGroups = {};
    CURRENT_AB_TESTS.forEach((abTest) => {
      newAbTestingUserGroups[abTest.name] =
        abTest.groupNames[between(1, abTest.groupNames.length) - 1];
    });
    window.localStorage.setItem(
      AB_TESTING_KEY,
      JSON.stringify(newAbTestingUserGroups)
    );
    return;
  }

  // On vérifie que les groupes existants sont toujours valides
  const currentABTestNames = CURRENT_AB_TESTS.map((abTest) => abTest.name);
  const userExperimentsNames = Object.keys(abTestingUserGroups);

  const abTestsDifference = difference(
    currentABTestNames,
    userExperimentsNames
  );

  if (abTestsDifference.length > 0) {
    const newAbTestingUserGroups: ABTestingUserGroups = {
      ...abTestingUserGroups,
    };

    abTestsDifference.forEach((abTestName) => {
      const abTestToAdd = CURRENT_AB_TESTS.find(
        ({ name }) => abTestName === name
      );

      // AB-testing à ajouter
      if (abTestToAdd) {
        newAbTestingUserGroups[abTestToAdd.name] =
          abTestToAdd.groupNames[between(1, abTestToAdd.groupNames.length) - 1];
      } else {
        // AB-testing à supprimer
        delete abTestingUserGroups[abTestName];
      }
    });

    window.localStorage.setItem(
      AB_TESTING_KEY,
      JSON.stringify(newAbTestingUserGroups)
    );
  }
}

export function getABTestingUserGroup(abTestingName: string): string {
  // Pour le SEO
  if (!browser) {
    return CURRENT_AB_TESTS[abTestingName].groupNames[0];
  }

  const abTestUserGroup = getABTestingUserGroups()[abTestingName];
  if (!abTestUserGroup) {
    refreshExperiments();
  }
  return getABTestingUserGroups()[abTestingName];
}

export function clearABTestingUserGroups() {
  window.localStorage.removeItem(AB_TESTING_KEY);
}
