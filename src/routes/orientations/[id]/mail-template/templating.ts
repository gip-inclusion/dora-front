import Mustache from "mustache";

export function renderTemplate(template: string, data: Record<string, string>) {
  return Mustache.render(template, data);
}
