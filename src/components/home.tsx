import { companies } from "../data/companies";
import { type DirectorySearch, searchCompanies } from "../domain/search";
import { Directory } from "./directory";
import { BuyerGuide } from "./buyer-guide";

export function Home({ search, onChange }: {
  search: DirectorySearch;
  onChange: (patch: Partial<DirectorySearch>) => void;
}) {
  return <>
    <Directory
      result={searchCompanies(companies, { ...search, office: "SI" })}
      onChange={onChange}
      title={<>Best logistics companies <em>in Slovenia.</em></>}
      subtitle="Find the right company for your shipment. Compare services, check coverage, and contact them directly."
    />
    <BuyerGuide/>
  </>;
}
