import { Activity, Clock, TrendingUp, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

const themes = [
  { id: "ocean", label: "Ocean Breeze", color: "bg-blue-500" },
  { id: "sunset", label: "Sunset Glow", color: "bg-orange-500" },
  { id: "forest", label: "Forest Deep", color: "bg-green-600" },
  { id: "midnight", label: "Midnight Purple", color: "bg-indigo-600" },
];

const tabs = [
  { id: "dashboard", path: "/dashboard", label: "Journal", icon: Activity },
  {
    id: "history",
    path: "/dashboard/history",
    label: "History",
    icon: Clock,
  },
  {
    id: "trends",
    path: "/dashboard/trends",
    label: "Insights",
    icon: TrendingUp,
  },
  { id: "profile", path: "/dashboard/profile", label: "Profile", icon: User },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/80 backdrop-blur-3xl border-r border-border/60 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] transition-colors duration-300">
      <div className="flex items-center justify-start h-20 border-b border-border/40 py-4 px-6 relative overflow-hidden">
        <img
          src="/logo1.png"
          alt="Moodo Logo"
          className="w-auto h-8 lg:h-14 object-contain filter  transition-transform origin-left"
        />
      </div>

      <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          overview
        </p>
        <div className="space-y-1 relative">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  navigate(tab.path);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                  isActive
                    ? "text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicatorDesktop"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={cn(
                    "h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary" : "",
                  )}
                />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Removed bottom control section, now handled by TopHeader */}
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-48 lg:w-56 h-screen sticky top-0 z-40 bg-background/50">
        <SidebarContent />
      </aside>
      {/* Removed mobile header, handled by TopHeader */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
