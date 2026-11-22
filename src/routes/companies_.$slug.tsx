import { pageHead } from "../domain/seo";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCompany, getDirectory } from "../server/catalog";
import { PublicLayout } from "../components/layout";
import { Profile } from "../components/profile";
import { BreadcrumbTrail } from "../components/discovery";
import { jsonLd, siteOrigin } from "../domain/seo";
export const Route = createFileRoute("/companies_/$slug")({
  loader: async ({ params }) => {
    const c = await getCompany({ data: params.slug });
    if (!c) throw notFound();
    const related = await getDirectory({ data: { services: c.services } });
    return { company: c, similar: related.companies.filter(company => company.id !== c.id).slice(0, 3) };
  },
  head: ({ loaderData }) => loaderData ? pageHead(
    `${loaderData.company.name} | Logistics in Slovenia`,
    loaderData.company.summary,
    `/companies/${loaderData.company.slug}`,
  ) : {},
  component: Page,
});
function Page() {
  const data = Route.useLoaderData(), company = data.company;
  return (
    <PublicLayout>
      <BreadcrumbTrail items={[{name:"Company directory",path:"/companies"},{name:company.name,path:`/companies/${company.slug}`}]}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({"@context":"https://schema.org","@type":"Organization",name:company.name,legalName:company.legalName,url:`${siteOrigin}/companies/${company.slug}`,...(company.website?{sameAs:[company.website]}:{}),address:company.offices.map(office=>({"@type":"PostalAddress",addressLocality:office.city,addressCountry:office.country,...(office.address?{streetAddress:office.address}:{}),...(office.postalCode?{postalCode:office.postalCode}:{})}))})}}/>
      <Profile {...data} />
    </PublicLayout>
  );
}
