"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="preview-page broken-preview"><div className="preview-nav"><Link href="/" className="brand"><span className="brand-mark">↗</span><span>relay<span className="dot">.</span></span></Link><span className="preview-label">CHECKOUT-API / V2.4.0 CANARY</span></div><section className="error-state"><span className="error-code">500</span><div className="error-rule" /><p className="kicker">INTERNAL SERVER ERROR</p><h1>This release is having<br />a difficult moment.</h1><p className="error-copy">The checkout service is temporarily unavailable. Relay has detected the failed canary and is preparing to restore the last healthy version.</p><div className="progress-track"><span /></div><div className="error-meta"><span><i className="error-dot" /> v2.4.0 canary unavailable</span><span>rollback recommended</span></div><div className="error-actions"><button className="back-console" onClick={() => reset()}>Try again <span>↻</span></button><Link href="/api/metrics?scenario=broken" className="back-console">View failure metrics <span>→</span></Link></div></section></main>;
}
