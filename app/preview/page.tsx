import Link from "next/link";

function Icon({ name }: { name: string }) {
  const paths = { arrow: "M5 12h14m-6-6 6 6-6 6", shield: "M12 3 5 6v5c0 4.4 3 8 7 10 4-2 7-5.6 7-10V6l-7-3Z" };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name as keyof typeof paths] || paths.arrow} /></svg>;
}

export default function Preview({ searchParams }: { searchParams: { scenario?: string } }) {
  const broken = searchParams.scenario === "broken";
  if (broken) return <main className="preview-page broken-preview"><div className="preview-nav"><Link href="/" className="brand"><span className="brand-mark"><Icon name="shield" /></span><span>relay<span className="dot">.</span></span></Link><span className="preview-label">CHECKOUT-API / CANARY</span></div><section className="error-state"><span className="error-code">500</span><div className="error-rule" /><p className="kicker">INTERNAL SERVER ERROR</p><h1>This release is having<br />a difficult moment.</h1><p className="error-copy">The checkout service is temporarily unavailable while we restore a stable version. No action is needed — automatic recovery is in progress.</p><div className="progress-track"><span /></div><div className="error-meta"><span><i className="error-dot" /> v2.4.0 canary unavailable</span><span>rollback in progress</span></div><Link href="/" className="back-console">Return to release console <Icon name="arrow" /></Link></section></main>;
  return <main className="preview-page healthy-preview"><div className="preview-nav"><Link href="/" className="brand"><span className="brand-mark"><Icon name="shield" /></span><span>relay<span className="dot">.</span></span></Link><span className="preview-label healthy-label">CHECKOUT-API / STABLE</span></div><section className="healthy-state"><span className="healthy-check">✓</span><p className="kicker">CHECKOUT-API · V1.8.3</p><h1>Ready for checkout.</h1><p>Stable production traffic is healthy and accepting requests.</p><Link href="/preview?scenario=broken" className="back-console">Preview broken release <Icon name="arrow" /></Link></section></main>;
}
