export function userHasAcceptedMatomoTracking(): boolean {
  return window.tarteaucitron?.state?.matomo ?? false;
}
export function setUserId(userId: string) {
  window._paq.push([setUserId, userId]);
}
