
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default map position: India
const DEFAULT_CENTER = [20.5937, 78.9629];

// Custom blue location marker
const locationIcon = L.divIcon({
  className: "custom-map-marker",
  html: `
    <div style="
      width: 18px;
      height: 18px;
      background: #06b6d4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Automatically adjust the map to show all markers
function FitMapBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const bounds = L.latLngBounds(
      points.map((point) => [point.lat, point.lon])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 12,
    });
  }, [points, map]);

  return null;
}

function TripMap({ destination, dailyItinerary = [] }) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function findLocations() {
      if (!destination) return;

      setLoading(true);
      setMapError("");
      setPoints([]);

      // Collect the destination and activity locations
      const places = [
        destination,
        ...dailyItinerary.flatMap((day) =>
          (day.activities || []).map((activity) => activity.place)
        ),
      ]
        .filter(Boolean)
        .map((place) => String(place).trim())
        .filter((place, index, array) =>
          array.findIndex(
            (item) => item.toLowerCase() === place.toLowerCase()
          ) === index
        )
        .slice(0, 8);

      const foundPoints = [];

      try {
        // Search one location at a time to respect OpenStreetMap limits
        for (let i = 0; i < places.length; i++) {
          if (cancelled) return;

          const place = places[i];

          const searchQuery =
            i === 0 ? place : `${place}, ${destination}`;

          const url = new URL(
            "https://nominatim.openstreetmap.org/search"
          );

          url.searchParams.set("q", searchQuery);
          url.searchParams.set("format", "jsonv2");
          url.searchParams.set("limit", "1");

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Location search is temporarily unavailable.");
          }

          const results = await response.json();

          if (results.length > 0) {
            foundPoints.push({
              name: place,
              lat: Number(results[0].lat),
              lon: Number(results[0].lon),
            });
          }

          setPoints([...foundPoints]);

          // Wait before the next search
          if (i < places.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1100));
          }
        }

        if (!cancelled && foundPoints.length === 0) {
          setMapError(
            "We couldn't find these locations on the map. Try another destination."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setMapError(error.message || "Unable to load map locations.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    findLocations();

    return () => {
      cancelled = true;
    };
  }, [destination, dailyItinerary]);

  const center =
    points.length > 0
      ? [points[0].lat, points[0].lon]
      : DEFAULT_CENTER;

  return (
    <section className="w-full my-12">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📍</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Explore Your Trip on Map
          </h2>
        </div>

        <p className="text-slate-600">
          Discover the places included in your AI-generated itinerary.
        </p>
      </div>

      {loading && (
        <p className="mb-3 text-cyan-700 font-medium">
          Finding your trip locations...
        </p>
      )}

      {mapError && (
        <p className="mb-3 text-amber-700 bg-amber-50 p-3 rounded-xl">
          {mapError}
        </p>
      )}

      <div
  style={{ height: "450px" }}
  className="w-full overflow-hidden rounded-3xl border border-slate-200 shadow-lg"
>
        <MapContainer
          center={center}
          zoom={points.length > 0 ? 10 : 4}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map((point, index) => (
            <Marker
              key={`${point.name}-${index}`}
              position={[point.lat, point.lon]}
              icon={locationIcon}
            >
              <Popup>
                <strong>{point.name}</strong>
              </Popup>
            </Marker>
          ))}

          {points.length > 1 && (
            <Polyline
              positions={points.map((point) => [
                point.lat,
                point.lon,
              ])}
              pathOptions={{
                color: "#06b6d4",
                weight: 4,
                opacity: 0.7,
                dashArray: "8 8",
              }}
            />
          )}

          <FitMapBounds points={points} />
        </MapContainer>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Map data © OpenStreetMap contributors. The connecting line is
        illustrative, not a verified travel route.
      </p>

      {points.length > 0 && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {points.map((point, index) => (
            <div
              key={`${point.name}-label-${index}`}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold">
                {index + 1}
              </span>

              <span className="text-sm font-medium text-slate-800">
                {point.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TripMap;
