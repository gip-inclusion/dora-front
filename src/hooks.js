import { dev } from "$app/env";

import { API_URL } from "$lib/env";
import * as Sentry from "@sentry/browser";

export async function handleError({ error, event }) {
  Sentry.captureException(error, { event });
}

export async function handle({ event, resolve }) {
  const response = await resolve(event);

  // https://help.hotjar.com/hc/en-us/articles/115011640307-Content-Security-Policies

  const connectSrc = `connect-src ${API_URL} ${
    dev ? "ws:" : ""
  } https://api-adresse.data.gouv.fr/ https://plausible.io/api/event https://*.sentry.io http://*.hotjar.com:* https://*.hotjar.com:* http://*.hotjar.io https://*.hotjar.io wss://*.hotjar.com`;
  const scriptSrc = `script-src 'self' 'unsafe-inline' https://metabase.dora.fabrique.social.gouv.fr/app/iframeResizer.js https://plausible.io/js/plausible.outbound-links.js https://static.hotjar.com https://script.hotjar.com http://*.hotjar.com https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io`;
  const frameSrc = `frame-src http://metabase.dora.fabrique.social.gouv.fr https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io`;
  const fontSrc = `font-src 'self' http://*.hotjar.com https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io`;
  const imgSrc = `img-src 'self' data: http://*.hotjar.com https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io`;

  response.headers["X-Frame-Options"] = "DENY";
  response.headers["X-XSS-Protection"] = "1; mode=block";
  response.headers["X-Content-Type-Options"] = "nosniff";
  response.headers[
    "Content-Security-Policy"
  ] = `default-src 'none';  ${connectSrc}; ${scriptSrc}; ${fontSrc}; ${imgSrc}; style-src 'self' 'unsafe-inline'; ${frameSrc}`;

  return response;
}
