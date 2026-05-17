import { getAllWeeklyEntries } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryTable } from "./history-table";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const entries = getAllWeeklyEntries();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-cyan/80">Archive</p>
          <h1 className="text-3xl font-semibold tracking-tightest text-fg-primary">Weekly history</h1>
          <p className="text-sm text-fg-muted">{entries.length} entries · newest first.</p>
        </div>
        <a
          href="/api/weekly/export"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-medium text-fg-primary transition-all duration-200 ease-smooth hover:bg-white/[0.06] hover:border-white/20"
        >
          Export CSV
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <HistoryTable entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
}
