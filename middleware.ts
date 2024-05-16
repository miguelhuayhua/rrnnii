import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    let pathname = request.nextUrl.pathname;
    let token = request.nextauth.token!;
  }
)
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
}
