import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Sidebar, TopHeader } from "./components";
import { useAuth } from "./hooks";
import { Dashboard, History, Landing, Profile, Result, Trends } from "./pages";

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Remove changeTab event listener as we use react-router now

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (!isAuthenticated) {
    return <Landing onLogin={() => window.location.reload()} />;
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
        <TopHeader
          onLogout={handleLogout}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full scroll-smooth">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/dashboard"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-8 pb-20 w-full mx-auto max-w-7xl"
                  >
                    <Dashboard />
                  </motion.div>
                }
              />
              <Route
                path="/dashboard/result"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-8 pb-20 w-full mx-auto max-w-7xl"
                  >
                    <Result />
                  </motion.div>
                }
              />
              <Route
                path="/dashboard/trends"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-8 pb-20 w-full mx-auto max-w-7xl"
                  >
                    <Trends />
                  </motion.div>
                }
              />
              <Route
                path="/dashboard/history"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-8 pb-20 w-full mx-auto max-w-7xl"
                  >
                    <History />
                  </motion.div>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-8 pb-20 w-full mx-auto max-w-7xl"
                  >
                    <Profile />
                  </motion.div>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
