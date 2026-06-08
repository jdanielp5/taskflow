import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/tasks", "/kanban", "/calendar"];

export function middleware(request: NextRequest) {
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const hasSession = request.cookies.has("taskflow-auth");

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/kanban/:path*", "/calendar/:path*"],
};
