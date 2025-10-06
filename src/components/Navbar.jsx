import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LogIn, User } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("deriv_token");

  const handleLogout = () => {
    localStorage.removeItem("deriv_token");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login"); // redirect to your Deriv OAuth login page
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bot Builder", path: "/bot-builder" },
    { name: "Deriv Trader", path: "/deriv-trader" },
    { name: "Charts", path: "/charts" },
    { name: "Free Bots", path: "/free-bots" },
    { name: "Elite SpeedBots", path: "/elite-bots" },
    { name: "Copy Trading", path: "/copy-trading" },
    { name: "Analysis", path: "/analysis" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#001f3f]/95 backdrop-blur-md border-b border-cyan-400/20 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
        {/* --- Logo / Brand --- */}
        <Link
          to="/"
          className="text-cyan-400 font-extrabold text-lg md:text-xl tracking-widest hover:text-cyan-300 transition whitespace-nowrap"
        >
          MrChalohFx <span className="text-silver font-light">Traders</span>
        </Link>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-300 text-sm hover:text-cyan-400 font-medium transition relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* --- Right Section: Profile or Login --- */}
        <div className="hidden md:flex items-center space-x-4 ml-6">
          {isLoggedIn ? (
            <>
              <button className="flex items-center text-gray-300 hover:text-cyan-400 text-sm transition">
                <User className="w-4 h-4 mr-1" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-cyan-500 hover:bg-cyan-400 text-[#001f3f] font-semibold px-4 py-1.5 rounded-lg transition text-sm flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-cyan-500 hover:bg-cyan-400 text-[#001f3f] font-semibold px-4 py-1.5 rounded-lg transition text-sm flex items-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </button>
          )}
        </div>

        {/* --- Mobile Menu Toggle --- */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-cyan-400 focus:outline-none ml-4"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* --- Mobile Dropdown --- */}
      {menuOpen && (
        <div className="md:hidden bg-[#001a33] border-t border-cyan-400/10 px-6 py-4 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:text-cyan-400 text-base transition"
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-cyan-400/10 my-3"></div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#001f3f] font-semibold py-2 rounded-xl transition flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#001f3f] font-semibold py-2 rounded-xl transition flex items-center justify-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
