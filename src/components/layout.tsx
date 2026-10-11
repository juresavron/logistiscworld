import { emptySearch } from "../domain/search";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Menu, X, MoveUpRight } from "lucide-react";
import { CompareTray, useComparison } from "./comparison";

export function Brand() {
  return (
    <Link to="/" search={emptySearch} className="brand" aria-label="LogisticsWorld home">
      <span className="brand-icon">
        <MoveUpRight size={23} strokeWidth={2.5} />
      </span>
      logistics<span className="brand-light">world</span>
      <span className="brand-dot">.</span>
    </Link>
  );
}
function DirectoryBrand() {
  return <Link to="/" search={emptySearch} className="directory-wordmark" aria-label="LogisticsWorld home"><span className="wordmark-symbol" aria-hidden="true"><i/><i/><i/></span><span>LOGISTICS<span>WORLD</span></span></Link>;
}
export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const { ids } = useComparison();
  const path = useRouterState({ select: s => s.location.pathname });
  return <div className="country-site">
    <div className="edition-utility wrap"><span>THE FREIGHT DIRECTORY <span className="utility-slash">/</span> SLOVENIA</span><span>Preview edition · Fictional listings</span></div>
    <header className="site-header"><div className="nav-inner">
      <DirectoryBrand />
      <nav id="main-navigation" className={menu ? "main-nav open" : "main-nav"} aria-label="Main navigation">
        <Link to="/companies" search={{...emptySearch, office:"SI"}} data-active={path.startsWith("/companies")} onClick={()=>setMenu(false)}><span>01</span> Directory</Link>
        <Link to="/services" data-active={path.startsWith("/services")} onClick={()=>setMenu(false)}><span>02</span> Services</Link>
        <Link to="/locations" data-active={path.startsWith("/locations")} onClick={()=>setMenu(false)}><span>03</span> Markets</Link>
      </nav>
      <div className="nav-actions"><Link className="shortlist-link" to="/compare" search={{company:ids}}>Shortlist <span>{ids.length.toString().padStart(2,"0")}</span></Link><Link className="listing-link" to="/submit-company">List a company <ArrowUpRight size={16}/></Link><button className="icon-button mobile-menu" aria-expanded={menu} aria-controls="main-navigation" aria-label={menu?"Close menu":"Open menu"} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
    </div></header>
    <main id="main-content">{children}</main>
    <footer className="directory-footer"><div className="wrap"><div className="directory-footer-top"><DirectoryBrand/><p>A practical directory for finding<br/>logistics expertise in Slovenia.</p><Link to="/submit-company">Add your company to the directory <ArrowUpRight size={18}/></Link></div><div className="directory-footer-bottom"><span>© {new Date().getFullYear()} LogisticsWorld</span><div><Link to="/methodology">Our approach</Link><Link to="/locations">Other markets</Link><Link to="/admin">Demo admin</Link></div><span>Slovenia edition / English</span></div></div></footer>
    <CompareTray/>
  </div>;
}
