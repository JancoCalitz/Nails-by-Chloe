/**
 * Normalise a South African cellphone number to E.164 (+27XXXXXXXXX).
 * Accepts "082 123 4567", "0821234567", "+27 82 123 4567", "27821234567".
 * Returns null if it is not a plausible SA mobile number.
 */
export function normaliseSaMobile(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  let national: string;
  if (digits.startsWith("+27")) national = digits.slice(3);
  else if (digits.startsWith("0027")) national = digits.slice(4);
  else if (digits.startsWith("27") && digits.length === 11) national = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 10) national = digits.slice(1);
  else return null;
  // SA mobile numbers start with 6, 7 or 8 and have 9 digits after the country code.
  if (!/^[678]\d{8}$/.test(national)) return null;
  return "+27" + national;
}

/** wa.me wants the number in international format without "+". */
export function waDigits(input: string): string | null {
  const e164 = normaliseSaMobile(input);
  if (e164) return e164.slice(1);
  const raw = input.replace(/\D/g, "");
  return raw.length >= 10 && !raw.startsWith("0") ? raw : null;
}

/** "+27821234567" -> "082 123 4567" */
export function displaySaMobile(input: string): string {
  const e164 = normaliseSaMobile(input);
  if (!e164) return input;
  const n = "0" + e164.slice(3);
  return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
}
