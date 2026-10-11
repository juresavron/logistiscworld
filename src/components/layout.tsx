import { emptySearch } from "../domain/search";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Menu, X, MoveUpRight } from "lucide-react";
import { CompareTray, useComparison } from "./comparison";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="LogisticsWorld home">
      <span className="brand-icon">
        <MoveUpRight size={23} strokeWidth={2.5} />
      </span>
      logistics<span className="brand-light">world</span>
      <span className="brand-dot">.</span>
    </Link>
  );
}
export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const { ids } = useComparison();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="country-site">
      <div className="demo-bar">
        <span className="demo-dot" />
        WORKING PREVIEW{" "}
        <span className="demo-copy">
          Fictional companies · No live contacts
        </span>
        <Link to="/admin">
          Explore admin <ArrowUpRight size={12} />
        </Link>
      </div>
      <header className="site-header">
        <div className="nav-inner">
          <div className="edition-brand"><Brand /><Link className="edition-switch" to="/locations"><span className="slovenia-mark" aria-hidden="true" /> Slovenia</Link></div>
          <nav
            id="main-navigation"
            className={menu ? "main-nav open" : "main-nav"}
            aria-label="Main navigation"
          >
            <Link
              to="/companies"
              search={{ ...emptySearch, office: "SI" }}
              data-active={path.startsWith("/companies")}
              onClick={() => setMenu(false)}
            >
              Find companies
            </Link>
            <Link
              to="/services"
              data-active={path.startsWith("/services")}
              onClick={() => setMenu(false)}
            >
              Services
            </Link>
            <Link
              to="/locations"
              data-active={path.startsWith("/locations")}
              onClick={() => setMenu(false)}
            >
              Locations
            </Link>
            <Link
              to="/methodology"
              data-active={path === "/methodology"}
              onClick={() => setMenu(false)}
            >
              Buyer’s guide
            </Link>
          </nav>
          <div className="nav-actions">
            {ids.length > 0 && (
              <Link
                className="compare-nav"
                to="/compare"
                search={{ company: ids }}
              >
                Compare ({ids.length})
              </Link>
            )}
            <Link
              className="button outline small add-company"
              to="/submit-company"
            >
              List your company <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button mobile-menu"
              aria-expanded={menu}
              aria-controls="main-navigation"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Find your next freight forwarder.
              <br />
              Local expertise. Direct connections.
            </p>
          </div>
          <div>
            <span className="eyebrow">Explore</span>
            <Link to="/companies" search={{ ...emptySearch, office: "SI" }}>
              Company directory
            </Link>
            <Link to="/services">Logistics services</Link>
            <Link to="/locations">Regional markets</Link>
          </div>
          <div>
            <span className="eyebrow">For companies</span>
            <Link to="/submit-company">List your company</Link>
            <Link to="/methodology">How selection works</Link>
            <Link to="/admin">Demo workspace</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Slovenia · Italy · Austria · Croatia · Hungary</span>
          <span>Development preview · All company records are fictional</span>
        </div>
      </footer>
      <CompareTray />
    </div>
  );
}
