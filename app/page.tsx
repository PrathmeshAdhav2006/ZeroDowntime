export const dynamic = "force-dynamic";

export default function BrokenReleaseHome() {
  // Intentionally fail the broken release. This produces a real HTTP 500
  // response from the home route in the production server.
  throw new Error("checkout-api v2.4.0 failed: internal server error");
}
