import { between } from "./random";
import { difference } from "./array";

const AB_TESTING_KEY = "testingGroup";

type ABTestingData = {
  name: string;
  numberOfGroup: number;
};
type ABTestingUserGroups = Record<string, number>;

const currentABTests: ABTestingData[] = [
  { name: "mobilization", numberOfGroup: 3 },
];

function getABTestingUserGroups(): ABTestingUserGroups {
  const abTestingUserGroups =
    window.localStorage.getItem(AB_TESTING_KEY) || "[]";
  try {
    return JSON.parse(abTestingUserGroups);
  } catch (_err) {
    return {};
  }
}

export function refreshExperiments() {
  const abTestingUserGroups = getABTestingUserGroups();

  // Pas de groupes existants, on les initialise
  if (abTestingUserGroups.length === 0) {
    const newAbTestingUserGroups: ABTestingUserGroups = {};
    currentABTests.forEach((abTest) => {
      newAbTestingUserGroups[abTest.name] = between(1, abTest.numberOfGroup);
    });
    window.localStorage.setItem(
      AB_TESTING_KEY,
      JSON.stringify(newAbTestingUserGroups)
    );
    return;
  }

  // On vérifie que les groupes existants sont toujours valides
  const currentABTestNames = currentABTests.map((abTest) => abTest.name);
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
      const abTestToAdd = currentABTests.find(
        ({ name }) => abTestName === name
      );

      // AB-testing à ajouter
      if (abTestToAdd) {
        newAbTestingUserGroups[abTestToAdd.name] = between(
          1,
          abTestToAdd.numberOfGroup
        );
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

export function getABTestingUserGroup(abTestingName: string): number {
  const abTestUserGroup = getABTestingUserGroups()[abTestingName];
  if (!abTestUserGroup) {
    refreshExperiments();
  }
  return getABTestingUserGroups()[abTestingName];
}
