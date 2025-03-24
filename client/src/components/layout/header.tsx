import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link } from "wouter";
import { Brain, Menu, Bell, X, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };
  
  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Quizzes", href: "/quizzes" },
    { label: "Results", href: "/results" },
    { label: "Statuses", href: "/statuses" },
    { label: "Profile", href: "/profile" },
  ];
  
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-gray-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="md:hidden flex items-center">
        <h1 className="text-lg font-bold text-primary flex items-center gap-1">
          <Brain className="h-5 w-5" /> QuizMaster
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <Avatar className="h-8 w-8">
                {user?.profilePicture ? (
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                ) : (
                  <AvatarFallback>{getInitials(user?.username || "User")}</AvatarFallback>
                )}
              </Avatar>
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-[300px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Brain className="h-5 w-5" /> QuizMaster
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
                <Avatar className="h-10 w-10">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.username} />
                  ) : (
                    <AvatarFallback>{getInitials(user?.username || "User")}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              
              <nav className="flex-1 py-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="border-t border-gray-200 pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
