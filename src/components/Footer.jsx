
import { Plane, ArrowRight, MapPin, Heart } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Home", href: "#home" },
      { name: "Destinations", href: "#destinations" },
      { name: "Experiences", href: "#how-it-works" }
    ]
  },
  {
    title: "Discover",
    links: [
      { name: "How It Works", href: "#how-it-works" },
      { name: "Why TripGenie", href: "#about" },
      { name: "Plan Your Trip", href: "#plan-trip" }
    ]
  }
];

function Footer() {
  return (
    <>
      {/* Final call to action */}
      <section className="px-5 md:px-10 py-16 md:py-20 bg-slate-50">

        <div className="max-w-7xl mx-auto overflow-hidden rounded-32px bg-gradient-to-right from-cyan-800 to-blue-600 px-7 py-14 md:px-16 md:py-20 text-center text-black">

          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            Your next adventure awaits
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mt-5">
            Ready to Explore the World?
          </h2>

          <p className="max-w-2xl mx-auto mt-5 text-slate-500 leading-relaxed">
            Stop worrying about travel planning.
            Let TripGenie AI help you create unforgettable
            journeys tailored to your budget and preferences.
          </p>

          <a
            href="#plan-trip"
            className="inline-flex items-center gap-3 mt-9 bg-cyan-500 text-white font-bold px-8 py-4 rounded-full hover:bg-cyan-700 hover:shadow-xl transition-all duration-300"
          >
            Plan Your Journey
            <ArrowRight size={19} />
          </a>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white px-6 md:px-12 pt-16 pb-8">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

            {/* Brand information */}
            <div>

              <a href="#home" className="inline-flex items-center gap-2">

                <Plane size={30} className="text-cyan-400" />

                <span className="text-2xl font-bold">
                  TripGenie
                  <span className="text-cyan-400"> AI</span>
                </span>

              </a>

              <p className="text-slate-400 text-sm leading-7 mt-5 max-w-xs">
                Your intelligent travel companion.
                Discover destinations, customize your journey
                and explore the world with AI.
              </p>

              <div className="flex items-center gap-2 mt-6 text-cyan-400 text-sm">
                <MapPin size={17} />
                <span>Explore. Experience. Enjoy.</span>
              </div>

            </div>

            {/* Navigation links */}
            {footerLinks.map((group) => (

              <div key={group.title}>

                <h3 className="font-bold text-lg mb-6">
                  {group.title}
                </h3>

                <ul className="space-y-4">

                  {group.links.map((link) => (

                    <li key={link.name}>

                      <a
                        href={link.href}
                        className="text-slate-400 text-sm hover:text-cyan-400 transition-colors"
                      >
                        {link.name}
                      </a>

                    </li>

                  ))}

                </ul>

              </div>

            ))}

            {/* Project information */}
            <div>

              <h3 className="font-bold text-lg mb-6">
                Our Mission
              </h3>

              <p className="text-slate-400 text-sm leading-7">
                Making travel planning easier, smarter
                and more personalized through artificial
                intelligence.
              </p>

              <a
                href="#plan-trip"
                className="inline-flex items-center gap-2 mt-5 text-cyan-400 text-sm font-semibold hover:text-white transition-colors"
              >
                Start Planning
                <ArrowRight size={16} />
              </a>

            </div>

          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-slate-500 text-sm text-center">
              © {new Date().getFullYear()} TripGenie AI. All rights reserved.
            </p>

            <p className="flex items-center gap-2 text-slate-500 text-sm">
              Made with
              <Heart size={15} className="text-red-400 fill-red-400" />
              for travellers
            </p>

          </div>

        </div>

      </footer>
    </>
  );
}

export default Footer;
