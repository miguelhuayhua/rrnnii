import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
import { domain } from "./utils/globals";
export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    let pathname = request.nextUrl.pathname;
    let token = request.nextauth.token!;
    if (pathname.includes('acciones') && token.rol != 'admin') {
      return NextResponse.redirect(new URL('/dashboard/', domain));
    }

  }
)
export const config = {
  matcher: ["/dashboard/:path*"]
}
