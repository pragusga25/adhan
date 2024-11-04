'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const GlobeVisualization = dynamic(
  () => import('@/components/globe-visualization'),
  {
    ssr: false,
  }
);

export default function BannerPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-[1200px] mx-auto h-screen bg-background overflow-hidden">
      {/* Theme toggle for testing */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 z-50"
      >
        {theme === 'dark' ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>

      {/* Background Globe */}
      <div className="absolute inset-0 opacity-50">
        <GlobeVisualization
          cities={[
            {
              name: 'Mecca',
              country: 'Saudi Arabia',
              lat: 21.4225,
              lng: 39.8262,
              isActive: true,
            },
            {
              name: 'Jakarta',
              country: 'Indonesia',
              lat: -6.2088,
              lng: 106.8456,
              isActive: true,
            },
            {
              name: 'Istanbul',
              country: 'Turkey',
              lat: 41.0082,
              lng: 28.9784,
              isActive: true,
            },
          ]}
          focusedCity={null}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col items-center justify-center px-12 text-center">
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 text-transparent bg-clip-text">
            Global Adhan Visualization
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Experience the continuous symphony of the call to prayer as it
            echoes across time zones, connecting the global Muslim community in
            real-time.
          </p>
        </div>
      </div>

      {/* Bottom Attribution */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-lg text-muted-foreground">
          Built by Taufik with Next.js & Globe.gl
        </p>
      </div>
    </div>
  );
}
