import { City } from '../types/City';

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  export function findNearestCities(selectedCity: City, cities: City[], count: number = 4): City[] {
    return cities
      .filter(city => city.name !== selectedCity.name)
      .map(city => ({
        ...city,
        distance: calculateDistance(
          parseFloat(selectedCity.lat),
          parseFloat(selectedCity.lng),
          parseFloat(city.lat),
          parseFloat(city.lng)
        ),
      }))
      .sort((a, b) => a.distance! - b.distance!)
      .slice(0, count);
  }