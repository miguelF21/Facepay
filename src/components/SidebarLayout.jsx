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
                {/* Facepay Logo Icon */}
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Face<span className="text-blue-200">pay</span></h2>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors" aria-label="Close">
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {isAuthenticated && user ? (
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-xl object-cover shadow-lg ring-4 ring-blue-100 dark:ring-blue-900" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              ) : null}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg" style={{ display: user.picture ? 'none' : 'flex' }}>
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-slate-800 dark:text-slate-200 truncate">{user.name || "User"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email || "No email"}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <User size={24} className="text-slate-500 dark:text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue</p>
          </div>
        )}

        <nav className="flex-1 p-6 overflow-y-auto space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <button key={item.to} onClick={() => handleNavClick(item.to)} disabled={!isAuthenticated} className={`w-full flex items-center gap-4 px-5 py-4 text-base font-semibold rounded-xl transition-all duration-200 ${ isActive ? `bg-gradient-to-r ${item.color} text-white shadow-lg` : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Icon size={22} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight size={18} />}
              </button>
            );
          })}
        </nav>

        {isAuthenticated && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <button onClick={() => handleNavClick('/settings')} className={`w-full flex items-center gap-4 px-5 py-4 text-base font-semibold rounded-xl transition-all duration-200 ${location.pathname === '/settings' ? 'bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Settings size={22} />
              <span className="flex-1 text-left">Settings</span>
              {location.pathname === '/settings' && <ChevronRight size={18} />}
            </button>
          </div>
        )}

        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          {isAuthenticated ? (
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="w-full flex items-center gap-4 px-5 py-4 text-base font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
              <LogOut size={22} />
              <span className="flex-1 text-left">Log out</span>
            </button>
          ) : (
            <button onClick={() => loginWithRedirect()} className="w-full flex items-center gap-4 px-5 py-4 text-base font-semibold rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
              <LogIn size={22} />
              <span className="flex-1 text-left">Sign In</span>
            </button>
          )}
        </div>
      </aside>

      {!collapsed && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar}></div>}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Menu size={22} className="text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Facepay</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Bell size={22} className="text-slate-600 dark:text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {theme === "light" ? <Moon size={22} className="text-slate-600" /> : <Sun size={22} className="text-yellow-500" />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {isAuthenticated ? <Outlet /> : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="max-w-md text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <User size={48} className="text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">Welcome to Facepay!</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">Sign in to access your dashboard</p>
                </div>
                <button onClick={() => loginWithRedirect()} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200">Sign In</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
