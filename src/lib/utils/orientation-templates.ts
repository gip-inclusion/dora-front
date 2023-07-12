// prettier-ignore
export function renderAcceptMessage(data: Record<string, string | undefined>) {
  return `Bonjour,

Nous avons le plaisir de vous informer que la structure "${data.prescriberStructure}" a validé la demande réalisée par ${data.prescriberName} concernant votre positionnement sur "${data.serviceName}".

Vous êtes désormais intégré·e au programme "${data.serviceName}", qui se déroulera du ${data.startDate} jusqu’au ${data.endDate} à ${location}.

Pour toute information supplémentaire, n’hésitez pas à contacter votre référent${data.
    structurePhone ? `ou la structure directement au ${data.structurePhone}` : ""
  }.

Nous vous souhaitons une bonne continuation.

Bien à vous,

${data.prescriberName}
${data.prescriberStructure}`;
}
