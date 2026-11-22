import { type DirectorySearch, type searchCompanies } from "../domain/search";
import { Directory } from "./directory";
import { BuyerGuide } from "./buyer-guide";
import { LatestGuides } from "./blog";

export function Home({ result, onChange }: {
  result: ReturnType<typeof searchCompanies>;
  onChange: (patch: Partial<DirectorySearch>) => void;
}) {
  return <>
    <Directory
      referralSource={{placement:"homepage",content:"featured"}}
      result={result}
      onChange={onChange}
      title={<>Best logistics companies <em>in Slovenia.</em></>}
      subtitle="Local freight forwarders and logistics providers. Find the right company and contact them directly."
    />
    <BuyerGuide/>
    <LatestGuides/>
  </>;
}
