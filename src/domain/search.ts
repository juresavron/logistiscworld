import { z } from "zod";
import {
  capabilityOptions,
  companyTypes,
  countries,
  countryCodes,
  countryName,
  serviceIds,
  serviceName,
  type Company,
  type CountryCode,
  type ServiceId,
} from "./company";

export type DirectorySearch = {
  q: string;
  services: ServiceId[];
  office: CountryCode | "";
  coverage: CountryCode | "";
  type: string;
  capabilities: string[];
  sort: "relevance" | "name";
  page: number;
};
export const emptySearch: DirectorySearch = {
  q: "",
  services: [],
  office: "",
  coverage: "",
  type: "",
  capabilities: [],
  sort: "relevance",
  page: 1,
};
function list(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v) => typeof v === "string")
    : typeof value === "string"
      ? value.split(",")
      : [];
}
export function normalizeSearch(raw: unknown): DirectorySearch {
  const r = z.record(z.unknown()).catch({}).parse(raw);
  return {
    q: typeof r.q === "string" ? r.q.trim().slice(0, 100) : "",
    services: [
      ...new Set(
        list(r.services).filter((s): s is ServiceId =>
          (serviceIds as readonly string[]).includes(s),
        ),
      ),
    ],
    office: (countryCodes as readonly unknown[]).includes(r.office)
      ? (r.office as CountryCode)
      : "",
    coverage: (countryCodes as readonly unknown[]).includes(r.coverage)
      ? (r.coverage as CountryCode)
      : "",
    type: (companyTypes as readonly unknown[]).includes(r.type)
      ? (r.type as string)
      : "",
    capabilities: [
      ...new Set(
        list(r.capabilities).filter((s) =>
          (capabilityOptions as readonly string[]).includes(s),
        ),
      ),
    ],
    sort: r.sort === "name" ? "name" : "relevance",
    page: Number.isFinite(Number(r.page))
      ? Math.min(10000, Math.max(1, Math.floor(Number(r.page))))
      : 1,
  };
}
export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function searchCompanies(
  records: Company[],
  raw: unknown,
  pageSize = 6,
) {
  const s = normalizeSearch(raw);
  const terms = normalizeText(s.q).split(/\s+/).filter(Boolean);
  const matches = records.filter((c) => {
    const haystack = normalizeText(
      [
        c.name,
        c.summary,
        c.description,
        ...(c.serviceDetails ?? []),
        ...c.services.map(serviceName),
        ...c.offices.flatMap((o) => [o.city, o.address ?? "", countryName(o.country)]),
        ...c.types,
        ...c.capabilities,
      ].join(" "),
    );
    return (
      terms.every((t) => haystack.includes(t)) &&
      (!s.services.length || c.services.some((v) => s.services.includes(v))) &&
      (!s.office || c.offices.some((o) => o.country === s.office)) &&
      (!s.coverage ||
        c.coverage.some(
          (v) =>
            v.countries.includes(s.coverage as CountryCode) &&
            (!s.services.length || s.services.includes(v.service)),
        )) &&
      (!s.type || c.types.some((t) => t === s.type)) &&
      s.capabilities.every((v) => c.capabilities.some((cap) => cap === v))
    );
  });
  matches.sort((a, b) => {
    if (s.sort === "relevance") {
      const featured = Number(b.featured ?? false) - Number(a.featured ?? false);
      if (featured) return featured;
    }
    if (s.sort === "relevance" && s.q) {
      const exact = (c: Company) =>
        normalizeText(c.name).startsWith(normalizeText(s.q)) ? 1 : 0;
      const d = exact(b) - exact(a);
      if (d) return d;
    }
    return a.name.localeCompare(b.name, "en") || a.id.localeCompare(b.id);
  });
  const size = Math.max(1, Math.min(50, Math.floor(pageSize)));
  const pages = Math.max(1, Math.ceil(matches.length / size));
  const page = Math.min(s.page, pages);
  return {
    companies: matches.slice((page - 1) * size, page * size),
    total: matches.length,
    page,
    pages,
    search: { ...s, page },
  };
}
export function compareIds(raw: unknown): string[] {
  return [...new Set(list(raw).filter((v) => /^sample-\d{2}$/.test(v)))].slice(
    0,
    3,
  );
}
export function countryFromSlug(slug: string) {
  return countries.find((c) => c.slug === slug);
}
