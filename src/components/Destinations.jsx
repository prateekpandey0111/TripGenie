import { MapPin, ArrowUpRight } from "lucide-react";

// Sample destination data
const destinations = [
  {
    id: 1,
    name: "Manali",
    country: "Himachal Pradesh, India",
    description: "Discover snowy mountains and peaceful valleys.",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=85"
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    description: "Experience tropical beaches and beautiful sunsets.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=85"
  },
  {
    id: 3,
    name: "Switzerland",
    country: "Europe",
    description: "Explore breathtaking mountains and alpine lakes.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=85"
  },
  {
    id: 4,
    name: "Dubai",
    country: "United Arab Emirates",
    description: "Enjoy luxury, adventure and modern architecture.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=85"
  }
];

function Destinations() {
  return (
    <section
      id="destinations"
      className="bg-slate-50 py-20 md:py-28 px-5 md:px-10"
    >

      {/* Section heading */}
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">

          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-widest">
            Discover the world
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-4">
            Explore Popular{" "}
            <span className="text-cyan-500">
              Destinations
            </span>
          </h2>

          <p className="text-slate-500 mt-5 max-w-2xl mx-auto leading-relaxed">
            From peaceful mountain escapes to tropical beaches,
            discover destinations that make every journey special.
          </p>

        </div>

        {/* Destination cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

          {destinations.map((destination) => (

            <div
              key={destination.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >

              {/* Destination image */}
              <div className="relative h-64 overflow-hidden">

                <img
                  src={destination.image}
                  alt={destination.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-the from-black/50 to-transparent"></div>

                {/* Destination name */}
                <h3 className="absolute bottom-5 left-5 text-2xl font-bold text-white">
                  {destination.name}
                </h3>

              </div>

              {/* Card information */}
              <div className="p-5">

                <div className="flex items-center gap-2 text-cyan-600 text-sm font-medium">

                  <MapPin size={16} />

                  {destination.country}

                </div>

                <p className="text-slate-500 text-sm leading-relaxed mt-4">
                  {destination.description}
                </p>

                {/* Explore button */}
                <a
                  href="#plan-trip"
                  className="mt-5 flex items-center justify-between text-slate-900 font-semibold text-sm group/link"
                >

                  Explore Destination

                  <ArrowUpRight
                    size={19}
                    className="text-cyan-600 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform"
                  />

                </a>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Destinations;