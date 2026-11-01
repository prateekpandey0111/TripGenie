
import { useState } from "react";
import { Plane, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError("");

      await logout();

      navigate("/login", { replace: true });
    } catch (error) {
      setError(error.message || "Unable to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between gap-4">

      {/* Logo */}
      <a href="#home" className="flex items-center gap-2 shrink-0">
        <Plane size={30} className="text-slate-900" />

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          TripGenie
          <span className="text-cyan-500"> AI</span>
        </h1>
      </a>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-5 lg:gap-7 text-slate-900 font-medium">

        <a href="#home" className="hover:text-cyan-500 transition-colors">
          Home
        </a>

        <a href="#destinations" className="hover:text-cyan-500 transition-colors">
          Destinations
        </a>

        <a href="#how-it-works" className="hover:text-cyan-500 transition-colors">
          Experiences
        </a>

        <a href="#about" className="hover:text-cyan-500 transition-colors">
          About
        </a>

        <a
          href="#plan-trip"
          className="bg-cyan-300 text-slate-900 px-5 py-3 rounded-full font-semibold hover:bg-cyan-400 transition-colors whitespace-nowrap"
        >
          Plan My Trip
        </a>

        {/* Logged-in user */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-700 whitespace-nowrap">
              Hi, {user.name.split(" ")[0]}
            </span>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-full text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile navigation */}
      <div className="flex md:hidden items-center gap-2">
        <a
          href="#plan-trip"
          className="bg-cyan-300 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-cyan-400 transition-colors whitespace-nowrap"
        >
          Plan Trip
        </a>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Logout"
          className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      {error && (
        <p className="absolute top-full right-4 mt-1 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </nav>
  );
}

export default Navbar;
