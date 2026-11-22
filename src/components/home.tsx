import { type DirectorySearch, type searchCompanies } from "../domain/search";
import { Directory } from "./directory";
import { BuyerGuide } from "./buyer-guide";
import { LatestGuides } from "./blog";
import { DiscoveryLinks } from "./discovery";

export function Home({ result, onChange }: {
  result: ReturnType<typeof searchCompanies>;
  onChange: (patch: Partial<DirectorySearch>) => void;
}) {
  return <>
    <Directory
      referralSource={{placement:"homepage",content:"featured"}}
      result={result}
      onChange={onChange}
      title={<>Freight forwarders <em>in Slovenia.</em></>}
      subtitle="Compare logistics companies in Slovenia by service and local office. Find a provider for your shipment and contact the company directly."
    />
    <BuyerGuide/>
    <DiscoveryLinks/>
    <LatestGuides/>
  </>;
}
