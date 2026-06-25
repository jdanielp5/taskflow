import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/tasks", "/kanban", "/calendar"];

export function proxy(request: NextRequest) {
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  const hasSessionHint = request.cookies.has("taskflow-auth");

  if (isProtectedRoute && !hasSessionHint) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/kanban/:path*", "/calendar/:path*"],
};
