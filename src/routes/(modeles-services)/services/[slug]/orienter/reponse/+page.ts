import type { PageLoad } from "./$types";
import type { SendOrientation } from "../types";

export const load: PageLoad = async ({ parent }) => {
  await parent();

  // const sendOrientation: SendOrientation = await getOrientation(params.token);

  const sendOrientation: SendOrientation = {
    id: "1",
    sendDate: "2021-06-01",
    status: "PENDING",
    answerDate: undefined,
    // TODO: fake data
  };

  return {
    title: `Demande orientation ${sendOrientation.id}| DORA`,
    sendOrientation,
  };
};
