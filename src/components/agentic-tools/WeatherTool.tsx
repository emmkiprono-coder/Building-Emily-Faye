"use client";

import { Cloud, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Meta, Weather } from "@/types/project";

interface NoaaPoint {
  properties: { forecast: string };
}
interface NoaaForecast {
  properties: {
    periods: {
      name: string;
      temperature: number;
      shortForecast: string;
      windSpeed: string;
      probabilityOfPrecipitation?: { value: number | null };
      detailedForecast: string;
    }[];
  };
}

export function WeatherTool({
  meta,
  setMeta,
}: {
  meta: Meta;
  setMeta: (updater: (prev: Meta) => Meta) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      // Montrose Harbor Chicago: 41.96, -87.63
      const res = await fetch("https://api.weather.gov/points/41.96,-87.63");
      if (!res.ok) throw new Error(`NOAA points: ${res.status}`);
      const pointData = (await res.json()) as NoaaPoint;
      const forecastRes = await fetch(pointData.properties.forecast);
      if (!forecastRes.ok)
        throw new Error(`NOAA forecast: ${forecastRes.status}`);
      const forecastData = (await forecastRes.json()) as NoaaForecast;
      const today = forecastData.properties.periods[0];
      const weather: Weather = {
        tempF: today.temperature,
        condition: today.shortForecast,
        windMph: parseInt(today.windSpeed.split(" ")[0]) || 0,
        precipChance: today.probabilityOfPrecipitation?.value ?? 0,
        detailed: today.detailedForecast,
        period: today.name,
        fetchedAt: new Date().toISOString(),
      };
      setMeta((prev) => ({
        ...prev,
        weather,
        weatherFetchedAt: weather.fetchedAt,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("NOAA fetch failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-parchment">
        Montrose Harbor Weather
      </h3>
      <button
        onClick={fetchWeather}
        disabled={loading}
        className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
      >
        {loading ? (
          <Loader2 size={14} className="spin" />
        ) : (
          <Cloud size={14} />
        )}
        Fetch NOAA forecast
      </button>
      {error && <p className="text-xs text-coral">{error}</p>}
      {meta.weather && (
        <div
          className="p-4 rounded-lg space-y-2 text-sm text-parchment"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          <div>
            <strong>{meta.weather.period}</strong>
          </div>
          <div>
            {meta.weather.tempF}°F · {meta.weather.condition}
          </div>
          <div className="text-sand">
            {meta.weather.windMph} mph wind · {meta.weather.precipChance}%
            precip
          </div>
          <div className="text-xs mt-2 text-sand">{meta.weather.detailed}</div>
          <div className="text-xs mt-2 text-brass font-mono">
            Fetched: {new Date(meta.weather.fetchedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
