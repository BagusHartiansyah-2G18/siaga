"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Patch: cegah error removeLayer kalau map sudah null
if (L.Routing && L.Routing.Line) {
  const origOnRemove = L.Routing.Line.prototype.onRemove;
  L.Routing.Line.prototype.onRemove = function (map) {
    try {
      if (origOnRemove) origOnRemove.call(this, map);
    } catch (e) {
      // ignore "removeLayer of null" errors
      // console.warn("safe removeLine:", e);
    }
  };
}

export default function MapViewWithRoute({ start, end }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const routingRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(start ?? [-6.2, 106.8], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !start || !end) return;

    // hapus routing lama kalau ada
    if (routingRef.current) {
      try {
        map.removeControl(routingRef.current);
      } catch (e) {}
      routingRef.current = null;
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      draggableWaypoints: false,
      addWaypoints: false,
      showAlternatives: false,
      lineOptions: { styles: [{ color: "#1E40AF", weight: 5 }] },
      createMarker: () => null,
    }).addTo(map);

    routingRef.current = control;

    return () => {
      if (routingRef.current) {
        try {
          map.removeControl(routingRef.current);
        } catch (e) {}
        routingRef.current = null;
      }
    };
  }, [start, end]);

  return <div ref={containerRef} className="h-96 w-full rounded-xl shadow-md" />;
}
