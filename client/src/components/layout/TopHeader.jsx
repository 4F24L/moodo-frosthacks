import { ArrowLeft, LogOut, Menu, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const TopHeader = ({ onLogout, onOpenSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30 sticky top-0">
      <div className="flex items-center gap-3 md:hidden">
        {location.pathname === "/dashboard/result" ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <span className="text-2xl font-bold font-display tracking-tight text-foreground bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
          Hello, {userName}
        </span>
      </div>

      {/* Desktop App Name / Greeting */}
      <div className="hidden md:flex flex-1 items-center px-2 gap-3">
        {location.pathname === "/dashboard/result" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
        <span className="text-3xl font-bold font-display tracking-tight text-foreground bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
          Hello, {userName}
        </span>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all outline-none group hover:shadow-sm relative flex items-center gap-2">
            <div className="bg-primary/10 text-primary p-1.5 rounded-full ring-2 ring-primary/20">
              <User className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mt-2">
            <DropdownMenuItem
              onClick={onLogout}
              className="text-destructive focus:text-destructive cursor-pointer group"
            >
              <LogOut className="mr-2 h-4 w-4 md:group-hover:-translate-x-1 transition-transform" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopHeader;
