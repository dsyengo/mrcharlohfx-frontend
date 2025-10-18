import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Bot,
  LineChart,
  BarChart2,
  Zap,
  Rocket,
  DollarSign,
  Users,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("deriv_token"));

  // ✅ All paths fixed (no hash)
  const menuItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: "Bot Builder",
      to: "/bot-builder",
      icon: <Bot className="w-4 h-4" />,
    },
    {
      label: "Charts",
      to: "/charts",
      icon: <LineChart className="w-4 h-4" />,
    },
    {
      label: "Trading View",
      to: "/trading-view",
      icon: <LineChart className="w-4 h-4" />,
    },
    {
      label: "Free Bots",
      to: "/bots",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      label: "Analysis Tool",
      to: "/analysis",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      label: "EliteSpeed Bots",
      to: "#/elitespeed-bots",
      icon: <Rocket className="w-4 h-4" />,
    },
    {
      label: "DTrader",
      to: "/dtrader",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: "Copy Trading",
      to: "/copy-trading",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  // ✅ Check if route matches or starts with path
  const isActiveRoute = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      {/* === Brand Top Center === */}
      <div className="w-full flex justify-center py-2 border-b border-gray-100">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-center"
        >
          <span className="text-green-600">MrChalohFx</span>
          <span className="text-blue-700">Traders</span>
        </Link>
      </div>

      {/* === Menu + Auth Buttons === */}
      <div className="flex justify-between px-6 py-3">
        {/* Left: Menu */}
        <div className="hidden md:flex items-center gap-6 ml-0">
          {menuItems.map((item) => {
            const active = isActiveRoute(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? "bg-blue-100 text-blue-900 font-semibold shadow-sm"
                      : "text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Auth Buttons */}
        <div className="hidden md:flex items-center gap-4 mr-0">
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem("deriv_token");
                navigate("/");
              }}
              className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile: Menu Toggle */}
        <div className="md:hidden flex items-center justify-between w-full">
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto text-blue-700"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* === Mobile Dropdown === */}
      {open && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 space-y-3 bg-white">
          {menuItems.map((item) => {
            const active = isActiveRoute(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-all
                  ${
                    active
                      ? "bg-blue-100 text-blue-900 font-semibold"
                      : "text-blue-700 hover:bg-blue-50"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("deriv_token");
                  setOpen(false);
                  navigate("/");
                }}
                className="w-full px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="w-full px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
