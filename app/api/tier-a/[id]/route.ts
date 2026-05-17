import { NextResponse } from "next/server";
import { updateTierA, deleteTierA } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const updated = updateTierA(id, {
    brand_name: String(body.brand_name ?? ""),
    founder_name: String(body.founder_name ?? ""),
    instagram_handle: String(body.instagram_handle ?? ""),
    linkedin_url: String(body.linkedin_url ?? ""),
    email: String(body.email ?? ""),
    status: String(body.status ?? "cold"),
    last_contacted: String(body.last_contacted ?? ""),
    expected_deal_value_aud: Number(body.expected_deal_value_aud) || 0,
    notes: String(body.notes ?? ""),
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  deleteTierA(Number(params.id));
  return NextResponse.json({ ok: true });
}
