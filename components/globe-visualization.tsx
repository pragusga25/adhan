'use client';

import { useEffect, useRef } from 'react';
import Globe, { GlobeInstance } from 'globe.gl';
import { useTheme } from 'next-themes';

export type City = {
  name: string;
  country: string;
  lat: number;
  lng: number;
  isActive: boolean;
  activePrayer?: string;
};

export default function GlobeVisualization({
  cities,
  focusedCity,
}: {
  cities: City[];
  focusedCity: City | null;
}) {
  const globeRef = useRef<GlobeInstance>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (focusedCity && globeRef.current) {
      const { lat, lng } = focusedCity;
      globeRef.current.pointOfView(
        {
          lat,
          lng,
          altitude: 1.5,
        },
        1000
      );
    }
  }, [focusedCity]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current
        .pointsData(
          cities.map((city) => {
            let color = city.isActive
              ? theme === 'dark'
                ? '#4ade80'
                : '#16a34a' // Brighter green in dark mode
              : theme === 'dark'
              ? '#374151'
              : '#94a3b8'; // More subtle when inactive

            return {
              ...city,
              alt: city.isActive ? 0.1 : 0.01,
              rad: city.isActive ? 0.5 : 0.3,
              color,
            };
          })
        )
        .htmlElementsData(cities.filter((city) => city.isActive))
        .htmlElement((d) => {
          const data = d as City;
          const place = `${data.name}, ${data.country}`;
          const el = document.createElement('div');
          el.className = 'absolute pointer-events-none';
          el.style.color = theme === 'dark' ? '#4ade80' : '#16a34a';
          el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-current rounded-full opacity-20 animate-ping"></div>
            <div class="relative z-10 p-2 text-xs font-bold">${place}</div>
          </div>
        `;
          return el;
        })
        .htmlAltitude(0.2);
    }
  }, [cities]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const ringsData = cities
      .filter((city) => city.isActive)
      .map((city) => ({
        lat: city.lat,
        lng: city.lng,
        maxR: 3,
        propagationSpeed: 2,
        repeatPeriod: 1000,
        color:
          theme === 'dark'
            ? 'rgba(34, 197, 94, 0.8)'
            : 'rgba(21, 128, 61, 0.8)', // More opaque green
      }));

    const globe = Globe()
      .globeImageUrl(
        theme === 'dark' ? '/earth-night.jpg' : '/earth-blue-marble.jpg'
      )
      .backgroundColor('rgba(0,0,0,0)')
      // Points configuration
      .pointsData(
        cities.map((city) => {
          let color = city.isActive
            ? theme === 'dark'
              ? '#4ade80'
              : '#16a34a' // Brighter green in dark mode
            : theme === 'dark'
            ? '#374151'
            : '#94a3b8'; // More subtle when inactive

          return {
            ...city,
            alt: city.isActive ? 0.1 : 0.01,
            rad: city.isActive ? 0.5 : 0.3,
            color,
          };
        })
      )
      .pointLat('lat')
      .pointLng('lng')
      .pointColor('color')
      .pointAltitude('alt')
      .pointRadius('rad')
      .pointsMerge(true)
      // Rings configuration
      .ringsData(ringsData)
      .ringColor('color')
      .ringMaxRadius('maxR')
      .ringPropagationSpeed('propagationSpeed')
      .ringRepeatPeriod('repeatPeriod')
      // Atmosphere configuration
      .atmosphereColor(theme === 'dark' ? '#1a1b1e' : '#4b5563')
      .atmosphereAltitude(0.25)
      // HTML element configuration for labels
      .htmlElementsData(cities.filter((city) => city.isActive))
      .htmlElement((d) => {
        const data = d as City;
        const place = `${data.name}, ${data.country}`;
        const el = document.createElement('div');
        el.className = 'absolute pointer-events-none';
        el.style.color = theme === 'dark' ? '#4ade80' : '#16a34a';
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-current rounded-full opacity-20 animate-ping"></div>
            <div class="relative z-10 p-2 text-xs font-bold">${place}</div>
          </div>
        `;
        return el;
      })
      .htmlAltitude(0.2);

    globe(currentContainer);
    globeRef.current = globe;

    const handleResize = () => {
      if (containerRef.current) {
        globe.width(containerRef.current.clientWidth);
        globe.height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    // Adjust camera position for better view
    globe.pointOfView({ altitude: 2.5 });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        globeRef.current = undefined;
      }
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [theme]);

  return <div ref={containerRef} className="w-full h-full" />;
}
