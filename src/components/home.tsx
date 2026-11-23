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
      subtitle="Find a freight forwarder in Slovenia for your international shipment. Compare logistics companies by transport service and local office, including Koper and Ljubljana."
    />
    <BuyerGuide/>
    <DiscoveryLinks/>
    <LatestGuides/>
  </>;
}
