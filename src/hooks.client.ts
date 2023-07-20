import { ENVIRONMENT, SENTRY_DSN } from "$lib/env";
import * as Sentry from "@sentry/sveltekit";

// if (ENVIRONMENT !== "local") {
Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  tracesSampleRate: 0,
  tracePropagationTargets: [],
});
// }

export const handleError = Sentry.handleErrorWithSentry();

// export const handleError: HandleClientError = ({ error, event }) => {
//   Sentry.captureException(error, { event });
//
//   const message = ENVIRONMENT === "local" ? error.message : "Erreur inattendue";
//
//   return {
//     message,
//   };
// };
