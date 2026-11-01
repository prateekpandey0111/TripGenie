
import { useEffect, useState } from "react";
import {
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  Trash2,
  ArrowLeft,
  Eye,
  Loader2,
  Plane,
  Pencil,
  Save,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editForm, setEditForm] = useState({
    destination: "",
    duration: "3",
    travelers: "2",
    budget: "Standard",
  });

  // Fetch all saved trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");

     

const response = await fetch(`${API_URL}/api/trips`, {
  method: "GET",
  credentials: "include",
});
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch trips.");
      }

      setTrips(data.trips || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Open edit form with existing trip details
  const handleEditClick = (trip) => {
    setEditingTrip(trip);
    setEditForm({
      destination: trip.destination || "",
      duration: String(trip.duration || 3),
      travelers: String(trip.travelers || 2),
      budget: trip.budget || "Standard",
    });
    setError("");
    setMessage("");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Update trip and regenerate AI itinerary
  const handleUpdateTrip = async (e) => {
    e.preventDefault();

    if (!editForm.destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    try {
      setIsUpdating(true);
      setError("");
      setMessage("");

      const response = await fetch(
  `${API_URL}/api/trips/${editingTrip._id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      destination: editForm.destination.trim(),
      duration: Number(editForm.duration),
      travelers: Number(editForm.travelers),
      budget: editForm.budget,
    }),
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update trip.");
      }

      // Update the trip in the frontend list
      setTrips((previousTrips) =>
        previousTrips.map((trip) =>
          trip._id === editingTrip._id ? data.trip : trip
        )
      );

      // Update the selected trip if its details are open
      setSelectedTrip((previousTrip) =>
        previousTrip?._id === editingTrip._id
          ? data.trip
          : previousTrip
      );

      setEditingTrip(null);
      setMessage("Trip and AI itinerary updated successfully!");
    } catch (err) {
      setError(err.message || "Unable to update trip.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete a saved trip
  const handleDelete = async (tripId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(tripId);
      setError("");
      setMessage("");

      const response = await fetch(
  `${API_URL}/api/trips/${tripId}`,
  {
    method: "DELETE",
    credentials: "include",
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete trip.");
      }

      setTrips((previousTrips) =>
        previousTrips.filter((trip) => trip._id !== tripId)
      );

      if (selectedTrip?._id === tripId) {
        setSelectedTrip(null);
      }

      if (editingTrip?._id === tripId) {
        setEditingTrip(null);
      }

      setMessage("Trip deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete trip.");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <section className="bg-slate-50 px-6 py-20">
        <div className="flex items-center justify-center gap-3 text-slate-600">
          <Loader2 className="animate-spin" size={24} />
          <p>Loading your saved trips...</p>
        </div>
      </section>
    );
  }

  // Edit trip form
  if (editingTrip) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-16 md:px-10">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => setEditingTrip(null)}
            disabled={isUpdating}
            className="mb-8 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2 text-blue-600">
                <Pencil size={20} />
                <span className="font-semibold uppercase tracking-wider">
                  Edit your trip
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Update Trip Details
              </h2>

              <p className="mt-2 text-slate-500">
                Gemini AI will generate a fresh itinerary using your updated
                details.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateTrip} className="space-y-6">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={editForm.destination}
                  onChange={handleInputChange}
                  placeholder="Enter destination"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={editForm.duration}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  name="travelers"
                  value={editForm.travelers}
                  onChange={handleInputChange}
                  min="1"
                  max="6"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Budget
                </label>
                <select
                  name="budget"
                  value={editForm.budget}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <strong>Note:</strong> Saving these changes will generate a
                new AI itinerary and replace the previous itinerary.
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating Updated Itinerary...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes & Regenerate Itinerary
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Full itinerary details view
  if (selectedTrip) {
    const itinerary = selectedTrip.itinerary || {};
    const dailyItinerary = itinerary.dailyItinerary || [];
    const estimatedBudget = itinerary.estimatedBudget || {};
    const travelTips = itinerary.travelTips || [];

    return (
      <section className="min-h-screen bg-slate-50 px-4 py-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => setSelectedTrip(null)}
            className="mb-8 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Back to My Trips
          </button>

          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="mb-2 font-semibold uppercase tracking-wider text-blue-600">
                  Your saved itinerary
                </p>

                <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {itinerary.title || selectedTrip.destination}
                </h2>

                <p className="mt-3 flex items-center gap-2 text-slate-500">
                  <MapPin size={18} />
                  {selectedTrip.destination}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleEditClick(selectedTrip)}
                  className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-600 hover:bg-blue-100"
                >
                  <Pencil size={18} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(selectedTrip._id)}
                  disabled={deletingId === selectedTrip._id}
                  className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === selectedTrip._id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  Delete
                </button>
              </div>
            </div>

            <p className="mb-8 leading-7 text-slate-600">
              {itinerary.overview || "No overview available."}
            </p>

            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-5">
                <CalendarDays className="mb-3 text-blue-600" size={24} />
                <p className="text-sm text-slate-500">Duration</p>
                <p className="text-xl font-bold text-slate-900">
                  {selectedTrip.duration} Days
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-5">
                <Users className="mb-3 text-purple-600" size={24} />
                <p className="text-sm text-slate-500">Travelers</p>
                <p className="text-xl font-bold text-slate-900">
                  {selectedTrip.travelers}
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-5">
                <Wallet className="mb-3 text-green-600" size={24} />
                <p className="text-sm text-slate-500">Budget Type</p>
                <p className="text-xl font-bold text-slate-900">
                  {selectedTrip.budget}
                </p>
              </div>
            </div>

            <h3 className="mb-6 text-2xl font-bold text-slate-900">
              Daily Itinerary
            </h3>

            <div className="space-y-6">
              {dailyItinerary.length > 0 ? (
                dailyItinerary.map((day, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 p-5 md:p-7"
                  >
                    <h4 className="mb-4 text-xl font-bold text-blue-700">
                      Day {day.day || index + 1}: {day.title}
                    </h4>

                    <div className="space-y-4">
                      {(day.activities || []).map((activity, activityIndex) => (
                        <div
                          key={activityIndex}
                          className="border-l-2 border-blue-200 pl-4"
                        >
                          <p className="font-semibold text-slate-800">
                            {activity.time} — {activity.place}
                          </p>
                          <p className="mt-1 text-slate-600">
                            {activity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  No daily itinerary available.
                </p>
              )}
            </div>

            <div className="mt-10 rounded-2xl bg-green-50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                <Wallet className="text-green-600" />
                Estimated Budget
              </h3>

              <p className="text-slate-700">
                Total:{" "}
                <strong>
                  {estimatedBudget.total ?? "Not available"}
                </strong>
              </p>

              <p className="mt-2 text-slate-700">
                Per Person:{" "}
                <strong>
                  {estimatedBudget.perPerson ?? "Not available"}
                </strong>
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Travel Tips
              </h3>

              {travelTips.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-slate-700">
                  {travelTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No travel tips available.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // My Trips list view
  return (
    <section id="my-trips" className="bg-slate-50 px-4 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-3 font-semibold uppercase tracking-wider text-blue-600">
            Your travel collection
          </p>

          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            My Trips
          </h2>

          <p className="mt-3 text-slate-500">
            View and manage all your saved AI-generated travel plans.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-green-100 p-4 text-center text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-red-100 p-4 text-center text-red-700">
            {error}
            <button
              onClick={fetchTrips}
              className="ml-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {trips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Plane className="mx-auto mb-5 text-blue-500" size={45} />

            <h3 className="text-xl font-bold text-slate-900">
              No saved trips yet
            </h3>

            <p className="mt-2 text-slate-500">
              Generate your first AI-powered travel itinerary to see it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <MapPin className="mb-4" size={28} />

                  <h3 className="text-2xl font-bold capitalize">
                    {trip.destination}
                  </h3>

                  <p className="mt-2 text-sm text-blue-100">
                    {trip.budget} Plan
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-5 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={17} />
                      {trip.duration} Days
                    </span>

                    <span className="flex items-center gap-2">
                      <Users size={17} />
                      {trip.travelers} Travelers
                    </span>
                  </div>

                  <p className="mb-5 text-xs text-slate-400">
                    Created:{" "}
                    {trip.createdAt
                      ? new Date(trip.createdAt).toLocaleDateString()
                      : "Date unavailable"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTrip(trip)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      <Eye size={18} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditClick(trip)}
                      aria-label={`Edit trip to ${trip.destination}`}
                      className="flex items-center justify-center rounded-xl bg-blue-50 px-4 py-3 text-blue-600 hover:bg-blue-100"
                    >
                      <Pencil size={19} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(trip._id)}
                      disabled={deletingId === trip._id}
                      aria-label={`Delete trip to ${trip.destination}`}
                      className="flex items-center justify-center rounded-xl bg-red-50 px-4 py-3 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === trip._id ? (
                        <Loader2 className="animate-spin" size={19} />
                      ) : (
                        <Trash2 size={19} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyTrips;
