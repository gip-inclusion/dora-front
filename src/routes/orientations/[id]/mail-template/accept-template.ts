export const ACCEPTED_MAIL_TEMPLATE = `Bonjour,

Nous avons le plaisir de vous informer que la structure "{{{prescriberStructure}}}" a validé la demande réalisée par {{prescriberName}} concernant votre positionnement sur "{{{serviceName}}}".

Vous êtes désormais intégré·e au programme "{{{serviceName}}}", qui se déroulera du {{{startDate}}} jusqu’au {{{endDate}}} à {{location}}.

Pour toute information supplémentaire, n’hésitez pas à contacter votre référent{{#structurePhone}} ou la structure directement au {{structurePhone}}{{/structurePhone}}.

Nous vous souhaitons une bonne continuation.

Bien à vous,

{{prescriberName}}
{{{prescriberStructure}}}`;
