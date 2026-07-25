import { NextResponse } from "next/server";

// Intentionally broken release endpoint for the hackathon demo.
// Keep this isolated so the stable application is never affected.
export async function GET() {
  return NextResponse.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message: "checkout-api v2.4.0 canary failed to process the request",
      version: "v2.4.0",
      release: "broken-demo",
    },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}
