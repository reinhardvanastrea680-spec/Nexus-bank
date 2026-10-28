export default function Topbar() {
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-inner">
          <div className="topbar-msg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span>FDIC Insured · Backed by the full faith and credit of the U.S. Government · Member FDIC</span>
          </div>
          <div className="topbar-links">
            <a href="/contact">Help Center</a>
            <a href="/about">About</a>
            <a href="/personal">Personal</a>
            <a href="/cooperate">Business</a>
          </div>
        </div>
      </div>
    </div>
  );
}
