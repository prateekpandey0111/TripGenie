import { Plane } from "lucide-react";

function Navbar() {
  return (
    <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
      {/* Logo */}
      <a href="#home" className="flex items-center gap-2 shrink-0">
        <Plane size={30} className="text-slate-900" />

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          TripGenie
          <span className="text-cyan-500"> AI</span>
        </h1>
      </a>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-7 lg:gap-9 text-slate-900 font-medium">
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
          className="bg-cyan-300 text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-cyan-400 transition-colors whitespace-nowrap"
        >
          Plan My Trip
        </a>
      </div>

      {/* Mobile button */}
      <a
        href="#plan-trip"
        className="md:hidden bg-cyan-300 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-cyan-400 transition-colors"
      >
        Plan Trip
      </a>
    </nav>
  );
}

export default Navbar;