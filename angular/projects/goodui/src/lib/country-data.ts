import { countries as flagCountries } from 'country-flag-icons';

const nonCountryCodes = new Set(['AC', 'EU', 'IC', 'TA', 'XA', 'XC', 'XO']);
let flagLoad: Promise<Record<string, string>> | undefined;

/** Flag-backed ISO 3166-1 regions, plus XK. */
export const GOOD_COUNTRY_CODES: readonly string[] = flagCountries
  .filter(code => /^[A-Z]{2}$/.test(code) && !nonCountryCodes.has(code));

export function loadGoodCountryFlags(): Promise<Record<string, string>> {
  return flagLoad ??= import('country-flag-icons/string/3x2').then(module => module as Record<string, string>);
}

export function goodCountryFlagUrl(markup: string | undefined): string | undefined {
  return markup ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}` : undefined;
}
