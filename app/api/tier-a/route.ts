import { NextResponse } from "next/server";
import { getAllTierA, createTierA } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getAllTierA());
}

export async function POST(req: Request) {
  const body = await req.json();
  const t = createTierA({
    brand_name: String(body.brand_name ?? "New target"),
    founder_name: String(body.founder_name ?? ""),
    instagram_handle: String(body.instagram_handle ?? ""),
    linkedin_url: String(body.linkedin_url ?? ""),
    email: String(body.email ?? ""),
    status: String(body.status ?? "cold"),
    last_contacted: String(body.last_contacted ?? ""),
    expected_deal_value_aud: Number(body.expected_deal_value_aud) || 0,
    notes: String(body.notes ?? ""),
  });
  return NextResponse.json(t);
}
