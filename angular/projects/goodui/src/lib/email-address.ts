import { AbstractControl, Validators } from '@angular/forms';

const suffixes: Readonly<Record<string, string>> = {
  DE: '.de', AT: '.at', CH: '.ch', NL: '.nl', BE: '.be', FR: '.fr', IT: '.it', ES: '.es', PT: '.pt',
  DK: '.dk', SE: '.se', NO: '.no', FI: '.fi', PL: '.pl', CZ: '.cz', SK: '.sk', HU: '.hu', RO: '.ro',
  GR: '.gr', IE: '.ie', GB: '.uk', US: '.com', CA: '.ca', AU: '.com.au', NZ: '.co.nz', ZA: '.co.za',
  IN: '.in', JP: '.jp', BR: '.com.br', CN: '.cn', HK: '.hk', SG: '.sg', TR: '.com.tr', UA: '.ua',
  IL: '.co.il', MX: '.com.mx', KR: '.kr', TW: '.tw', ID: '.id',
};

/** Syntax only: a single public-style ASCII address, not DNS or mailbox verification. */
export function isEmailAddress(value: string): boolean {
  if (!value || Validators.email({ value } as AbstractControl)) return false;
  const domain = value.slice(value.lastIndexOf('@') + 1);
  return domain.includes('.') && /(?:\.[a-z]{2,63}|\.xn--[a-z0-9-]{2,59})$/i.test(domain);
}
export function emailRegion(country: string, locale: string): string {
  if (/^[a-z]{2}$/i.test(country)) return country.toUpperCase();
  try { return new Intl.Locale(locale).maximize().region ?? 'US'; }
  catch { return 'US'; }
}
export function emailSuffix(region: string, override: string | null): string {
  if (override === null) return suffixes[region] ?? '.com';
  const suffix = '.' + override.trim().replace(/^\./, '').toLowerCase();
  return isEmailAddress('x@example' + suffix) && !suffix.includes('@') ? suffix : '';
}
export function normalizeEmail(value: string): string {
  const text = value.trim();
  const at = text.lastIndexOf('@');
  return at < 0 ? text : text.slice(0, at + 1) + text.slice(at + 1).toLowerCase();
}
export function completedEmail(value: string, suffix: string): string | null {
  const text = normalizeEmail(value);
  const parts = text.split('@');
  if (parts.length !== 2 || !parts[0] || !suffix) return null;
  // A partial local name, a malformed domain, or an existing suffix is never guessed.
  const domain = parts[1].replace(/\.$/, '');
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(domain)) return null;
  const candidate = parts[0] + '@' + domain + suffix;
  return isEmailAddress(candidate) ? candidate : null;
}
