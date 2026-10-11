import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Check,
  FileCheck2,
  Globe2,
  MapPin,
  Package,
  Plane,
  Route,
  Search,
  Ship,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import type { Company, ServiceId } from "../domain/company";
export { ArrowUpRight, Building2, Check, Globe2, MapPin, Search, X };
export function ServiceIcon({
  service,
  size = 22,
}: {
  service: ServiceId;
  size?: number;
}) {
  const Icon = {
    road: Truck,
    sea: Ship,
    air: Plane,
    customs: FileCheck2,
    warehouse: Warehouse,
    forwarding: Route,
  }[service];
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
export function Monogram({
  company,
  large = false,
}: {
  company: Company;
  large?: boolean;
}) {
  return (
    <div
      className={`monogram tone-${company.tone} ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      {company.initials}
      <ArrowDownLeft size={large ? 24 : 14} />
    </div>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <Package size={34} strokeWidth={1.3} />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
