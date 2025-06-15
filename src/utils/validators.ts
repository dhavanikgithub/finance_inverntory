export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidContact(contact: string): boolean {
  const contactRegex = /^[6-9]\d{9}$/;
  return contactRegex.test(contact);
}