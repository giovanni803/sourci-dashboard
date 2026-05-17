import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/login", url.origin));
  res.cookies.delete("sourci_auth");
  return res;
}
