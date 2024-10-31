'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { MoonIcon, SunIcon, SearchIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cities } from '@/lib/cities';
import { calculatePrayerTimes } from '@/lib/prayer-times';
import { City } from '@/components/globe-visualization';

const GlobeVisualization = dynamic(
  () => import('@/components/globe-visualization'),
  {
    ssr: false,
  }
);

const CITIES = cities
  .map((city) => ({
    name: city.name,
    country: city.country,
    lat: city.coordinates[0],
    lng: city.coordinates[1],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCities, setActiveCities] = useState<City[]>([]);
  const [focusedCity, setFocusedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    setMounted(true);
    updateActiveCities();
    const interval = setInterval(updateActiveCities, 1000 * 10); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const updateActiveCities = () => {
    const now = new Date();
    const active = CITIES.map((city) => {
      const prayerTimes = calculatePrayerTimes(city.lat, city.lng, now);
      let isActive = false;
      let activePrayer: string | undefined;
      let nextPrayer: { type: string; time: Date } | undefined;

      // prayerTimes.some((prayer) => {
      //   if (!prayer.time) return false;
      //   const diff = now.getTime() - prayer.time.getTime();
      //   if (diff >= 0 && diff <= 60 * 1000 * 5) {
      //     // Within 5 minutes
      //     isActive = true;
      //     activePrayer = prayer.type;
      //     return true;
      //   }
      //   return false;
      // });

      // Find current and next prayer times
      for (let i = 0; i < prayerTimes.length; i++) {
        const prayer = prayerTimes[i];
        if (!prayer.time) continue;

        const timeDiff = now.getTime() - prayer.time.getTime();

        // Check if within 15 minutes before or after prayer time
        if (timeDiff >= 0 && timeDiff <= 60 * 1000 * 5) {
          isActive = true;
          activePrayer = prayer.type;
        }

        // Find next prayer
        if (timeDiff < 0) {
          nextPrayer = {
            type: prayer.type,
            time: prayer.time,
          };
          break;
        }
      }

      return {
        ...city,
        isActive,
        activePrayer,
        nextPrayer,
      };
    });
    setActiveCities(active);
  };

  const filteredCities = activeCities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && city.isActive) ||
      (activeTab === 'inactive' && !city.isActive);
    return matchesSearch && matchesTab;
  });

  const handleCityClick = (city: City) => {
    setFocusedCity(city);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Global Adhan Visualization
          </h1>
          <p className="text-muted-foreground">
            Witness the continuous call to prayer as it echoes around the world
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 lg:col-span-2 p-4 h-[600px] relative">
            <GlobeVisualization
              cities={activeCities}
              focusedCity={focusedCity}
            />
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search places..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="h-[450px] overflow-y-auto space-y-3">
                    {filteredCities.map((city) => (
                      <CityCard
                        key={city.name}
                        city={city}
                        onClick={handleCityClick}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="active" className="mt-4">
                  <div className="h-[450px] overflow-y-auto space-y-3">
                    {filteredCities
                      .filter((city) => city.isActive)
                      .map((city) => (
                        <CityCard
                          key={city.name}
                          city={city}
                          onClick={handleCityClick}
                        />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="inactive" className="mt-4">
                  <div className="h-[450px] overflow-y-auto space-y-3">
                    {filteredCities
                      .filter((city) => !city.isActive)
                      .map((city) => (
                        <CityCard
                          key={city.name}
                          city={city}
                          onClick={handleCityClick}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function CityCard({
  city,
  onClick,
}: {
  city: City;
  onClick: (city: City) => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onClick(city)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(city);
        }
      }}
    >
      <div>
        <p className="font-medium">{city.name}</p>
        <p className="text-sm text-muted-foreground mb-1">{city.country}</p>
        {city.isActive ? (
          <p className="text-sm font-medium text-green-600 dark:text-green-500">
            {city.activePrayer} Prayer
          </p>
        ) : (
          city.nextPrayer && (
            <p className="text-sm text-muted-foreground">
              Next: {city.nextPrayer.type} (
              {new Date(city.nextPrayer.time).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
              )
            </p>
          )
        )}
      </div>
      {city.isActive && (
        <div className="animate-pulse w-3 h-3 rounded-full bg-green-500" />
      )}
    </div>
  );
}
