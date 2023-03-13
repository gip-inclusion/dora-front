import dayjs from "dayjs";

export function computeRelativeDateLabel(
  dateString: string,
  prefix = "Actualisé"
) {
  const day = dayjs(dateString);
  const dayDiff = dayjs().diff(day, "day");
  const weekDiff = dayjs().diff(day, "week");
  const monthDiff = dayjs().diff(day, "month");
  const yearDiff = dayjs().diff(day, "year");

  let label = "";
  if (dayDiff < 1) {
    label = `${prefix} aujourd'hui`;
  } else if (dayDiff < 7) {
    label = `${prefix} il y a ${dayDiff} jour${dayDiff > 1 ? "s" : ""}`;
  } else if (weekDiff <= 5) {
    label = `${prefix} il y a ${weekDiff} semaine${weekDiff > 1 ? "s" : ""}`;
  } else if (monthDiff < 12) {
    label = `${prefix} il y a ${monthDiff} mois`;
  } else {
    label = `${prefix} il y a plus de ${yearDiff} an${yearDiff > 1 ? "s" : ""}`;
  }
  return label;
}
