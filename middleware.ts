import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login")) return;

  const id = request.nextUrl.searchParams.get("id");
  const loginUrl = id ? `/login?id=${id}` : "/login";

  if (!request.cookies.get("Authorization")?.value) {
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};
