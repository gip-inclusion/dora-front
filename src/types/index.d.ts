export {};

declare global {
  interface Window {
    plausible: () => void;
  }
}
