import { NextResponse } from "next/server";

export const config = {
  matcher: ["/home/:path*", "/auth/:path*"],
};

export function middleware(req, res) {
  const { cookies } = req;
  const jwt = cookies.get("token");
  const url = req.nextUrl.clone();

  console.log(jwt);

  if (url.pathname.includes("/home")) {
    if (jwt) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
  // if (
  //   url.pathname === "/" ||
  //   url.pathname === "/about-us" ||
  //   url.pathname === "/how-it-works" ||
  //   url.pathname === "/products" ||
  //   url.pathname === "/faq"
  // ) {
  //   if (jwt) {
  //     return NextResponse.redirect(new URL("/home", req.url));
  //   } else {
  //     return NextResponse.next();
  //   }
  // }

  if (url.pathname.includes("/auth")) {
    if (jwt) {
      return NextResponse.redirect(new URL("/home", req.url));
    } else {
      return NextResponse.next();
    }
  }
}
