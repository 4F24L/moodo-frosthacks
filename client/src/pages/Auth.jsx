import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff, X, TrendingUp, 
  Activity, FileText, Brain, BarChart3, LineChart, Zap, Bell, UserCheck, 
  LayoutDashboard, History, Shield, Cpu, WifiOff, HeartPulse, CheckCircle2,
  Sparkles, Search, MessageSquare, Star
} from 'lucide-react';
import { cn } from '../lib/utils';

const FeatureCard = ({ title, desc, icon: Icon }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="p-4 rounded-2xl bg-muted border border-border hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-default"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-foreground text-sm">{title}</h4>
        <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  </motion.div>
);

const Auth = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Temporary credentials check
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@sentivoice.com' && password === 'password123') {
        onLogin();
      } else {
        setError('Invalid email or password. Hint: admin@sentivoice.com / password123');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="w-full px-6 lg:px-12 py-6 flex justify-between items-center bg-transparent relative z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Mic className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-foreground">MOODO</span>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsLogin(true);
            setShowAuthModal(true);
          }}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all text-sm shadow-lg shadow-primary/10"
        >
          Login
        </motion.button>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 py-12 lg:py-0">
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 space-y-8 text-left"
        >
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold font-display leading-[1.1] text-foreground"
            >
              Your Emotions, <br />
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="text-primary inline-block"
              >
                Visualized.
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-lg"
            >
              Experience the future of mental wellbeing monitoring. Simple, secure, and powered by advanced vocal AI.
            </motion.p>
          </div>
          
          <div className="pt-4 lg:mb-12">
            <motion.button 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/10 hover:bg-primary/90 transition-all flex items-center gap-3 text-lg group"
            >
              Get Started
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side: Hero Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="lg:w-1/2 flex justify-center lg:justify-end relative mt-12 lg:mt-0"
        >
          <div className="relative w-full max-w-[500px] flex items-center justify-center">
            {/* Background Glow - Subtle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10" />
            
            {/* Hero Illustration */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-20"
            >
              <img 
                src="https://img.freepik.com/premium-vector/mental-health-tracker-character-using-electronic-gadget-monitor-control-stress-level-mood_277904-34047.jpg" 
                alt="Mental health monitoring illustration"
                className="w-auto h-full max-h-[300px] drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Floating Elements - Repositioned for Illustration Layout */}
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-card rounded-2xl shadow-2xl flex items-center justify-center z-30 border border-border"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Mic className="text-primary-foreground w-5 h-5" />
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ 
                y: [0, 15, 0],
                x: [0, -10, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -bottom-8 -left-8 bg-card/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border border-border flex items-center gap-4 z-30"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Mood Score</p>
                <p className="text-base font-bold text-foreground">+12% Improvement</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Partner Logos */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 py-12 bg-card overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-center text-muted-foreground text-sm font-bold uppercase tracking-widest mb-10">Trusted by leading mental health organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['HealthLine', 'Mindful', 'Wellness', 'Psychology', 'NeuroTech'].map((logo, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.1, opacity: 1, y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-2xl font-bold font-display text-muted-foreground tracking-tighter cursor-default"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 py-16 bg-background border-y border-border"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Voice Notes Analyzed", value: "2M+" },
              { label: "Mood Accuracy", value: "98.5%" },
              { label: "Privacy Rating", value: "A+" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2 cursor-default"
              >
                <p className="text-4xl font-bold text-primary font-display">{s.value}</p>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why MOODO? Section */}
      <section className="relative z-10 py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                <Sparkles className="w-4 h-4" /> Why Choose MOODO?
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold font-display leading-tight text-foreground">
                The smarter way to <br /> 
                <span className="text-primary">understand yourself.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Traditional journaling is hard. MOODO makes it effortless by using the most expressive tool you have—your voice. Our AI doesn't just listen; it understands the subtle nuances of your emotional state.
              </p>
              
              <div className="space-y-6">
                {[
                  { 
                    title: "Effortless Journaling", 
                    desc: "Speak for 30 seconds and get deeper insights than an hour of writing.",
                    icon: Mic 
                  },
                  { 
                    title: "Scientific Accuracy", 
                    desc: "Powered by state-of-the-art vocal biomarkers and sentiment analysis.",
                    icon: Brain 
                  },
                  { 
                    title: "Total Privacy", 
                    desc: "Your recordings are encrypted and never shared with third parties.",
                    icon: ShieldCheck 
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 10 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex gap-4 group cursor-default"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] bg-muted overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800" 
                  alt="Person using the app" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-xl text-card-foreground"
                >
                  <p className="text-lg font-medium italic">"MOODO helped me identify that my stress peaks every Tuesday morning. Now I've adjusted my schedule and feel much better."</p>
                  <p className="mt-4 font-bold text-primary">— Alex Chen, Beta User</p>
                </motion.div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary rounded-3xl -z-10 rotate-12" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-400 rounded-full -z-10 blur-2xl opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-4xl font-bold text-foreground font-display">How MOODO Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to better emotional awareness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: "01", 
                title: "Speak Naturally", 
                desc: "Record a short voice note about your day. No scripts, just you.",
                icon: Mic,
                color: "bg-primary/10 text-primary"
              },
              { 
                step: "02", 
                title: "AI Analysis", 
                desc: "Our advanced vocal AI extracts emotional features and sentiment in real-time.",
                icon: Brain,
                color: "bg-emerald-50 text-emerald-600"
              },
              { 
                step: "03", 
                title: "Get Insights", 
                desc: "View your mood score, trends, and personalized suggestions immediately.",
                icon: TrendingUp,
                color: "bg-amber-50 text-amber-600"
              }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="space-y-6 text-center">
                  <div className={cn("w-20 h-20 mx-auto rounded-3xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-lg shadow-transparent group-hover:shadow-current/10", s.color)}>
                    <s.icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-bold tracking-widest uppercase opacity-30">{s.step}</span>
                    <h3 className="text-2xl font-bold text-foreground">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+60px)] w-[calc(100%-120px)] h-[2px] bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-4xl font-bold text-foreground font-display">Powerful Features for Your Wellbeing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover how MOODO combines advanced AI with intuitive design to help you understand your emotional health like never before.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Voice & Processing */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold text-primary flex items-center gap-2 px-4">
                <Mic className="w-5 h-5" /> Voice & Processing
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Real-Time Voice Feedback", desc: "Instant analysis as you speak.", icon: Activity },
                  { title: "AI Voice Feature Extraction", desc: "Advanced acoustic pattern recognition.", icon: Brain },
                  { title: "Voice-to-Text Conversion", desc: "Seamless transcription for context.", icon: FileText },
                  { title: "Live Sound Intensity Visualization", desc: "Dynamic audio wave monitoring.", icon: Zap },
                  { title: "Lightweight & Real-Time Processing", desc: "Fast, efficient emotional detection.", icon: Cpu },
                  { title: "Offline-Capable Analysis", desc: "Works even without internet.", icon: WifiOff },
                ].map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <FeatureCard {...f} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Analytics & Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold text-primary flex items-center gap-2 px-4">
                <BarChart3 className="w-5 h-5" /> Analytics & Insights
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Sentiment Analysis Engine", desc: "Deep linguistic emotional detection.", icon: MessageSquare },
                  { title: "Mood Score Generation", desc: "Daily emotional health metrics.", icon: Sparkles },
                  { title: "Time-Series Mood Tracking", desc: "Visualize changes over time.", icon: LineChart },
                  { title: "Emotional Trend Detection", desc: "Identify recurring patterns.", icon: Search },
                  { title: "Smart Insights & Patterns", desc: "AI-driven emotional discovery.", icon: Brain },
                  { title: "Personalized Mood Baseline", desc: "Adapted to your unique voice.", icon: UserCheck },
                  { title: "Emotion History Timeline", desc: "Complete log of your journey.", icon: History },
                ].map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <FeatureCard {...f} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Platform & Care */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold text-primary flex items-center gap-2 px-4">
                <Shield className="w-5 h-5" /> Platform & Care
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Proactive Alert System", desc: "Early warnings for emotional shifts.", icon: Bell },
                  { title: "Interactive Dashboard", desc: "All your insights in one place.", icon: LayoutDashboard },
                  { title: "Secure User Authentication", desc: "Enterprise-grade protection.", icon: Lock },
                  { title: "Privacy-First Architecture", desc: "Your data stays yours, always.", icon: ShieldCheck },
                  { title: "Actionable Mental Wellness Suggestions", desc: "Personalized tips for improvement.", icon: HeartPulse },
                  { title: "Non-Clinical, Safe Experience", desc: "Designed for everyday support.", icon: CheckCircle2 },
                ].map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <FeatureCard {...f} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="relative z-10 py-24 bg-card border-y border-border overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                <ShieldCheck className="w-4 h-4" /> Privacy First
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold font-display leading-tight text-foreground">Your Data is Yours. <br /> Period.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe emotional data is the most sensitive information you have. That's why MOODO is built with a privacy-first architecture, ensuring your recordings and insights are encrypted and only accessible by you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "End-to-End Encryption", desc: "Military-grade data protection.", icon: Lock },
                  { title: "No Third-Party Sharing", desc: "We never sell your data.", icon: X },
                  { title: "Anonymized Processing", desc: "Privacy at the core of AI.", icon: UserCheck },
                  { title: "GDPR & HIPAA Compliant", desc: "Meeting the highest standards.", icon: Shield },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-colors cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary to-primary/50 p-1">
                <div className="w-full h-full rounded-[2.8rem] bg-card flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent)]" />
                  <div className="text-center space-y-6 relative z-10">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center"
                    >
                      <ShieldCheck className="w-12 h-12 text-primary" />
                    </motion.div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold font-display text-foreground">100% Secure</p>
                      <p className="text-muted-foreground">Verified Privacy Standards</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-24 bg-primary overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-background rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-background rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-primary-foreground font-display">Stay Informed</h2>
            <p className="text-primary-foreground/80 text-lg">Get the latest insights on emotional health and AI directly in your inbox.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-2xl bg-background/10 border border-background/20 text-background placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-background/50 transition-all"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-background text-primary font-bold rounded-2xl hover:bg-background/90 transition-all"
            >
              Subscribe
            </motion.button>
          </form>
          <p className="text-primary-foreground/60 text-xs">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground font-display">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about MOODO.</p>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: "How accurate is the voice analysis?", a: "Our AI is trained on over 2 million voice samples and achieves a 98.5% accuracy rate in detecting primary emotional states." },
              { q: "Is my voice data stored securely?", a: "Yes. All recordings are encrypted end-to-end and we use anonymized processing to ensure your identity is never linked to your emotional data." },
              { q: "Can I use MOODO offline?", a: "MOODO features lightweight on-device processing that allows for basic mood detection even without an active internet connection." },
              { q: "Is this a clinical tool?", a: "No. MOODO is a non-clinical wellness tool designed for self-monitoring and emotional awareness. It is not a replacement for professional medical advice." }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.01 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all cursor-default group"
              >
                <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{faq.q}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 bg-card">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center space-y-10"
        >
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold font-display text-foreground">Start Your Journey Today</h2>
            <p className="text-muted-foreground text-lg lg:text-xl">
              Take the first step towards better emotional health. Join MOODO and start tracking your wellbeing with the power of voice.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all text-xl"
            >
              Get Started for Free
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-10 py-5 bg-card text-foreground font-bold rounded-2xl border border-border hover:bg-muted transition-all text-xl"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-foreground">MOODO</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <motion.button whileHover={{ scale: 1.1, color: "var(--primary)" }} className="transition-colors">Privacy Policy</motion.button>
            <motion.button whileHover={{ scale: 1.1, color: "var(--primary)" }} className="transition-colors">Terms of Service</motion.button>
            <motion.button whileHover={{ scale: 1.1, color: "var(--primary)" }} className="transition-colors">Contact Support</motion.button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2026 MOODO AI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      {/* Auth Modal (The "Popup Window") */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-card rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute right-6 top-6 p-2 hover:bg-muted rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="p-8 lg:p-10">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mic className="text-primary-foreground w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {isLogin 
                      ? 'Enter your credentials to access your dashboard' 
                      : 'Join MOODO to start monitoring your emotional trends'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-bold"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none text-sm text-foreground"
                        />
                      </div>
                    </motion.div>
                  )}

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@sentivoice.com"
                        className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none text-sm text-foreground"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Password</label>
                      {isLogin && (
                        <button type="button" className="text-[10px] font-bold text-primary hover:text-primary/80">
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password123"
                        className="w-full pl-12 pr-12 py-3 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none text-sm text-foreground"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group text-sm mt-4"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="pt-8 text-center">
                  <p className="text-muted-foreground text-xs">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-bold text-primary hover:text-primary/80"
                    >
                      {isLogin ? 'Sign up for free' : 'Sign in here'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
