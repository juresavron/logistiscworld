import { companies } from "../data/slovenia";
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
      subtitle="Local freight forwarders and logistics providers. Compare services and contact the right company directly."
    />
    <BuyerGuide/>
  </>;
}
