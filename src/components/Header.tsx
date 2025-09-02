import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle, Settings, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from './AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
}

const Header = ({ onNavigate, currentSection = 'home' }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-primary transition-all duration-300">
              <span className="text-primary-foreground font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-foreground">IntervYou</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate?.('home')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentSection === 'home' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate?.('practice')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentSection === 'practice' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Practice
            </button>
            <button 
              onClick={() => onNavigate?.('analytics')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentSection === 'analytics' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Analytics
            </button>
            <button 
              onClick={() => onNavigate?.('feedback')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentSection === 'feedback' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Feedback
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <AuthDialog 
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserCircle className="h-4 w-4" />
                      Sign In
                    </Button>
                  }
                />
                <AuthDialog 
                  trigger={
                    <Button variant="hero" size="sm">
                      Get Started
                    </Button>
                  }
                  defaultTab="register"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;