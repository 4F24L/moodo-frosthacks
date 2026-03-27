import { Activity, Clock, FileText, Filter, Loader2, Mic } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { PageHeader } from "../components";
import { useMood } from "../hooks";
import { cn } from "../lib/utils";

const filters = [
  { label: "7 Days", value: "7d" },
  { label: "15 Days", value: "15d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

const getMoodColor = (score) => {
  if (score >= 7)
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 4) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
};

const History = () => {
  const { history, getHistory, loading } = useMood();
  const [activeFilter, setActiveFilter] = useState("7d");
  const [displayCount, setDisplayCount] = useState(15);

  // Handle case where history might be { data: [...], success: true } or directly an array
  const historyData = Array.isArray(history) ? history : history?.data || [];

  useEffect(() => {
    setDisplayCount(15);
    getHistory(activeFilter, 100); // Allow more entries for history view
  }, [activeFilter, getHistory]);

  const displayedHistory = historyData.slice(0, displayCount);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto h-full flex flex-col">
      <PageHeader
        title="Journal History"
        description="Review your past entries and track your emotional journey over time."
        icon={Clock}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/50 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Filter by Range:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-card/30 border border-border/50 rounded-3xl overflow-hidden backdrop-blur-xl relative">
        <div className="overflow-x-auto h-full">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : null}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="p-4 font-semibold text-muted-foreground text-sm pl-6 w-20">
                  Sl No
                </th>
                <th className="p-4 font-semibold text-muted-foreground text-sm">
                  Date & Time
                </th>
                <th className="p-4 font-semibold text-muted-foreground text-sm">
                  Score (0-10)
                </th>
                <th className="p-4 font-semibold text-muted-foreground text-sm">
                  Label
                </th>
                <th className="p-4 font-semibold text-muted-foreground text-sm">
                  Source
                </th>
                <th className="p-4 font-semibold text-muted-foreground text-sm max-w-xs">
                  Insight / Text
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedHistory && displayedHistory.length > 0
                ? displayedHistory.map((entry, index) => {
                    const normalizedScore =
                      entry.moodScore <= 1
                        ? entry.moodScore * 10
                        : entry.moodScore;
                    const displayScore = Number(normalizedScore).toFixed(1);

                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={entry._id || index}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="p-4 pl-6 whitespace-nowrap text-muted-foreground font-medium">
                          {index + 1}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {new Date(entry.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.createdAt).toLocaleTimeString(
                                "en-US",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-xs font-bold border",
                                getMoodColor(normalizedScore),
                              )}
                            >
                              {displayScore}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-medium">
                            {entry.moodLabel || "Analyzed"}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            {entry.source === "voice" ? (
                              <>
                                <Mic className="w-4 h-4 text-blue-400" /> Voice
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 text-emerald-400" />{" "}
                                Text
                              </>
                            )}
                          </div>
                        </td>
                        <td
                          className="p-4 text-sm text-muted-foreground max-w-md truncate"
                          title={entry.text || entry.insight}
                        >
                          {entry.text
                            ? `"${entry.text}"`
                            : entry.insight || "-"}
                        </td>
                      </motion.tr>
                    );
                  })
                : !loading && (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-12 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Activity className="w-12 h-12 text-muted-foreground/30" />
                          <p>No journal entries found for this period.</p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {!loading && historyData.length > displayCount && (
          <div className="p-4 flex items-center justify-center border-t border-border/50 bg-muted/10">
            <button
              onClick={() => setDisplayCount((prev) => prev + 15)}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-sm"
            >
              Load More ({historyData.length - displayCount} left)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
