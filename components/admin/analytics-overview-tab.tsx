import { AnalyticsOverview } from "./analytics-overview";

export default function AnalyticsOverviewTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Track and analyze your website's performance metrics.
      </p>
      <AnalyticsOverview />
    </div>
  );
}