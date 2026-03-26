import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingDown, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  BarChart3,
  Flame,
  Calendar,
  Mic,
  ShieldCheck,
  Trash2,
  Lock,
  AlertCircle
} from 'lucide-react';
import VoiceRecorder from '../components/VoiceRecorder';
import MoodChart from '../components/MoodChart';
import AlertModal from '../components/AlertModal';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const [lastResult, setLastResult] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emotionText, setEmotionText] = useState('');
  const [isTextProcessing, setIsTextProcessing] = useState(false);
  
  const moodHistory = [
    { name: 'Mar 20', score: 7.2 },
    { name: 'Mar 21', score: 6.8 },
    { name: 'Mar 22', score: 5.5 },
    { name: 'Mar 23', score: 4.8 },
    { name: 'Mar 24', score: 4.2 },
    { name: 'Mar 25', score: 3.8 },
    { name: 'Mar 26', score: 4.5 },
  ];

  const handleVoiceResult = (result) => {
    setLastResult(result);
    // Simulate privacy deletion logic
    setIsDeleting(true);
    setTimeout(() => setIsDeleting(false), 3000);

    // Proactive Intervention Logic: 5-day decline check
    const lastFive = moodHistory.slice(-5).map(h => h.score);
    const isDeclining = lastFive.every((val, i) => i === 0 || val <= lastFive[i-1]);
    
    if (result.moodScore < 5 || isDeclining) {
      setTimeout(() => setShowAlert(true), 1500);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!emotionText.trim()) return;

    setIsTextProcessing(true);
    
    // Simulate text analysis
    setTimeout(() => {
      setIsTextProcessing(false);
      handleVoiceResult({
        text: emotionText,
        sentiment: 0.4,
        features: {
          pitch: "N/A (Text)",
          energy: "N/A (Text)",
          rate: "N/A (Text)"
        },
        moodScore: 6.5,
        source: 'text'
      });
      setEmotionText('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-display text-foreground">Hello, Nitish</h1>
          <p className="text-muted-foreground">How are you feeling today? Let's check in.</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-600 rounded-xl font-bold text-sm">
            <Flame className="w-4 h-4" />
            5 Day Streak
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl font-bold text-sm">
            <Calendar className="w-4 h-4" />
            Mar 26, 2026
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recorder & Analysis */}
        <div className="lg:col-span-5 space-y-8">
          <VoiceRecorder onResult={handleVoiceResult} />

          {/* Text Expression Box */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">Express Your Emotion</h3>
            </div>
            <form onSubmit={handleTextSubmit} className="space-y-3">
              <textarea 
                value={emotionText}
                onChange={(e) => setEmotionText(e.target.value)}
                placeholder="Type how you're feeling right now..."
                className="w-full h-24 p-4 bg-muted border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none text-sm resize-none"
              />
              <button 
                type="submit"
                disabled={isTextProcessing || !emotionText.trim()}
                className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2"
              >
                {isTextProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Analyze Emotion <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

          <AnimatePresence mode="wait">
            {lastResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl p-6 shadow-sm border border-border space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    {lastResult.source === 'text' ? 'Text Sentiment Analysis' : 
                     lastResult.source === 'upload' ? 'Uploaded Audio Analysis' : 
                     'Real-time Voice Analysis'}
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Processed in 1.2s</span>
                </div>

                {/* Pipeline Visual */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-2xl border border-border">
                  {lastResult.source !== 'text' && (
                    <>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Mic className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">{lastResult.source === 'upload' ? 'FILE' : 'VOICE'}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
                    </>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">TEXT</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">SCORE</span>
                  </div>
                </div>

                {/* Insight Section */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {lastResult.source === 'text' ? 'Input Text' : 'Insight'}
                  </p>
                  <p className="text-sm text-foreground italic leading-relaxed bg-muted p-4 rounded-2xl border border-border">
                    "{lastResult.text}"
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pitch</p>
                    <p className="font-bold text-foreground">{lastResult.features.pitch}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Energy</p>
                    <p className="font-bold text-foreground">{lastResult.features.energy}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Rate</p>
                    <p className="font-bold text-foreground">{lastResult.features.rate}</p>
                  </div>
                </div>

                {/* Privacy Deletion Demo */}
                <div className="p-4 bg-foreground rounded-2xl border border-border overflow-hidden relative">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-background/20 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-background" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-background">Privacy Protocol</p>
                        <p className="text-[10px] text-background/60">Audio Deletion Logic Active</p>
                      </div>
                    </div>
                    {isDeleting ? (
                      <div className="flex items-center gap-2 text-destructive text-[10px] font-bold animate-pulse">
                        <Trash2 className="w-3 h-3" />
                        DELETING RAW AUDIO...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-primary text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        AUDIO PURGED
                      </div>
                    )}
                  </div>
                  {isDeleting && (
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      className="absolute bottom-0 left-0 h-1 bg-primary"
                    />
                  )}
                </div>

                {/* Sentiment & Mood Score */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <p className="text-[10px] font-bold text-primary/60 uppercase mb-1">Sentiment (VADER)</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-xl">{lastResult.sentiment > 0 ? '+' : ''}{lastResult.sentiment}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        lastResult.sentiment > 0 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {lastResult.sentiment > 0 ? 'Positive' : 'Negative'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-foreground rounded-2xl text-background">
                    <p className="text-[10px] font-bold text-background/60 uppercase mb-1">Mood Score</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold font-display">{lastResult.moodScore}</span>
                      <span className="text-background/60 text-sm mb-1">/ 10</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[200px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/50"
              >
                <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center shadow-sm">
                  <Mic className="text-muted-foreground/30 w-6 h-6" />
                </div>
                <p className="text-muted-foreground text-sm font-medium max-w-[200px] mx-auto">
                  Start recording to see real-time emotional analysis
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Trends & Architecture */}
        <div className="lg:col-span-7 space-y-8">
          {/* Trend Card */}
          <div className="bg-card rounded-3xl p-8 shadow-sm border border-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-display text-foreground">Mood Trends</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold">
                  <TrendingDown className="w-3 h-3" />
                  -12% this week
                </div>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'trends' }))}
                  className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  View Full <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="h-[300px]">
              <MoodChart data={moodHistory} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm">
                  <AlertCircle className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Trend Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">We've noticed a downward trend over the last 5 days. Consider a check-in.</p>
                </div>
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm">
                  <Zap className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Evening Insight</p>
                  <p className="text-xs text-muted-foreground mt-1">Your mood typically dips in the evenings. Try some light meditation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold font-display text-foreground mb-6">System Architecture</h3>
            <ArchitectureDiagram />
          </div>
        </div>
      </div>

      <AlertModal isOpen={showAlert} onClose={() => setShowAlert(false)} />
    </div>
  );
};

export default Dashboard;
