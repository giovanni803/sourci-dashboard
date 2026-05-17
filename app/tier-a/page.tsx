import { getAllTierA } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TierATable } from "./tier-a-table";

export const dynamic = "force-dynamic";

export default function TierAPage() {
  const targets = getAllTierA();
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-cyan/80">Priority list</p>
        <h1 className="text-3xl font-semibold tracking-tightest text-fg-primary">Tier A targets</h1>
        <p className="text-sm text-fg-muted">Inline-editable. Status feeds the funnel context.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Target list</CardTitle>
        </CardHeader>
        <CardContent>
          <TierATable initial={targets} />
        </CardContent>
      </Card>
    </div>
  );
}
