
import { useState } from "react";
import TripMap from "./TripMap";
import DownloadTripPDF from "./DownloadTripPDF";
import {
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  Sparkles,
  Compass,
  Headphones,
  Tag,
  ArrowRight,
  Clock,
  IndianRupee,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";

import Navbar from "./Navbar";

const floatingPills = [
  { icon: Tag, label: "Cheapest flights", position: "top-[34%] right-[22%]" },
  { icon: Sparkles, label: "Trip for all tastes", position: "top-[43%] right-[16%]" },
  { icon: Compass, label: "Local Guides", position: "top-[53%] right-[24%]" },
  { icon: Headphones, label: "24/7 Support", position: "top-[62%] right-[12%]" },
];

function Hero() {
  const [tripDetails, setTripDetails] = useState({
    destination: "",
    duration: "",
    travelers: "2",
    budget: "Standard",
  });

  const [message, setMessage] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setTripDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!tripDetails.destination.trim()) {
      setMessage("Please enter your destination.");
      return;
    }

    if (
      !tripDetails.duration ||
      Number(tripDetails.duration) < 1 ||
      Number(tripDetails.duration) > 30
    ) {
      setMessage("Please enter a valid duration (1-30 days).");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Creating your personalized AI itinerary...");
      setItinerary(null);

      const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const response = await fetch(`${API_URL}/api/trips`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify(tripDetails),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (!data.itinerary) {
        throw new Error("The AI did not return an itinerary.");
      }

      setItinerary(data.itinerary);
      setMessage("Your AI itinerary is ready!");

      console.log("Generated itinerary:", data.itinerary);

    } catch (error) {
      console.error("API Error:", error);
      setMessage(error.message || "Unable to generate itinerary.");
    } finally {
      setIsLoading(false);
    }
  }

  const fieldLabel =
    "flex items-center gap-2 text-xs font-bold text-slate-800 mb-1";

  const fieldInput =
    "w-full min-w-0 outline-none text-sm text-slate-600 placeholder:text-slate-400 bg-transparent";

  const fieldWrap =
    "min-w-0 lg:border-l lg:border-slate-200 lg:pl-4";

  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        className="min-h-screen p-4 md:p-8 pb-24 md:pb-28 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2000&q=85')",
        }}
      >
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col rounded-[36px] md:rounded-[44px] border-[3px] border-white">

          <Navbar />

          {/* Heading */}
          <main className="relative z-10 flex-1 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-8 md:px-14 lg:px-20 py-10">
              <div className="max-w-2xl text-slate-900">
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
                  Your Trip
                  <br />
                  Starts <span className="text-cyan-300">Here</span>
                </h1>

                <p className="mt-6 max-w-md text-sm md:text-base text-slate-900/90 leading-relaxed">
                  Explore curated trips, unique experiences, and unforgettable
                  destinations. Travel smarter, deeper, and more inspired.
                </p>
              </div>
            </div>
          </main>

          {/* Floating pills */}
          {floatingPills.map(({ icon: Icon, label, position }) => (
            <div
              key={label}
              className={`hidden lg:flex absolute ${position} items-center gap-2 rounded-full border border-white/70 bg-white/10 backdrop-blur-md px-4 py-2 text-xs text-white`}
            >
              <Icon size={14} className="text-white" />
              {label}
            </div>
          ))}

          {/* Trip planning form */}
          <div
            id="plan-trip"
            className="relative z-20 w-full max-w-4xl mx-auto px-4 lg:absolute lg:left-1/2 lg:bottom-0 lg:-translate-x-1/2 lg:translate-y-1/2 pb-6 lg:pb-0"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl lg:rounded-full shadow-2xl p-5 lg:px-8 lg:py-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-4 items-center">

                {/* Destination */}
                <div className="min-w-0">
                  <label className={fieldLabel}>
                    <MapPin size={16} className="text-cyan-600 shrink-0" />
                    Where to
                  </label>

                  <input
                    type="text"
                    name="destination"
                    value={tripDetails.destination}
                    onChange={handleChange}
                    placeholder="Destination"
                    className={fieldInput}
                  />
                </div>

                {/* Duration */}
                <div className={fieldWrap}>
                  <label className={fieldLabel}>
                    <CalendarDays size={16} className="text-cyan-600 shrink-0" />
                    Duration
                  </label>

                  <input
                    type="number"
                    name="duration"
                    min="1"
                    max="30"
                    value={tripDetails.duration}
                    onChange={handleChange}
                    placeholder="Days"
                    className={fieldInput}
                  />
                </div>

                {/* Travellers */}
                <div className={fieldWrap}>
                  <label className={fieldLabel}>
                    <Users size={16} className="text-cyan-600 shrink-0" />
                    Guests
                  </label>

                  <select
                    name="travelers"
                    value={tripDetails.travelers}
                    onChange={handleChange}
                    className={fieldInput}
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6 People</option>
                  </select>
                </div>

                {/* Budget */}
                <div className={fieldWrap}>
                  <label className={fieldLabel}>
                    <Wallet size={16} className="text-cyan-600 shrink-0" />
                    Budget
                  </label>

                  <select
                    name="budget"
                    value={tripDetails.budget}
                    onChange={handleChange}
                    className={fieldInput}
                  >
                    <option value="Budget">Budget</option>
                    <option value="Standard">Standard</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-cyan-300 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-semibold px-6 py-3 rounded-full transition-colors whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Plan Your Trip
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {message && (
                <p
                  role="status"
                  className="mt-3 text-sm text-center font-medium text-cyan-700"
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* AI ITINERARY SECTION */}
      {itinerary && (
        <section
          id="itinerary"
          className="bg-slate-50 py-16 px-4 md:px-8"
        >
          <div className="max-w-6xl mx-auto">

            {/* Itinerary heading */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles size={16} />
                Powered by Gemini AI
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                {itinerary.title || "Your Travel Itinerary"}
              </h2>

              <p className="text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
                {itinerary.overview}
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
                <span className="bg-white shadow-sm px-4 py-2 rounded-full text-slate-700">
                  <MapPin size={15} className="inline mr-2 text-cyan-600" />
                  {tripDetails.destination}
                </span>

                <span className="bg-white shadow-sm px-4 py-2 rounded-full text-slate-700">
                  <CalendarDays size={15} className="inline mr-2 text-cyan-600" />
                  {tripDetails.duration} Days
                </span>

                <span className="bg-white shadow-sm px-4 py-2 rounded-full text-slate-700">
                  <Users size={15} className="inline mr-2 text-cyan-600" />
                  {tripDetails.travelers} Travellers
                </span>
              </div>
            </div>

            {/* Day-wise itinerary */}
            <div className="space-y-6">
              {(itinerary.dailyItinerary || []).map((day, index) => (
                <div
                  key={day.day || index}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-cyan-100 text-cyan-700 rounded-2xl w-12 h-12 flex items-center justify-center font-bold">
                      {day.day || index + 1}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
                        Day {day.day || index + 1}
                      </p>

                      <h3 className="text-xl font-bold text-slate-900">
                        {day.title || "Explore the destination"}
                      </h3>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {(day.activities || []).map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className="bg-slate-50 rounded-2xl p-5"
                      >
                        <div className="flex items-center gap-2 text-cyan-700 text-sm font-semibold mb-3">
                          <Clock size={16} />
                          {activity.time || "Activity"}
                        </div>

                        <h4 className="font-bold text-slate-900 mb-2">
                          {activity.place || "Explore"}
                        </h4>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <TripMap
  destination={tripDetails.destination}
  dailyItinerary={itinerary.dailyItinerary}
/>

            {/* Budget section */}
            {itinerary.estimatedBudget && (
              <div className="mt-10 bg-slate-900 text-white rounded-3xl p-7 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <IndianRupee className="text-cyan-300" size={28} />

                  <h3 className="text-2xl font-bold">
                    Estimated Trip Budget
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">
                      Total estimated cost
                    </p>

                    <p className="text-2xl md:text-3xl font-bold text-cyan-300">
                      {itinerary.estimatedBudget.total}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-2">
                      Estimated cost per person
                    </p>

                    <p className="text-2xl md:text-3xl font-bold text-cyan-300">
                      {itinerary.estimatedBudget.perPerson}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-6">
                  These are AI-generated estimates, not live-verified prices.
                </p>
              </div>
            )}

            {/* Travel tips */}
            {itinerary.travelTips?.length > 0 && (
              <div className="mt-10 bg-white border border-slate-200 rounded-3xl p-7 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="text-amber-500" size={26} />

                  <h3 className="text-2xl font-bold text-slate-900">
                    Travel Tips
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {itinerary.travelTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl"
                    >
                      <span className="text-cyan-600 font-bold">
                        {index + 1}.
                      </span>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            
              {/* Download PDF and Plan another trip */}
           <div className="flex flex-wrap justify-center gap-4 mt-12">

           <DownloadTripPDF
    itinerary={itinerary}
    tripDetails={tripDetails}
  />

  <button
    onClick={() => {
      setItinerary(null);
      setMessage("");

      document.getElementById("plan-trip")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }}
    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-7 py-3 rounded-full transition-colors"
  >
    Plan Another Trip
    <ArrowRight size={17} />
  </button>

</div>


          </div>
        </section>
      )}
    </>
  );
}

export default Hero;
