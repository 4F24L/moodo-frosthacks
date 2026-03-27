import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Brain,
  Frown,
  Globe,
  Heart,
  Lightbulb,
  Meh,
  MessageSquare,
  Phone,
  Shield,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const getMoodIcon = (score) => {
  if (score >= 7) return <Smile className="w-full h-full" />;
  if (score >= 4) return <Meh className="w-full h-full" />;
  return <Frown className="w-full h-full" />;
};

const getMoodColor = (score) => {
  if (score >= 7)
    return "from-green-500/20 to-emerald-500/10 border-green-500/30";
  if (score >= 4)
    return "from-amber-500/20 to-yellow-500/10 border-amber-500/30";
  return "from-red-500/20 to-rose-500/10 border-red-500/30";
};

const getMoodTextColor = (score) => {
  if (score >= 7) return "text-green-500";
  if (score >= 4) return "text-amber-500";
  return "text-red-500";
};

const getSuggestions = (score) => {
  if (score >= 7) {
    return [
      {
        icon: Target,
        text: "Keep momentum with gratitude journaling",
        color: "text-green-500",
      },
      {
        icon: Heart,
        text: "Share your positive energy",
        color: "text-pink-500",
      },
      {
        icon: Sparkles,
        text: "Document what's working",
        color: "text-purple-500",
      },
    ];
  } else if (score >= 4) {
    return [
      { icon: Brain, text: "Try 10-min mindfulness", color: "text-blue-500" },
      { icon: Activity, text: "Go for a short walk", color: "text-green-500" },
      { icon: Heart, text: "Connect with a friend", color: "text-pink-500" },
    ];
  } else {
    return [
      { icon: Phone, text: "Reach out to someone", color: "text-blue-500" },
      {
        icon: Brain,
        text: "Practice deep breathing",
        color: "text-purple-500",
      },
      { icon: Heart, text: "Be gentle with yourself", color: "text-pink-500" },
    ];
  }
};

const getResources = (score) => {
  if (score < 4) {
    return [
      { name: "Crisis Lifeline", contact: "988", icon: Phone },
      { name: "Crisis Text", contact: "741741", icon: MessageSquare },
      {
        name: "Find Therapist",
        url: "https://www.psychologytoday.com",
        icon: Globe,
      },
    ];
  } else if (score < 7) {
    return [
      {
        name: "Find Therapist",
        url: "https://www.psychologytoday.com",
        icon: Globe,
      },
      { name: "BetterHelp", url: "https://www.betterhelp.com", icon: Heart },
      { name: "Headspace", url: "https://www.headspace.com", icon: Brain },
    ];
  } else {
    return [
      { name: "Headspace", url: "https://www.headspace.com", icon: Brain },
      { name: "Calm", url: "https://www.calm.com", icon: Sparkles },
      { name: "MoodGYM", url: "https://moodgym.com.au", icon: Activity },
    ];
  }
};

const EnhancedAnalysisResult = ({ result }) => {
  // Map API response to component props
  const moodScore = result.moodScore ?? result.mood_score ?? 5;
  const moodLabel = result.moodLabel || result.mood_label || "Neutral";
  const normalizedScore =
    result.normalizedScore || result.normalized_score || 0;
  const sentimentData = result.sentiment || {};
  const compound = sentimentData.compound || normalizedScore || 0;
  const confidence = result.confidence || 0.8;
  const insight = result.insight || "";
  const text = result.text || "";
  const source = result.source || "voice";
  const trend = result.trend || "";
  const fluctuation = result.fluctuation || "";
  const alert = result.alert || null;
  const metrics = result.features;

  const hasVoiceFeatures =
    result.features &&
    source !== "text" &&
    (typeof result.features.energy === "number" ||
      typeof result.features.tempo === "number" ||
      typeof result.features.pitch === "number" ||
      typeof result.features.jitter === "number");

  // Convert mood_score (0-1) to display score (0-10)
  const displayScore = moodScore > 1 ? moodScore : (moodScore * 10).toFixed(1);

  const suggestions = getSuggestions(displayScore);
  const resources = getResources(displayScore);

  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] bg-linear-to-br from-background via-background to-primary/5 p-2 md:p-4 overflow-y-auto">
      <div className="max-w-full mx-auto space-y-3">
        {/* Important Display Messages (Alert priority) */}
        {alert && alert.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full rounded-[1.5rem] p-4 border-2 border-destructive/30 bg-destructive/10 shadow-sm flex items-center gap-4 hover:border-destructive/50 transition-all mb-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-destructive mb-0.5">
                Notice
              </h4>
              <p className="text-sm text-destructive/90 font-medium">
                {alert.message}
              </p>
            </div>
          </motion.div>
        )}

        {/* Desktop: Modern Asymmetric Bento Grid */}
        <div className="hidden lg:grid lg:grid-cols-12 auto-rows-[minmax(160px,auto)] gap-3">
          {/* Large Hero - Mood Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className={cn(
              "col-span-3 row-span-2 rounded-[1.5rem] p-4 border-2 bg-linear-to-br relative overflow-hidden group flex flex-col items-center justify-center",
              getMoodColor(displayScore),
            )}
          >
            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Your Mood
                </div>
                <div className="px-1.5 py-0.5 rounded-full bg-background/50 border border-border/50 text-[9px] font-medium uppercase tracking-wider flex items-center gap-1">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      source === "text" ? "bg-blue-500" : "bg-purple-500",
                    )}
                  />
                  {source === "text" ? "Text Analysis" : "Voice Analysis"}
                </div>
              </div>
              <h2
                className={cn(
                  "text-2xl lg:text-3xl font-bold font-display mb-1",
                  getMoodTextColor(displayScore),
                )}
              >
                {moodLabel}
              </h2>
              <div
                className={cn(
                  "text-5xl lg:text-6xl font-bold font-display leading-none mb-1",
                  getMoodTextColor(displayScore),
                )}
              >
                {displayScore}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                out of 10
              </div>
            </div>
            <div
              className={cn(
                "absolute -bottom-2 -right-2 w-24 h-24 opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500",
                getMoodTextColor(displayScore),
              )}
            >
              {getMoodIcon(displayScore)}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 blur-[60px] rounded-full" />
          </motion.div>

          {/* Custom data features in the 'What you said' box on Desktop view */}
          {text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-4 rounded-[1.5rem] p-4 border border-border bg-linear-to-br from-primary/5 via-card to-card hover:border-primary/30 transition-all flex flex-col shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-sm">What You Said</h3>
              </div>
              <p className="text-foreground/90 leading-relaxed text-sm flex-1 overflow-y-auto styled-scrollbar pr-2">
                "{text}"
              </p>
            </motion.div>
          )}

          {/* AI Insight */}
          {insight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="col-span-3 rounded-[1.5rem] p-4 border border-border bg-linear-to-br from-purple-500/10 via-card to-card hover:border-purple-500/30 transition-all flex flex-col shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-2xl -z-10 group-hover:bg-purple-500/20 transition-colors" />
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                  <Brain className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="font-bold text-sm">AI Insight</h3>
              </div>
              <p className="text-foreground/90 leading-relaxed text-sm flex-1 overflow-y-auto styled-scrollbar pr-2">
                {insight}
              </p>
            </motion.div>
          )}

          {/* Data / Metrics Div */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 rounded-[1.5rem] p-4 border border-border bg-card shadow-sm hover:border-blue-500/30 transition-all flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex items-center gap-1.5 mb-3">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-bold text-sm">Metrics</h3>
            </div>

            <div className="flex-1 flex flex-col justify-around gap-2">
              {hasVoiceFeatures && (
                <div className="grid grid-cols-2 gap-1.5 mb-1">
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Energy
                    </span>
                    <span className="font-bold text-xs bg-muted/50 rounded-md px-1 py-0.5">
                      {typeof result.features.energy === "number"
                        ? result.features.energy.toFixed(3)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Tempo
                    </span>
                    <span className="font-bold text-xs bg-muted/50 rounded-md px-1 py-0.5">
                      {typeof result.features.tempo === "number"
                        ? Math.round(result.features.tempo)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Pitch
                    </span>
                    <span className="font-bold text-xs bg-muted/50 rounded-md px-1 py-0.5">
                      {typeof result.features.pitch === "number"
                        ? result.features.pitch.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      Jitter
                    </span>
                    <span className="font-bold text-xs bg-muted/50 rounded-md px-1 py-0.5">
                      {typeof result.features.jitter === "number"
                        ? result.features.jitter.toFixed(2)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}

              {trend && (
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <div
                    className={cn(
                      "font-bold text-[10px] capitalize px-2 py-0.5 rounded-md inline-flex items-center justify-center flex-1",
                      trend === "improving" || trend === "upward"
                        ? "bg-green-500/10 text-green-500"
                        : trend === "declining" || trend === "downward"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-amber-500/10 text-amber-500",
                    )}
                  >
                    {trend} Trend
                  </div>
                </div>
              )}

              {fluctuation && (
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="w-3 h-3" />
                  </div>
                  <div
                    className={cn(
                      "font-bold text-[10px] capitalize px-2 py-0.5 rounded-md inline-flex items-center justify-center flex-1",
                      fluctuation === "stable" || fluctuation === "low"
                        ? "bg-green-500/10 text-green-500"
                        : fluctuation === "volatile" || fluctuation === "high"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-amber-500/10 text-amber-500",
                    )}
                  >
                    {fluctuation} Stability
                  </div>
                </div>
              )}

              {confidence > 0 && (
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Target className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-xs text-foreground text-center bg-muted/50 rounded-md py-0.5 w-full">
                    {(confidence * 100).toFixed(0)}% Conf
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-5 rounded-[1.5rem] p-5 border border-border bg-card shadow-sm hover:border-primary/30 transition-all flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-yellow-500/10 rounded-xl">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-base">Recommended Actions</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex flex-col items-center justify-center text-center p-3 bg-muted/30 rounded-xl hover:bg-muted hover:scale-105 transition-all cursor-pointer border border-border/50 hover:border-border"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-transform hover:scale-110",
                      suggestion.color,
                      "bg-current/10",
                    )}
                  >
                    <suggestion.icon className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-medium text-foreground/80 leading-snug">
                    {suggestion.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-4 rounded-[1.5rem] p-5 border border-border bg-card shadow-sm hover:border-primary/30 transition-all flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-500/10 rounded-xl">
                <Globe className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="font-bold text-base">Helpful Resources</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
              {resources.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="h-full"
                >
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center text-center p-2 bg-muted/30 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all group h-full border border-border/50 hover:border-primary/20"
                    >
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center mb-1.5 shadow-sm group-hover:shadow-md transition-shadow">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[11px] font-medium leading-tight mb-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2 bg-muted/30 rounded-xl h-full border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center mb-1.5 shadow-sm">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[11px] font-medium leading-tight mb-1">
                        {item.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-lg">
                        {item.contact}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile: Elegant Stacked View */}
        <div className="lg:hidden space-y-4 pb-8">
          {/* Important Display Messages (Alert priority) on Mobile */}
          {alert && alert.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full rounded-[1.5rem] p-4 border-2 border-destructive/30 bg-destructive/10 shadow-sm flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-destructive mb-0.5">
                  Notice
                </h4>
                <p className="text-sm text-destructive/90 font-medium">
                  {alert.message}
                </p>
              </div>
            </motion.div>
          )}

          {/* Hero Mood Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "rounded-[2rem] p-6 border-2 bg-linear-to-br relative overflow-hidden shadow-lg",
              getMoodColor(displayScore),
            )}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Your Mood
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-background/50 border border-border/50 text-[9px] font-medium uppercase tracking-wider flex items-center gap-1">
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full",
                        source === "text" ? "bg-blue-500" : "bg-purple-500",
                      )}
                    />
                    {source === "text" ? "Text" : "Voice"}
                  </div>
                </div>
                <h2
                  className={cn(
                    "text-3xl font-bold font-display mb-1",
                    getMoodTextColor(displayScore),
                  )}
                >
                  {moodLabel}
                </h2>
                <div
                  className={cn(
                    "text-5xl font-bold font-display flex items-baseline gap-1",
                    getMoodTextColor(displayScore),
                  )}
                >
                  {displayScore}
                  <span className="text-2xl opacity-60">/10</span>
                </div>
              </div>
              <div
                className={cn(
                  "w-20 h-20 opacity-30 transform rotate-6",
                  getMoodTextColor(displayScore),
                )}
              >
                {getMoodIcon(displayScore)}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 blur-2xl rounded-full" />
          </motion.div>

          {/* AI Insight */}
          {insight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full rounded-[1.5rem] p-5 border border-border bg-linear-to-br from-purple-500/10 to-card shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                  <Brain className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="font-bold text-sm">AI Insight</h3>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed italic border-l-2 border-purple-500/30 pl-3">
                {insight}
              </p>
            </motion.div>
          )}

          {/* Your Words */}
          {text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full rounded-[1.5rem] p-5 border border-border bg-linear-to-br from-primary/5 to-card shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-sm">What You Said</h3>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed italic border-l-2 border-primary/30 pl-3">
                "{text}"
              </p>
              {hasVoiceFeatures && (
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Energy
                    </span>
                    <span className="text-xs font-medium bg-muted/50 rounded inline-block px-1 mt-0.5">
                      {typeof result.features.energy === "number"
                        ? result.features.energy.toFixed(3)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Tempo
                    </span>
                    <span className="text-xs font-medium bg-muted/50 rounded inline-block px-1 mt-0.5">
                      {typeof result.features.tempo === "number"
                        ? Math.round(result.features.tempo)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Pitch
                    </span>
                    <span className="text-xs font-medium bg-muted/50 rounded inline-block px-1 mt-0.5">
                      {typeof result.features.pitch === "number"
                        ? result.features.pitch.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Jitter
                    </span>
                    <span className="text-xs font-medium bg-muted/50 rounded inline-block px-1 mt-0.5">
                      {typeof result.features.jitter === "number"
                        ? result.features.jitter.toFixed(2)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Suggestions - Horizontal Scroll or List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-[1.5rem] p-5 border border-border bg-card shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-sm">Recommended Actions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/50"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                      suggestion.color,
                      "bg-current/10",
                    )}
                  >
                    <suggestion.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground/90 leading-tight">
                    {suggestion.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[1.5rem] p-5 border border-border bg-card shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-green-500/10 rounded-lg">
                <Globe className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="font-bold text-sm">Helpful Resources</h3>
            </div>
            <div className="space-y-3">
              {resources.map((item, index) => (
                <div key={index}>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/50 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0 shadow-sm">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium flex-1">
                        {item.name}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/50">
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0 shadow-sm">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium flex-1">
                        {item.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                        {item.contact}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile Alert */}
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-[1.5rem] p-4 border-2 border-destructive/30 bg-destructive/10 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-destructive/90">
                  {alert.message}
                </p>
              </div>
            </motion.div>
          )}

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 pt-4 pb-2"
          >
            <Shield className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">
              Audio deleted instantly • Only insights stored
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalysisResult;
