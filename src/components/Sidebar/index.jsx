import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Clock,
  DollarSign,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  User,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useTheme } from '../../context/ThemeProvider';

const navItems = [
  { 
    to: '/dashboard', 
    label: 'Dashboard', 
    icon: Home, 
    color: 'text-blue-500' 
  },
  { 
    to: '/employees', 
    label: 'Employees', 
    icon: Users, 
    color: 'text-green-500' 
  },
  { 
    to: '/attendance', 
    label: 'Attendance', 
    icon: Clock, 
    color: 'text-yellow-500' 
  },
  { 
    to: '/payroll', 
    label: 'Payroll', 
    icon: DollarSign, 
    color: 'text-purple-500' 
  },
  { 
    to: '/reports', 
    label: 'Reports', 
    icon: FileText, 
    color: 'text-pink-500' 
  },
  { 
    to: '/settings', 
    label: 'Settings', 
    icon: Settings, 
    color: 'text-gray-500' 
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-56'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img
                src="/FacePay_Logo_vertically-700x700.png"
                alt="FacePay Logo"
                className="h-10 w-10 rounded-md object-cover"
              />
              <span className="text-lg font-semibold">FacePay</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSidebar}
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={cn(
                      'flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      location.pathname === item.to
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground',
                      !isOpen && 'justify-center'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', item.color)} />
                    <motion.span 
                      className={cn('ml-3 transition-all', !isOpen && 'hidden')}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User & Settings */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center space-x-3", !isOpen && "w-full justify-center")}>
                <Avatar className={cn("h-9 w-9 transition-all", !isOpen && "h-8 w-8")}>
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      className="min-w-0"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="truncate text-sm font-medium">Admin</p>
                      <p className="truncate text-xs text-muted-foreground">admin@example.com</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={cn("flex items-center space-x-1", !isOpen && "hidden")}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-8 w-8"
                      >
                        {theme === 'dark' ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          logout({
                            logoutParams: { returnTo: window.location.origin },
                          })
                        }
                        className="h-8 w-8"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Cerrar sesión</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
