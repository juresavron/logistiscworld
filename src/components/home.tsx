import { searchSloveniaCompanies } from "../data/slovenia";
import { type DirectorySearch } from "../domain/search";
import { Directory } from "./directory";
import { BuyerGuide } from "./buyer-guide";

export function Home({ search, onChange }: {
  search: DirectorySearch;
  onChange: (patch: Partial<DirectorySearch>) => void;
}) {
  return <>
    <Directory
      result={searchSloveniaCompanies(search)}
      onChange={onChange}
      title={<>Best logistics companies <em>in Slovenia.</em></>}
      subtitle="Local freight forwarders and logistics providers. Find the right company and contact them directly."
    />
    <BuyerGuide/>
  </>;
}
