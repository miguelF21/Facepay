import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Menu,
  LogOut,
  Settings,
  User,
  Home,
  Clock,
  DollarSign,
  Users,
  FileText,
  Bell,
  X,
  LogIn,
  ChevronRight
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export default function SidebarLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const [hoverItem, setHoverItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout
  } = useAuth0();

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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

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
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleLogin = () => {
    loginWithRedirect();
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
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        transform ${collapsed ? '-translate-x-full' : 'translate-x-0'}
        lg:translate-x-0 lg:static
        transition-transform duration-300 ease-in-out
        w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl 
        border-r border-slate-200 dark:border-slate-700
        flex flex-col shadow-xl
      `}>
        {/* Header del Sidebar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-md"></div>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Face<span className="text-blue-200">pay</span>
              </h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Perfil de Usuario */}
        {isAuthenticated && user ? (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="w-12 h-12 rounded-xl object-cover shadow-md ring-2 ring-blue-100 dark:ring-blue-900"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                  <User size={20} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{user.name || "User"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email || "No email"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-2">
              <User size={20} className="text-slate-500 dark:text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to continue</p>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <button
                  key={item.to}
                  onClick={() => handleNavClick(item.to)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                  `}
                  disabled={!isAuthenticated}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Settings Button */}
        {isAuthenticated && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleNavClick('/settings')}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl
                transition-all duration-200
                ${
                  location.pathname === '/settings'
                    ? 'bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              <Settings size={20} />
              <span>Settings</span>
              {location.pathname === '/settings' && <ChevronRight size={16} className="ml-auto" />}
            </button>
          </div>
        )}

        {/* Logout/Login Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </aside>

      {/* Overlay para móviles */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Facepay
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={20} className="text-slate-600" />
              ) : (
                <Sun size={20} className="text-yellow-500" />
              )}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {isAuthenticated ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="max-w-md text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    Welcome to Facepay!
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Sign in to access your dashboard and manage your information.
                  </p>
                </div>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
