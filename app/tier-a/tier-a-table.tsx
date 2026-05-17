"use client";
import { useState } from "react";
import type { TierATarget } from "@/lib/tier-a-shared";
import { TIER_A_STATUSES } from "@/lib/tier-a-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Trash2, Plus, Save } from "lucide-react";

type Row = TierATarget & { _dirty?: boolean };

export function TierATable({ initial }: { initial: TierATarget[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [busy, setBusy] = useState<number | "new" | null>(null);

  function patch(id: number, key: keyof TierATarget, value: string | number) {
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, [key]: value, _dirty: true } : r))
    );
  }

  async function save(row: Row) {
    setBusy(row.id);
    const res = await fetch(`/api/tier-a/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    setBusy(null);
    if (res.ok) {
      const updated = await res.json();
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...updated, _dirty: false } : r)));
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this target?")) return;
    setBusy(id);
    const res = await fetch(`/api/tier-a/${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) setRows((rs) => rs.filter((r) => r.id !== id));
  }

  async function addNew() {
    setBusy("new");
    const res = await fetch("/api/tier-a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand_name: `Brand ${rows.length + 1}` }),
    });
    setBusy(null);
    if (res.ok) {
      const created = await res.json();
      setRows((rs) => [...rs, created]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[10.5px] uppercase tracking-[0.12em] text-fg-muted">
              <th className="py-2.5 pr-2 font-semibold">Brand</th>
              <th className="py-2.5 pr-2 font-semibold">Founder</th>
              <th className="py-2.5 pr-2 font-semibold">IG</th>
              <th className="py-2.5 pr-2 font-semibold">LinkedIn</th>
              <th className="py-2.5 pr-2 font-semibold">Email</th>
              <th className="py-2.5 pr-2 font-semibold">Status</th>
              <th className="py-2.5 pr-2 font-semibold">Last contact</th>
              <th className="py-2.5 pr-2 text-right font-semibold">Deal value</th>
              <th className="py-2.5 pr-2 font-semibold">Notes</th>
              <th className="py-2.5 pr-2 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/[0.04] align-top transition-colors duration-150 hover:bg-white/[0.02]">
                <td className="py-2 pr-2">
                  <Input value={r.brand_name} onChange={(e) => patch(r.id, "brand_name", e.target.value)} className="h-9 min-w-[140px]" />
                </td>
                <td className="py-2 pr-2">
                  <Input value={r.founder_name} onChange={(e) => patch(r.id, "founder_name", e.target.value)} className="h-9 min-w-[120px]" />
                </td>
                <td className="py-2 pr-2">
                  <Input value={r.instagram_handle} onChange={(e) => patch(r.id, "instagram_handle", e.target.value)} placeholder="@handle" className="h-9 min-w-[100px]" />
                </td>
                <td className="py-2 pr-2">
                  <Input value={r.linkedin_url} onChange={(e) => patch(r.id, "linkedin_url", e.target.value)} placeholder="linkedin.com/in/…" className="h-9 min-w-[160px]" />
                </td>
                <td className="py-2 pr-2">
                  <Input value={r.email} onChange={(e) => patch(r.id, "email", e.target.value)} type="email" className="h-9 min-w-[160px]" />
                </td>
                <td className="py-2 pr-2">
                  <Select value={r.status} onChange={(e) => patch(r.id, "status", e.target.value)} className="h-9 min-w-[140px]">
                    {TIER_A_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="py-2 pr-2">
                  <Input
                    type="date"
                    value={r.last_contacted || ""}
                    onChange={(e) => patch(r.id, "last_contacted", e.target.value)}
                    className="h-9 min-w-[130px]"
                  />
                </td>
                <td className="py-2 pr-2 text-right">
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={r.expected_deal_value_aud}
                    onChange={(e) => patch(r.id, "expected_deal_value_aud", Number(e.target.value) || 0)}
                    className="h-9 min-w-[110px] text-right"
                  />
                </td>
                <td className="py-2 pr-2">
                  <Input value={r.notes} onChange={(e) => patch(r.id, "notes", e.target.value)} className="h-9 min-w-[160px]" />
                </td>
                <td className="py-2 pr-2 text-right whitespace-nowrap">
                  <Button
                    size="sm"
                    variant={r._dirty ? "default" : "outline"}
                    onClick={() => save(r)}
                    disabled={busy === r.id || !r._dirty}
                    className="mr-1"
                  >
                    <Save className="mr-1 h-3.5 w-3.5" /> Save
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)} disabled={busy === r.id} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-sm text-fg-muted">
                  No targets yet — add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <Button variant="outline" onClick={addNew} disabled={busy === "new"}>
          <Plus className="mr-1 h-4 w-4" /> Add target
        </Button>
      </div>
    </div>
  );
}
