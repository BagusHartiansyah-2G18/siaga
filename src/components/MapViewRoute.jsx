"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapViewRoute({ Dstart, Dend }) {
  const start = Dstart.lokasi;
  const end = Dend.lokasi;
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef([]);
  const stepMarkersRef = useRef([]);
  const [steps, setSteps] = useState([]);

  // custom icon start & end
  const startIcon = new L.Icon({
    iconUrl: "/Rmerah.webp", // simpan di /public
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  });

  const endIcon = new L.Icon({
    iconUrl: "/Rhijau.png", // simpan di /public
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  });

  // helper filter step
  const cleanSteps = (steps) => {
    return steps.filter((s) => {
      if (s.instruction.includes("jalan tanpa nama")) return false;
      if (s.instruction.toLowerCase().startsWith("continue")) return false;
      if (s.instruction.toLowerCase().startsWith("new name")) return false;
      return true;
    });
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map-route").setView(start, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;
    if (!map || !start || !end) return;

    // hapus route lama
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // hapus markers lama
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    stepMarkersRef.current.forEach((m) => map.removeLayer(m));
    stepMarkersRef.current = [];

    // fetch rute
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&steps=true&overview=full`
    )
      .then((res) => res.json())
      .then((data) => {
        const map = mapRef.current;
        if (!map || !data.routes?.length) return;

        const coords = data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);

        // polyline
        routeLayerRef.current = L.polyline(coords, {
          color: "blue",
          weight: 5,
        }).addTo(map);

        map.fitBounds(routeLayerRef.current.getBounds());

        // marker start & end pakai icon custom
        const startMarker = L.marker(start, { icon: startIcon })
          .addTo(map)
          // .bindTooltip(Dstart.nama, { permanent: true, direction: 'top' })
          .bindPopup(Dstart.nama);

        const endMarker = L.marker(end, { icon: endIcon })
          .addTo(map)
          .bindTooltip(Dend.nama, { permanent: true, direction: 'top' })
          .bindPopup(Dend.nama);

        markersRef.current.push(startMarker, endMarker);

        // steps
        const routeSteps = data.routes[0].legs[0].steps.map((s) => {
          const maneuver = s.maneuver;
          let instruction = "";

          if (maneuver.type === "depart") {
            instruction = "Mulai dari " + (s.name || "jalan tanpa nama");
          } else if (maneuver.type === "arrive") {
            instruction = "Tiba di tujuan";
          } else if (maneuver.type === "turn") {
            instruction = `Belok ${maneuver.modifier || ""} ke ${
              s.name || "jalan tanpa nama"
            }`;
          } else {
            instruction = (maneuver.type || "") + " " + (s.name || "");
          }

          return {
            instruction,
            distance: (s.distance / 1000).toFixed(2) + " km",
            duration: Math.round(s.duration / 60) + " min",
            location: [maneuver.location[1], maneuver.location[0]],
          };
        });

        const filtered = cleanSteps(routeSteps);
        setSteps(filtered);

        // marker step kecil
        filtered.forEach((step, i) => {
          const stepMarker = L.circleMarker(step.location, {
            radius: 5,
            color: "red",
            fillColor: "orange",
            fillOpacity: 0.8,
          })
            .addTo(map)
            .bindPopup(`${i + 1}. ${step.instruction} (${step.distance})`);
          stepMarkersRef.current.push(stepMarker);
        });
      })
      .catch((err) => console.error("Routing error:", err));

    return () => {
      const map = mapRef.current;
      if (map) {
        if (routeLayerRef.current) {
          map.removeLayer(routeLayerRef.current);
          routeLayerRef.current = null;
        }
        markersRef.current.forEach((m) => map.removeLayer(m));
        markersRef.current = [];
        stepMarkersRef.current.forEach((m) => map.removeLayer(m));
        stepMarkersRef.current = [];
      }
    };
  }, [start, end]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Map */}
      <div
        id="map-route"
        className="h-96 w-full rounded-xl shadow-md col-span-2"
      />

      {/* Directions */}
      <div className="bg-white bg-gray-800 p-4 rounded-xl shadow-md overflow-y-auto">
        <h2 className="font-semibold mb-2">Petunjuk Jalan</h2>
        <ol className="list-decimal pl-4 space-y-1 text-sm">
          {steps.map((s, i) => (
            <li key={i}>
              {s.instruction}
               {/* ({s.distance}, {s.duration}) */}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
