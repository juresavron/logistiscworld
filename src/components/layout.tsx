import { emptySearch } from "../domain/search";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X, MoveUpRight } from "lucide-react";

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
export function DirectoryBrand() {
  return <Link to="/" search={emptySearch} className="directory-wordmark" aria-label="LogisticsWorld home"><span className="wordmark-symbol" aria-hidden="true"><i/><i/><i/></span><span>LOGISTICS<span>WORLD</span></span></Link>;
}
export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const path = useRouterState({ select: s => s.location.pathname });
  useEffect(() => setMenu(false), [path]);
  return <div className="country-site">
    <div className="edition-utility"><span>LOGISTICSWORLD <span className="utility-slash">/</span> SLOVENIA</span><span>Preview · Fictional company data</span></div>
    <header className="site-header"><div className="nav-inner">
      <DirectoryBrand />
      <nav id="main-navigation" className={menu ? "main-nav open" : "main-nav"} aria-label="Main navigation" onKeyDown={e => { if (e.key === "Escape") { setMenu(false); menuButton.current?.focus(); } }}>
        <Link to="/companies" search={{...emptySearch, office:"SI"}} data-active={path === "/" || path.startsWith("/companies")} onClick={()=>setMenu(false)}>Find a company</Link>
        <Link to="/services" data-active={path.startsWith("/services")} onClick={()=>setMenu(false)}>Services</Link>
      </nav>
      <div className="nav-actions"><Link className="listing-link" to="/submit-company">List a company <ArrowUpRight size={16}/></Link><button ref={menuButton} className="icon-button mobile-menu" aria-expanded={menu} aria-controls="main-navigation" aria-label={menu?"Close menu":"Open menu"} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
    </div></header>
    <main id="main-content">{children}</main>
    <footer className="directory-footer"><div className="wrap"><div className="directory-footer-top"><DirectoryBrand/><p>A practical directory for finding<br/>logistics expertise in Slovenia.</p><Link to="/submit-company">List your company <ArrowUpRight size={18}/></Link></div><div className="directory-footer-bottom"><span>© {new Date().getFullYear()} LogisticsWorld</span><div><Link to="/methodology">Our approach</Link><Link to="/services">Services</Link></div><span>Slovenia / English</span></div></div></footer>
  </div>;
}
