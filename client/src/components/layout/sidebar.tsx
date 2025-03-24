import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Brain, Home, InfoIcon, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    // { icon: HelpCircle, label: "Quizzes", href: "/quizzes" },
    // { icon: BarChart, label: "Results", href: "/results" },
    { icon: InfoIcon, label: "Statuses", href: "/statuses" },
  ];
  
  const accountItems = [
    { icon: User, label: "Profile", href: "/profile" },
  ];
  
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Brain className="h-5 w-5" /> QuizMaster
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Main
        </div>
        
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-6 py-2.5 text-sm font-medium",
              location === item.href
                ? "text-primary bg-indigo-50"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.label}
          </Link>
        ))}
        
        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Account
        </div>
        
        {accountItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-6 py-2.5 text-sm font-medium",
              location === item.href
                ? "text-primary bg-indigo-50"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.label}
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full text-left"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </nav>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3">
            {user?.profilePicture ? (
              <AvatarImage src={user.profilePicture} alt={user.username} />
            ) : (
              <AvatarFallback>{getInitials(user?.username || "User")}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-700">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
