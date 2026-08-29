import { useEffect, useMemo, useRef, useState } from 'react';
import { discoverPlacePhotos } from '../services/photoDiscovery';
import { travelStorage } from '../services/travelStorage';
import type { PlaceDraft, TravelPlace } from '../types/travel';

const MINIMUM_BUILT_IN_PHOTOS = 3;

export function useTravelPlaces() {
  const [places, setPlaces] = useState<TravelPlace[]>(() => travelStorage.load());
  const requestedPhotos = useRef(new Set<string>());

  useEffect(() => travelStorage.save(places), [places]);

  useEffect(() => {
    const candidates = places
      .filter((place) => place.photos.length < MINIMUM_BUILT_IN_PHOTOS)
      .filter((place) => !requestedPhotos.current.has(place.id))
      .slice(0, 3);
    if (!candidates.length) return;

    const controller = new AbortController();
    candidates.forEach((place) => requestedPhotos.current.add(place.id));
    Promise.all(candidates.map(async (place) => ({
      id: place.id,
      photos: await discoverPlacePhotos(
        place.name,
        place.country,
        MINIMUM_BUILT_IN_PHOTOS - place.photos.length,
        controller.signal,
      ),
    }))).then((results) => {
      setPlaces((current) => current.map((place) => {
        const discovered = results.find((result) => result.id === place.id)?.photos ?? [];
        if (!discovered.length) return place;
        const existingIds = new Set(place.photos.map((photo) => photo.id));
        const additions = discovered.filter((photo) => !existingIds.has(photo.id));
        return {
          ...place,
          photos: [...place.photos, ...additions].map((photo, index) => ({
            ...photo,
            isCover: index === 0,
          })),
        };
      }));
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.warn('Travel Globe: place imagery unavailable', error);
    });
    return () => controller.abort();
  }, [places]);

  return {
    places,
    add: (draft: PlaceDraft) => setPlaces((current) => [...current, {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]),
    update: (id: string, patch: Partial<TravelPlace>) => setPlaces((current) => current.map((place) => place.id === id ? {
      ...place,
      ...patch,
      updatedAt: new Date().toISOString(),
    } : place)),
    remove: (id: string) => setPlaces((current) => current.filter((place) => place.id !== id)),
    countries: useMemo(() => new Set(places
      .filter((place) => place.status === 'visited')
      .map((place) => place.country)).size, [places]),
  };
}
