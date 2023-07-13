import { formatPhoneNumber } from "./misc";

// prettier-ignore
export function renderPrescripterAcceptMessage(data: Record<string, string | undefined>) {
    return `Bonjour,

Nous avons le plaisir de vous informer que votre demande d’orientation a été acceptée ! 🎉

Votre demande concernant ${data.beneficiaryFirstName} ${data.beneficiaryLastName} à été validée par la structure « ${data.prescriberStructureName} ».

Si vous avez des questions supplémentaires ou si vous souhaitez obtenir plus d’informations, n’hésitez pas à contacter le référent de l’action, ${data.referentFirstName} ${data.referentLastName} - ${data.referentEmail} - ${data.referentPhone}.

Cordialement,
${data.prescriberName}
${data.prescriberStructureName}`;
}

// prettier-ignore
export function renderBeneficiaryAcceptMessage(data: Record<string, string | undefined>) {
  return `Bonjour,

Nous avons le plaisir de vous informer que la structure « ${data.prescriberStructureName}" a validé la demande réalisée par ${data.referentFirstName} ${data.referentLastName} concernant votre positionnement sur « ${data.serviceName} ».

Pour toute information supplémentaire, n’hésitez pas à contacter votre référent${ data.prescriberStructurePhone ? ` ou la structure directement au ${formatPhoneNumber(data.prescriberStructurePhone)}`: ""}.

Nous vous souhaitons une bonne continuation.

Bien à vous,

${data.prescriberName}
${data.prescriberStructureName}`;
}

// prettier-ignore
export function renderRejectMessage(
  reasons: string[],
  reasonsChoices: { value: string; label: string }[],
  data: Record<string, string | undefined>
) {
  if (reasons.length === 0) {
    return "";
  }

  if (reasons.length > 1) {
    return `Bonjour ${data.referentFirstName} ${data.referentLastName},

Nous vous remercions d'avoir soumis la demande concernant ${data.beneficiaryFirstName} ${data.beneficiaryLastName} pour le service « ${data.serviceName} ». Après avoir examiné attentivement la situation, nous regrettons de vous informer que nous ne pouvons pas donner suite à cette demande pour le moment. Plusieurs raisons spécifiques ont été identifiées, notamment :

${reasons.forEach((reason) => `- ${reasonsChoices.find((choice) => choice.value === reason)?.label}\n`)}

Ces facteurs combinés ont conduit à notre décision de ne pas donner suite à la demande actuelle.

Si vous avez des questions supplémentaires ou si vous souhaitez discuter plus en détail des raisons du refus, n'hésitez pas à nous contacter.

Cordialement,
${data.prescriberName}
${data.prescriberStructureName}
    `;
  }

  if (reasons[0] === "bénéficiaire-non-joignable") {

  } else if (reasons[0] === "bénéficiaire-absent") {
  } else if (reasons[0] === "bénéficiaire-en-emploi") {
  } else if (reasons[0] === "bénéficiaire-en-formation") {
  } else if (reasons[0] === "bénéficiaire-non-éligible") {
  } else if (reasons[0] === "bénéficiaire-non-mobile") {
  } else if (reasons[0] === "bénéficiaire-non-intéressé") {
  } else if (reasons[0] === "freins-périphériques") {
  } else if (reasons[0] === "session-complète") {
  } else if (reasons[0] === "orientation-en-doublon") {
  } else if (reasons[0] === "autre") {
  }

  return "";
}
