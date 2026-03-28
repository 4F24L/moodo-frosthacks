import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, TopHeader } from "./components";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./hooks";
import { Dashboard, History, Landing, Profile, Result, Trends } from "./pages";

export default function App() {
  const { isAuthenticated, userRole, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect based on role after authentication
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, userRole, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const isAdminPath = location.pathname.startsWith("/admin");

  // Show landing page if not authenticated and not on admin path
  if (!isAuthenticated && !isAdminPath) {
    return <Landing onLogin={() => window.location.reload()} />;
  }

  // Admin routes - check if user is admin
  if (isAdminPath) {
    if (!isAuthenticated) {
      return <Landing onLogin={() => window.location.reload()} />;
    }

    if (userRole !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/admin/*"
            element={<AdminDashboard onLogout={handleLogout} />}
          />
        </Routes>
      </AnimatePresence>
    );
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
