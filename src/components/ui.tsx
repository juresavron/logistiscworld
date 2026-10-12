import { CompanyLogo } from "./company-logo";
import {
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
  TrainFront,
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
    rail: TrainFront,
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
  return <CompanyLogo company={company} size={large ? "profile" : "admin"}/>;
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
