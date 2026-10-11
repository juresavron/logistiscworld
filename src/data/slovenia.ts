import { companies as sampleCompanies } from "./companies";
import { normalizeSearch, searchCompanies, type DirectorySearch } from "../domain/search";

// The public launch is Slovenia-only. Foreign fixtures remain in the demo admin.
// Keep this boundary shared by search, profiles, recommendations and comparison.
export const companies = sampleCompanies.filter(company =>
  company.offices.some(office => office.country === "SI"),
);
export const findCompany = (slug: string) => companies.find(company => company.slug === slug);
export const normalizeSloveniaSearch = (raw: unknown): DirectorySearch => ({
  ...normalizeSearch(raw),
  office: "SI" as const,
});
export const searchSloveniaCompanies = (raw: unknown) =>
  searchCompanies(companies, normalizeSloveniaSearch(raw));
