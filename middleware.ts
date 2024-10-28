import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    let pathname = request.nextUrl.pathname;
    let token = request.nextauth.token!;
    if (pathname.includes('acciones') && token.rol != 'admin') {
      return NextResponse.redirect(new URL('/dashboard/', 'http://localhost:3000'));
    }

  }
)
export const config = {
  matcher: ["/dashboard/:path*"]
}
