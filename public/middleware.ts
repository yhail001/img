import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Redirect all traffic to the maintenance page
  return NextResponse.redirect("https://yohanneshaile.com", 307);
}

// Apply middleware to all routes
export const config = {
  matcher: "/:path*", // This ensures all routes are affected
};