import {
    BrainCircuit,
    Calendar,
    HeartPulse,
    Smile,
    TrendingDown,
} from "lucide-react";
import { useEffect } from "react";
import { FluctuationItem, InsightCard, MoodChart, PageHeader, StatCard } from "../components";
import { useMood } from "../hooks";

const Trends = () => {
  const { dashboard, getDashboard } = useMood();

  useEffect(() => {
    getDashboard("7d");
  }, [getDashboard]);

  const rawEntries = dashboard?.entries || [];

  // Format data for MoodChart
  const data = rawEntries
    .map((entry) => ({
      name: new Date(entry.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: entry.moodScore,
    }))
    .reverse(); // Assuming backend returns newest first, chart wants chronological

  if (data.length === 0) {
    // fallback if no data
    data.push({ name: "Start tracking!", score: 0 });
  }

  // Compute stats dynamically
  const avgMood = dashboard?.averageMood || 0;
  const scores = data.map((d) => d.score).filter((s) => s > 0);
  const peakMood = scores.length ? Math.max(...scores) : 0;
  const lowestMood = scores.length ? Math.min(...scores) : 0;

  const stats = [
    {
      label: "Weekly Average",
      value: avgMood.toFixed(1),
      icon: BrainCircuit,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Peak Mood",
      value: peakMood.toFixed(1),
      icon: Smile,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Lowest Mood",
      value: lowestMood.toFixed(1),
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Stability",
      value: dashboard?.fluctuation < 2 ? "High" : "Low",
      icon: HeartPulse,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  // For fluctuations, ideally backend returns anomaly alerts. We'll map recent alerts or generate fallback strings.
  const fluctuations = (dashboard?.alerts || []).map((alert) => ({
    day: new Date(alert.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
    }),
    change: alert.trend === "up" ? "+Anomalous" : "-Anomalous",
    trend: alert.trend || "down",
    time: new Date(alert.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // AI Insights mapping
  const insightMessages =
    dashboard?.alerts?.map((alert) => alert.message) || [];
  if (insightMessages.length === 0) {
    insightMessages.push(
      `Your mood average is ${avgMood.toFixed(1)} this week.`,
    );
    insightMessages.push("Keep tracking to unlock personalized AI insights.");
  }

  const headerActions = (
    <>
      <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors">
        <Calendar className="w-4 h-4" />
        Last 7 Days
      </button>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="Emotional Trends"
        description="Deep dive into your emotional patterns over time."
        actions={headerActions}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-card rounded-3xl p-8 shadow-sm border border-border overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold font-display text-foreground">
            Mood Progression
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                Mood Score
              </span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <MoodChart data={data} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm space-y-6">
          <h3 className="text-xl font-bold font-display text-foreground">
            AI Insights
          </h3>
          <div className="space-y-4">
            {insightMessages.slice(0, 2).map((msg, i) => (
              <InsightCard
                key={i}
                title={i === 0 ? "Weekly Summary" : "Pattern Found"}
                description={msg}
                variant={i === 0 ? "primary" : "success"}
              />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm space-y-6">
          <h3 className="text-xl font-bold font-display text-foreground">
            Recent Fluctuations
          </h3>
          <div className="space-y-4">
            {fluctuations.length > 0 ? (
              fluctuations.map((item, i) => (
                <FluctuationItem key={i} {...item} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No significant fluctuations detected recently.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
