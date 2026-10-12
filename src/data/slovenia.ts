import { slovenianCompanies } from "./slovenian-companies";
import { normalizeSearch, searchCompanies, type DirectorySearch } from "../domain/search";

// One shared catalog for the public directory, profiles and admin editor.
export const companies = slovenianCompanies.filter(company =>
  company.offices.some(office => office.country === "SI"),
);
export const findCompany = (slug: string) => companies.find(company => company.slug === slug);
export const normalizeSloveniaSearch = (raw: unknown): DirectorySearch => ({
  ...normalizeSearch(raw),
  office: "SI" as const,
});
export const searchSloveniaCompanies = (raw: unknown) =>
  searchCompanies(companies, normalizeSloveniaSearch(raw), 12);
