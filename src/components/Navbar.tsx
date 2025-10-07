import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("deriv_token"));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-6 py-3">
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-green-600">MrChalohFx</span>
            <span className="text-blue-700">Traders</span>
          </Link>
        </div>

        {/* Center: Navigation Menu */}
        <div className="hidden md:flex items-center justify-center gap-6">
          <Link to="/bot-builder" className="text-blue-700 hover:text-blue-900 text-sm">
            Bolt Builder
          </Link>
          <Link to="/charts" className="text-blue-700 hover:text-blue-900 text-sm">
            Charts / Trading View
          </Link>
          <Link to="/free-bots" className="text-blue-700 hover:text-blue-900 text-sm">
            Free Bots
          </Link>
          <Link to="/analysis" className="text-blue-700 hover:text-blue-900 text-sm">
            Analysis Tool
          </Link>
          <Link to="/elitespeed-bots" className="text-blue-700 hover:text-blue-900 text-sm">
            EliteSpeed Bots
          </Link>
          <Link to="/dtrader" className="text-blue-700 hover:text-blue-900 text-sm">
            DTrader
          </Link>
          <Link to="/copy-trading" className="text-blue-700 hover:text-blue-900 text-sm">
            Copy Trading
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="hidden md:flex items-center justify-end gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem("deriv_token");
                navigate("/");
              }}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-700"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden col-span-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-green-600">MrChalohFx</span>
            <span className="text-blue-700">Traders</span>
          </Link>
          <button onClick={() => setOpen(!open)} className="text-blue-700">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 px-6 py-3 space-y-2 bg-white">
          <Link to="/bot-builder" className="block text-blue-700" onClick={() => setOpen(false)}>
            Bolt Builder
          </Link>
          <Link to="/charts" className="block text-blue-700" onClick={() => setOpen(false)}>
            Charts / Trading View
          </Link>
          <Link to="/free-bots" className="block text-blue-700" onClick={() => setOpen(false)}>
            Free Bots
          </Link>
          <Link to="/analysis" className="block text-blue-700" onClick={() => setOpen(false)}>
            Analysis Tool
          </Link>
          <Link to="/elitespeed-bots" className="block text-blue-700" onClick={() => setOpen(false)}>
            EliteSpeed Bots
          </Link>
          <Link to="/dtrader" className="block text-blue-700" onClick={() => setOpen(false)}>
            DTrader
          </Link>
          <Link to="/copy-trading" className="block text-blue-700" onClick={() => setOpen(false)}>
            Copy Trading
          </Link>

          <div className="pt-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("deriv_token");
                  setOpen(false);
                  navigate("/");
                }}
                className="w-full px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="w-full px-4 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-700"
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
