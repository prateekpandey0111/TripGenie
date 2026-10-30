import {
  MapPin,
  SlidersHorizontal,
  Sparkles,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    id: 1,
    number: "01",
    title: "Choose Your Destination",
    description:
      "Tell us where you want to go. Explore amazing destinations and discover places that match your travel dreams.",
    icon: MapPin,
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    id: 2,
    number: "02",
    title: "Customize Your Trip",
    description:
      "Choose your travel dates, number of travellers and budget. Make your journey completely yours.",
    icon: SlidersHorizontal,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 3,
    number: "03",
    title: "Get Your AI Itinerary",
    description:
      "Let AI create a personalized day-wise itinerary with hotels, attractions and estimated expenses.",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-600"
  }
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white py-20 md:py-28 px-5 md:px-10"
    >

      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">

          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-widest">
            Simple process
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-4">

            Plan Your Trip in{" "}

            <span className="text-cyan-500">
              3 Easy Steps
            </span>

          </h2>

          <p className="text-slate-500 mt-5 leading-relaxed">

            Your dream vacation is just a few clicks away.
            Let TripGenie AI take care of your travel planning.

          </p>

        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {steps.map((step) => {

            const Icon = step.icon;

            return (

              <div
                key={step.id}
                className="group relative bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >

                {/* Step number */}
                <div className="flex items-center justify-between mb-8">

                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${step.color}`}
                  >

                    <Icon size={30} />

                  </div>

                  <span className="text-5xl font-bold text-slate-200 group-hover:text-cyan-100 transition-colors">

                    {step.number}

                  </span>

                </div>

                {/* Step title */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">

                  {step.title}

                </h3>

                {/* Step description */}
                <p className="text-slate-500 text-sm leading-7">

                  {step.description}

                </p>

                {/* Bottom arrow */}
                <div className="mt-8 flex items-center gap-2 text-cyan-600 font-semibold text-sm">

                  <span>Step {step.id}</span>

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-2 transition-transform duration-300"
                  />

                </div>

              </div>

            );

          })}

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">

          <a
            href="#plan-trip"
            className="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg"
          >

            Start Planning Now

            <ArrowRight size={19} />

          </a>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;