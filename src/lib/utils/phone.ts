export function formatPhoneNumber(phoneNumber: string): string {
  return phoneNumber.match(/.{1,2}/g).join(" ");
}
