import { NextResponse } from "next/server";

// Prometheus scrape endpoint. Replace these demo values with live backend data.
export async function GET(request: Request) {
  const broken = new URL(request.url).searchParams.get("scenario") === "broken";
  const body = `# HELP release_error_rate_ratio Current request error ratio.
# TYPE release_error_rate_ratio gauge
release_error_rate_ratio{service="checkout-api",environment="production",version="${broken ? "v2.4.0" : "v1.8.3"}"} ${broken ? "0.074" : "0.0008"}

# HELP release_latency_p95_milliseconds 95th percentile request latency.
# TYPE release_latency_p95_milliseconds gauge
release_latency_p95_milliseconds{service="checkout-api",environment="production",version="${broken ? "v2.4.0" : "v1.8.3"}"} ${broken ? "840" : "118"}

# HELP release_traffic_share_ratio Percentage of traffic routed to a release.
# TYPE release_traffic_share_ratio gauge
release_traffic_share_ratio{service="checkout-api",environment="production",version="v1.8.3",track="stable"} ${broken ? "0.9" : "1"}
release_traffic_share_ratio{service="checkout-api",environment="production",version="v2.4.0",track="canary"} ${broken ? "0.1" : "0"}

# HELP release_guardrail_breach Whether an automated rollback threshold is breached.
# TYPE release_guardrail_breach gauge
release_guardrail_breach{service="checkout-api",environment="production",guardrail="error_rate"} ${broken ? "1" : "0"}
release_guardrail_breach{service="checkout-api",environment="production",guardrail="latency_p95"} ${broken ? "1" : "0"}
`;
  return new NextResponse(body, { headers: { "Content-Type": "text/plain; version=0.0.4; charset=utf-8", "Cache-Control": "no-store, max-age=0" } });
}
