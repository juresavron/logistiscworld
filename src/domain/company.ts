import { z } from "zod";

export const countries = [
  { code: "SI", name: "Slovenia", slug: "slovenia", city: "Koper & Ljubljana" },
  { code: "IT", name: "Italy", slug: "italy", city: "Trieste & beyond" },
  { code: "AT", name: "Austria", slug: "austria", city: "Graz & Vienna" },
  { code: "HR", name: "Croatia", slug: "croatia", city: "Rijeka & Zagreb" },
  { code: "HU", name: "Hungary", slug: "hungary", city: "Budapest & beyond" },
  { code: "DE", name: "Germany", slug: "germany", city: "Germany" },
] as const;
export const countryCodes = ["SI", "IT", "AT", "HR", "HU", "DE"] as const;
export type CountryCode = (typeof countryCodes)[number];
export const services = [
  {
    id: "road",
    name: "Road transport",
    description: "Regional distribution to cross-border haulage.",
    icon: "truck",
  },
  {
    id: "sea",
    name: "Sea freight",
    description: "Find a partner for your next ocean shipment.",
    icon: "ship",
  },
  {
    id: "air",
    name: "Air freight",
    description: "Time-sensitive cargo, connected by air.",
    icon: "plane",
  },
  {
    id: "customs",
    name: "Customs clearance",
    description: "Local knowledge for goods crossing borders.",
    icon: "document",
  },
  {
    id: "warehouse",
    name: "Warehousing",
    description: "Space, storage, and distribution expertise.",
    icon: "warehouse",
  },
  {
    id: "forwarding",
    name: "Freight forwarding",
    description: "Coordinate every stage of your shipment.",
    icon: "route",
  },
  { id: "rail", name: "Rail freight", description: "Rail and intermodal freight transport.", icon: "train" },
] as const;
export type ServiceId = (typeof services)[number]["id"];
export const serviceIds = [
  "rail",
  "road",
  "sea",
  "air",
  "customs",
  "warehouse",
  "forwarding",
] as const;
export const companyTypes = [
  "Freight forwarder",
  "Carrier",
  "Customs broker",
  "Warehouse operator",
] as const;
export const capabilityOptions = [
  "Refrigerated cargo",
  "Dangerous goods",
  "Oversized cargo",
  "E-commerce fulfilment",
] as const;
export const countryName = (code: string) =>
  countries.find((c) => c.code === code)?.name ?? code;
export const serviceName = (id: string) =>
  services.find((s) => s.id === id)?.name ?? id;

const webUrl = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => !value || safeContactHref("website", value) !== null,
    "Use a complete https:// website address.",
  );
const officeDetails = {
  address: z.string().trim().max(200).optional(),
  postalCode: z.string().trim().max(20).optional(),
  email: z.string().email().max(150).optional(),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/).optional(),
  fax: z.string().regex(/^\+[1-9]\d{6,14}$/).optional(),
};
export const companyFields = z.object({
  featured: z.boolean().optional(),
  listingNote: z.string().max(2000).optional(),
  serviceDetails: z.array(z.string().max(200)).max(20).optional(),
  additionalSources: z.array(webUrl).max(10).optional(),
  id: z.string().min(1).max(80),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase words separated by hyphens.",
    ),
  name: z.string().trim().min(3, "Enter at least 3 characters.").max(100),
  legalName: z.string().trim().min(3, "Enter the legal company name.").max(150),
  summary: z
    .string()
    .trim()
    .min(25, "Describe the company in at least 25 characters.")
    .max(260),
  description: z.string().trim().max(3000),
  types: z.array(z.enum(companyTypes)).min(1, "Choose a company type.").max(4),
  offices: z
    .array(
      z.object({
        city: z.string().trim().min(2, "Enter the office city.").max(80),
        country: z.enum(countryCodes),
        primary: z.boolean(),
        ...officeDetails,
      }),
    )
    .min(1)
    .max(20),
  services: z
    .array(z.enum(serviceIds))
    .min(1, "Choose at least one service.")
    .max(serviceIds.length),
  coverage: z
    .array(
      z.object({
        service: z.enum(serviceIds),
        countries: z.array(z.enum(countryCodes)).max(countryCodes.length),
      }),
    )
    .max(serviceIds.length),
  capabilities: z.array(z.enum(capabilityOptions)).max(4),
  website: webUrl,
  email: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email address.").max(150),
  ]),
  phone: z
    .string()
    .trim()
    .refine(
      (s) => !s || /^\+[1-9]\d{6,14}$/.test(s),
      "Use international format, for example +38640123456.",
    ),
  whatsapp: z
    .string()
    .trim()
    .refine(
      (s) => !s || /^\+[1-9]\d{6,14}$/.test(s),
      "Use an international WhatsApp number.",
    ),
  sourceUrl: webUrl,
  checkedAt: z
    .string()
    .refine(
      (s) =>
        !s || (/^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s))),
      "Enter a valid date.",
    ),
  tone: z.enum(["green", "blue", "rust", "plum"]),
  initials: z.string().min(1).max(3),
  isSample: z.boolean(),
});
export const companyDraftSchema = companyFields.extend({
  slug: z.string().max(100),
  name: z.string().max(100),
  legalName: z.string().max(150),
  summary: z.string().max(260),
  types: z.array(z.enum(companyTypes)).max(4),
  services: z.array(z.enum(serviceIds)).max(serviceIds.length),
  offices: z
    .array(
      z.object({
        city: z.string().max(80),
        country: z.enum(countryCodes),
        primary: z.boolean(),
        ...officeDetails,
      }),
    )
    .min(1)
    .max(20),
});
export const companySchema = companyFields.superRefine((company, ctx) => {
  if (company.offices.filter((o) => o.primary).length !== 1)
    ctx.addIssue({
      code: "custom",
      path: ["offices"],
      message: "Choose exactly one primary office.",
    });
  if (!company.website && !company.phone && !company.email)
    ctx.addIssue({
      code: "custom",
      path: ["website"],
      message: "Provide a website, phone number, or email address.",
    });
  if (company.coverage.some((c) => !company.services.includes(c.service)))
    ctx.addIssue({
      code: "custom",
      path: ["coverage"],
      message: "Coverage must belong to a selected service.",
    });
  if (
    new Set(company.coverage.map((c) => c.service)).size !==
    company.coverage.length
  )
    ctx.addIssue({
      code: "custom",
      path: ["coverage"],
      message: "Each service can have only one coverage entry.",
    });
});
export type Company = z.infer<typeof companySchema>;
export type ContactChannel = "website" | "email" | "phone" | "whatsapp";
export function safeContactHref(
  channel: ContactChannel,
  value: string,
): string | null {
  if (!value || /[\r\n]/.test(value)) return null;
  if (channel === "website") {
    try {
      const u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password
        ? u.href
        : null;
    } catch {
      return null;
    }
  }
  if (channel === "email")
    return /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)
      ? `mailto:${value}`
      : null;
  if (!/^\+[1-9]\d{6,14}$/.test(value)) return null;
  return channel === "phone"
    ? `tel:${value}`
    : `https://wa.me/${value.slice(1)}`;
}
export function publicationIssues(company: Company): string[] {
  const parsed = companySchema.safeParse(company);
  const issues = parsed.success
    ? []
    : parsed.error.issues.map((i) => i.message);
  if (!company.sourceUrl) issues.push("Add an evidence source URL.");
  if (!company.checkedAt)
    issues.push("Record the date the details were checked.");
  return issues;
}
export function blankCompany(id: string): Company {
  return {
    id,
    slug: "",
    name: "",
    legalName: "",
    summary: "",
    description: "",
    types: [],
    offices: [{ city: "", country: "SI", primary: true }],
    services: [],
    coverage: [],
    capabilities: [],
    website: "",
    email: "",
    phone: "",
    whatsapp: "",
    sourceUrl: "",
    checkedAt: "",
    tone: "green",
    initials: "LW",
    isSample: true,
  };
}
