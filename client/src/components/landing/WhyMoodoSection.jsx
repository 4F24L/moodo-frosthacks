import { Brain, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const WhyMoodoSection = () => {
  const features = [
    {
      title: "Effortless Journaling",
      desc: "Speak for 30 seconds and get deeper insights than an hour of writing.",
      icon: Mic,
    },
    {
      title: "Scientific Accuracy",
      desc: "Powered by state-of-the-art vocal biomarkers and sentiment analysis.",
      icon: Brain,
    },
    {
      title: "Total Privacy",
      desc: "Your recordings are encrypted and never shared with third parties.",
      icon: ShieldCheck,
    },
  ];

  return (
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
              Why Choose MOODO?
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-display leading-tight text-foreground">
              The smarter way to <br />
              <span className="text-primary">understand yourself.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Traditional journaling is hard. MOODO makes it effortless by using
              the most expressive tool you have—your voice. Our AI doesn't just
              listen; it understands the subtle nuances of your emotional state.
            </p>

            <div className="space-y-6">
              {features.map((item, i) => (
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
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
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
            <div className="rounded-[3rem] bg-muted overflow-hidden relative group">
              <img 
                src="/mental-health-illustration.avif" 
                alt="Person using the app" 
                className="w-full h-full object-cover transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyMoodoSection;
