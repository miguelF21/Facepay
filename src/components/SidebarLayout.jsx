import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, LogOut, Settings, User, Home, Clock, DollarSign, Users, FileText, Bell, X, LogIn, ChevronRight } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export default function SidebarLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const savedTheme = localStorage?.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = isAuthenticated ? [
    { to: "/dashboard", label: "Dashboard", icon: Home, color: "from-blue-500 to-cyan-500" },
    { to: "/attendance", label: "Attendance", icon: Clock, color: "from-emerald-500 to-teal-500" },
    { to: "/payroll", label: "Payroll", icon: DollarSign, color: "from-amber-500 to-orange-500" },
    { to: "/employees", label: "Employees", icon: Users, color: "from-blue-500 to-sky-500" },
    { to: "/reports", label: "Reports", icon: FileText, color: "from-rose-500 to-pink-500" },
  ] : [];

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setCollapsed(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 transform ${collapsed ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0 lg:static transition-transform duration-300 w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-xl`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {/* Facepay logo PNG uploaded by user */}
                <img src="/facepay-logo.png" alt="Facepay Logo" className="w-9 h-9 object-contain" style={{borderRadius:'0.4em', background:'white'}} />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Face<span className="text-blue-200">pay</span></h2>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors" aria-label="Close">
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
        {/* ...rest of sidebar remains unchanged... */}
