import { useState } from "react";
import type { Company } from "../domain/company";
import { companyLogos } from "../data/company-logos";

export function CompanyLogo({ company, size = "card" }: { company: Company; size?: "card" | "profile" | "admin" }) {
  const logo = companyLogos[company.slug];
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const available = logo && logo.src !== failedSource;
  return <span className={`company-logo company-logo--${size} ${available && logo.background === "dark" ? "company-logo--dark" : ""}`}>
    {available ? <img src={logo.src} alt={logo.label ?? `${company.name} logo`} title={logo.label} width={size === "profile" ? 168 : 112} height={size === "profile" ? 96 : 76} loading={size === "profile" ? "eager" : "lazy"} decoding="async" onError={() => setFailedSource(logo.src)}/> : <span className="company-logo-fallback" aria-hidden="true">{company.initials}</span>}
  </span>;
}
