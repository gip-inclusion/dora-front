import hexoid from "hexoid";

const generateId = hexoid();

export function randomId(): string {
  return generateId();
}
export function between(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}
