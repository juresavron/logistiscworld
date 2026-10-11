import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Columns3, X } from "lucide-react";
import { companies } from "../data/slovenia";
import { compareIds } from "../domain/search";

type Value = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  set: (ids: string[]) => void;
  notice: string;
};
const Context = createContext<Value | null>(null);
const KEY = "logisticsworld:comparison:v1";
export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      setIds(
        compareIds(JSON.parse(sessionStorage.getItem(KEY) ?? "[]")).filter(
          (id) => companies.some((c) => c.id === id),
        ),
      );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        sessionStorage.setItem(KEY, JSON.stringify(ids));
      } catch {}
  }, [ids, ready]);
  const set = (next: string[]) =>
    setIds(compareIds(next).filter((id) => companies.some((c) => c.id === id)));
  const toggle = (id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter((i) => i !== id));
      setNotice("Company removed from comparison.");
      return;
    }
    if (ids.length >= 3) {
      setNotice("Compare up to three companies. Remove one to add another.");
      return;
    }
    if (companies.some((c) => c.id === id)) {
      setIds([...ids, id]);
      setNotice("Company added to comparison.");
    }
  };
  return (
    <Context.Provider
      value={{
        ids,
        toggle,
        set,
        clear: () => {
          setIds([]);
          setNotice("Comparison cleared.");
        },
        notice,
      }}
    >
      {children}
      <div className="sr-only" role="status">
        {notice}
      </div>
    </Context.Provider>
  );
}
export function useComparison() {
  const value = useContext(Context);
  if (!value) throw Error("Missing comparison provider");
  return value;
}
export function CompareButton({
  id,
  compact = false,
}: {
  id: string;
  compact?: boolean;
}) {
  const { ids, toggle } = useComparison(),
    selected = ids.includes(id);
  return (
    <button
      className={`compare-button ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={() => toggle(id)}
    >
      <span className="check-box" aria-hidden="true">
        {selected ? "✓" : "+"}
      </span>
      {compact
        ? "Compare"
        : selected
          ? "Added to comparison"
          : "Compare company"}
    </button>
  );
}
export function CompareTray() {
  const { ids, toggle, clear, notice } = useComparison();
  if (!ids.length) return null;
  return (
    <aside className="compare-tray" aria-label="Company comparison">
      <div className="tray-label">
        <Columns3 size={20} />
        <strong>
          Compare <span>{ids.length}/3</span>
        </strong>
      </div>
      <div className="tray-companies">
        {ids.map((id) => (
          <button
            key={id}
            onClick={() => toggle(id)}
            aria-label={`Remove ${companies.find((c) => c.id === id)?.name}`}
          >
            {companies.find((c) => c.id === id)?.name}
            <X size={13} />
          </button>
        ))}
      </div>
      <span className="tray-notice">
        {notice.startsWith("Compare up") ? notice : ""}
      </span>
      <Link
        className="button orange small"
        to="/compare"
        search={{ company: ids }}
      >
        Compare <ArrowRight size={16} />
      </Link>
      <button
        className="icon-button"
        onClick={clear}
        aria-label="Clear comparison"
      >
        <X size={18} />
      </button>
    </aside>
  );
}
