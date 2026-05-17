import { getDb, getWeeklyEntryByIsoWeek } from "@/lib/db";
import { isoWeekBounds } from "@/lib/date-utils";
import { getSalesCyclePhase } from "@/lib/sales-cycle";
import { SubmitForm } from "./submit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SubmitPage() {
  getDb(); // ensure DB schema is ready
  const bounds = isoWeekBounds(new Date());
  const existing = getWeeklyEntryByIsoWeek(bounds.isoYear, bounds.isoWeek);
  const phase = getSalesCyclePhase();

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-cyan/80">
          {bounds.label}{existing ? " · editing" : " · new entry"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tightest text-fg-primary">Submit weekly entry</h1>
        <p className="text-sm text-fg-muted">{bounds.rangeLabel}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>This week's numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmitForm bounds={bounds} initial={existing} phase={phase} />
        </CardContent>
      </Card>
    </div>
  );
}
