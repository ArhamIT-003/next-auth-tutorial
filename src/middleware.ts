import { withAuth } from "next-auth/middleware";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token?.role);

    if (
      req.nextUrl.pathname.startsWith("/createUser") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/deny", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/createUser"] };
