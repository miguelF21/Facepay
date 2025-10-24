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
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40
        transform ${collapsed ? '-translate-x-full' : 'translate-x-0'}
        lg:translate-x-0 lg:static lg:block
        transition-all duration-500 ease-out
        w-80 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50
        flex flex-col shadow-2xl lg:shadow-xl
        group
        ${collapsed ? 'shadow-none' : 'shadow-2xl lg:shadow-xl'}
      `}>
        {/* Header del Sidebar */}
        <div className="relative p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 dark:from-blue-700 dark:via-cyan-700 dark:to-blue-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="w-7 h-7 bg-white rounded-md"></div>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Face<span className="text-blue-200">pay</span>
              </h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl lg:hidden hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Perfil de Usuario */}
        {isAuthenticated && user ? (
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
            <div className="flex items-center gap-4 group/profile cursor-pointer">
              <div className="relative">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "User Avatar"}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-4 ring-blue-100 dark:ring-blue-900 transition-all duration-300 group-hover/profile:scale-110 group-hover/profile:ring-blue-200 dark:group-hover/profile:ring-blue-800"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-100 dark:ring-blue-900 transition-all duration-300 group-hover/profile:scale-110">
                    <User size={22} className="text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate">{user.name || "User"}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email || "No email"}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                </div>
              </div>
              <ChevronRight size={12} className="text-slate-400 group-hover/profile:text-slate-600 dark:group-hover/profile:text-slate-300 transition-colors duration-200" />
            </div>
          </div>
        ) : (
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 text-center bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <User size={22} className="text-slate-600 dark:text-slate-300" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Sign in to see your profile</p>
          </div>
        )}

        {/* Navigation Menu - BOTONES MÁS GRANDES */}
        <nav className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-3">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              const isHovered = hoverItem === item.to;

              return (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => setHoverItem(item.to)}
                  onMouseLeave={() => setHoverItem(null)}
                >
                  <button
                    onClick={() => handleNavClick(item.to)}
                    className={`
                      w-full flex items-center gap-5 px-6 py-5 text-lg font-semibold rounded-3xl
                      transition-all duration-300 transform group/nav relative overflow-hidden
                      min-h-[70px] shadow-lg hover:shadow-xl
                      ${isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-xl shadow-blue-500/25 scale-105 translate-x-2`
                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200 hover:scale-105 hover:translate-x-1 bg-white/50 dark:bg-slate-700/30'
                      }
                    `}
                    disabled={!isAuthenticated}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Efecto de brillo animado */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 transition-all duration-500 rounded-3xl
                      ${isHovered && !isActive ? 'opacity-15' : ''}
                    `}></div>
                    
                    {/* Barra lateral indicadora más gruesa */}
                    <div className={`
                      absolute left-0 top-1/2 -translate-y-1/2 w-1.5 bg-gradient-to-b ${item.color} rounded-full transition-all duration-300
                      ${isActive ? 'h-12' : isHovered ? 'h-6' : 'h-0'}
                    `}></div>

                    {/* Icono más grande con mejor padding */}
                    <div className={`
                      relative z-10 p-3 rounded-2xl transition-all duration-300 flex-shrink-0
                      ${isActive ? 'bg-white/20 backdrop-blur-sm' : isHovered ? `bg-gradient-to-br ${item.color} bg-opacity-15` : 'bg-slate-100/50 dark:bg-slate-600/30'}
                    `}>
                      <Icon size={26} className={`
                        transition-all duration-300
                        ${isActive ? 'text-white' : isHovered ? 'text-current' : 'text-slate-500 dark:text-slate-400'}
                      `} />
                    </div>
                    
                    {/* Texto más grande y mejor espaciado */}
                    <span className={`
                      relative z-10 transition-all duration-300 flex-1 text-left
                      ${isActive ? 'font-bold text-white' : 'font-semibold'}
                    `}>
                      {item.label}
                    </span>

                    {/* Indicador de flecha para elemento activo más grande */}
                    {isActive && (
                      <ChevronRight size={22} className="ml-auto text-white/80 animate-pulse flex-shrink-0" />
                    )}

                    {/* Efecto de partículas sutil para elemento activo */}
                    {isActive && (
                      <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="absolute top-2 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
                        <div className="absolute bottom-3 right-8 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Configuración (Bottom) - Botón más grande */}
        {isAuthenticated && (
          <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50">
            <button
              onClick={() => handleNavClick('/settings')}
              className={`
                w-full flex items-center gap-5 px-6 py-5 text-lg font-semibold rounded-3xl
                transition-all duration-300 transform group/settings relative overflow-hidden
                min-h-[70px] shadow-lg hover:shadow-xl
                ${location.pathname === '/settings'
                  ? 'bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-xl shadow-slate-500/25 scale-105 translate-x-2'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200 hover:scale-105 hover:translate-x-1 bg-white/50 dark:bg-slate-700/30'
                }
              `}
            >
              <div className={`
                relative z-10 p-3 rounded-2xl transition-all duration-300 flex-shrink-0
                ${location.pathname === '/settings' ? 'bg-white/20 backdrop-blur-sm' : 'group-hover/settings:bg-slate-100 dark:group-hover/settings:bg-slate-700 bg-slate-100/50 dark:bg-slate-600/30'}
              `}>
                <Settings size={26} className={`
                  transition-all duration-300
                  ${location.pathname === '/settings' ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover/settings:text-slate-700 dark:group-hover/settings:text-slate-300'}
                `} />
              </div>
              <span className="relative z-10 flex-1 text-left">Settings</span>
              {location.pathname === '/settings' && (
                <ChevronRight size={22} className="ml-auto text-white/80 animate-pulse flex-shrink-0" />
              )}
            </button>
          </div>
        )}

        {/* Botón de Logout/Login - Más grande */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50">
            {isAuthenticated ? (
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-5 px-6 py-5 text-lg font-semibold rounded-3xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group min-h-[70px] shadow-lg hover:shadow-xl bg-white/50 dark:bg-slate-700/30"
                    aria-label="Sign out"
                >
                    <div className="relative z-10 p-3 rounded-2xl transition-all duration-300 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 flex-shrink-0 bg-red-50/50 dark:bg-red-900/10">
                        <LogOut size={26} className="group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" />
                    </div>
                    <span className="relative z-10 flex-1 text-left">Log out</span>
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    className="w-full flex items-center gap-5 px-6 py-5 text-lg font-semibold rounded-3xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group min-h-[70px] shadow-lg hover:shadow-xl bg-white/50 dark:bg-slate-700/30"
                    aria-label="Sign in"
                >
                    <div className="relative z-10 p-3 rounded-2xl transition-all duration-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex-shrink-0 bg-blue-50/50 dark:bg-blue-900/10">
                        <LogIn size={26} className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                    </div>
                    <span className="relative z-10 flex-1 text-left">Sign In</span>
                </button>
            )}
        </div>
      </aside>

      {/* Overlay para móviles */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        ></div>
      )}

      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col overflow-hidden
        ${!collapsed ? 'lg:ml-0' : 'lg:ml-320'}
        transition-all duration-300 ease-out
      `}>
        {/* Topbar */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
              aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            >
              {collapsed ? (
                <Menu size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
              ) : (
                <X size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
              )}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent lg:hidden">
              Face<span className="text-blue-200">pay</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                className="relative p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
                aria-label="Ver notificaciones"
              >
                <Bell size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce border-2 border-white dark:border-slate-800 font-bold">
                  3
                </span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
              aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            >
              {theme === "light" ? (
                <Moon size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
              ) : (
                <Sun size={20} className="text-yellow-500 group-hover:text-amber-400 transition-colors" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 group transition-all duration-200"
                aria-label="Log out"
              >
                <LogOut size={20} className="group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 group transition-all duration-200"
                aria-label="Sign In"
              >
                <LogIn size={20} className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-400/3 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative h-full">
            {isAuthenticated ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="w-full max-w-7xl mx-auto">
                  <Outlet />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="max-w-md mx-auto space-y-8 relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <User size={48} className="text-white" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Welcome Facepay!
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                      Sign in to access your dashboard and manage your information.                    </p>
                  </div>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    log In
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .nav-item {
          animation: slideInFromLeft 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}