import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import {
  getCountryName,
  loadCountryBoundaries,
  type CountryBoundary,
} from '../../services/countryBoundaries';
import type { TravelPlace } from '../../types/travel';

export interface GlobeHandle {
  flyTo: (lat: number, lng: number, altitude?: number) => void;
  zoom: (delta: number) => void;
  reset: () => void;
}

const GLOBE_RADIUS = 100;
const MIN_CAMERA_DISTANCE = 101.5;
const MIN_ALTITUDE = (MIN_CAMERA_DISTANCE / GLOBE_RADIUS) - 1;

interface Props {
  places: TravelPlace[];
  autoRotate: boolean;
  selected?: TravelPlace;
  onSelect: (place: TravelPlace) => void;
  onEarthClick: (lat: number, lng: number) => void;
  onInteraction: () => void;
}

function createMarker(place: TravelPlace, onSelect: (place: TravelPlace) => void) {
  const root = document.createElement('button');
  root.type = 'button';
  root.className = `globe-marker ${place.status}`;
  root.setAttribute('aria-label', `Open ${place.name}`);
  root.addEventListener('click', (event) => {
    event.stopPropagation();
    onSelect(place);
  });

  const dot = document.createElement('span');
  const tooltip = document.createElement('div');
  tooltip.className = 'marker-tip';

  const cover = place.photos.find((photo) => photo.isCover) ?? place.photos[0];
  if (cover) {
    const image = document.createElement('img');
    image.src = cover.url;
    image.alt = '';
    tooltip.append(image);
  }

  const name = document.createElement('b');
  name.textContent = place.name;
  const description = document.createElement('small');
  description.textContent = `${place.country} · ${place.status === 'visited' ? 'Visited' : 'Bucket list'}`;
  tooltip.append(name, description);
  root.append(dot, tooltip);
  return root;
}

export const TravelGlobe = forwardRef<GlobeHandle, Props>(function TravelGlobe(
  { places, autoRotate, selected, onSelect, onEarthClick, onInteraction },
  ref,
) {
  const globe = useRef<GlobeMethods | undefined>(undefined);
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [countries, setCountries] = useState<CountryBoundary[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<CountryBoundary | null>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    if (wrap.current) resizeObserver.observe(wrap.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadCountryBoundaries(controller.signal)
      .then(setCountries)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        // Borders are an enhancement: texture, markers and navigation stay usable
        // if the public Natural Earth file is temporarily unavailable.
        console.warn('Travel Globe: country boundaries unavailable', error);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controls = globe.current?.controls();
    if (!controls) return;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.minDistance = MIN_CAMERA_DISTANCE;
    controls.maxDistance = 450;
  }, [autoRotate]);

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, altitude = 0.22) {
      globe.current?.pointOfView({ lat, lng, altitude }, 1300);
    },
    zoom(delta) {
      const currentView = globe.current?.pointOfView();
      if (!currentView) return;
      globe.current?.pointOfView(
        {
          ...currentView,
          altitude: Math.max(MIN_ALTITUDE, Math.min(3.5, currentView.altitude + delta)),
        },
        300,
      );
    },
    reset() {
      globe.current?.pointOfView({ lat: 18, lng: 10, altitude: 2.25 }, 1000);
    },
  }), []);

  return (
    <div className="globe-wrap" ref={wrap} onPointerDown={onInteraction}>
      <Globe
        ref={globe}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#58a6ff"
        atmosphereAltitude={0.18}
        polygonsData={countries}
        polygonAltitude={(boundary: object) => boundary === hoveredCountry ? 0.008 : 0.006}
        polygonCapColor={(boundary: object) => boundary === hoveredCountry
          ? 'rgba(126, 220, 202, 0.10)'
          : 'rgba(255, 255, 255, 0.005)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={(boundary: object) => boundary === hoveredCountry
          ? 'rgba(185, 246, 234, 0.92)'
          : 'rgba(210, 226, 238, 0.42)'}
        polygonLabel={(boundary: object) => getCountryName(boundary as CountryBoundary)}
        polygonsTransitionDuration={180}
        onPolygonHover={(boundary: object | null) => {
          setHoveredCountry(boundary as CountryBoundary | null);
        }}
        onPolygonClick={(
          _boundary: object,
          _event: MouseEvent,
          { lat, lng }: { lat: number; lng: number },
        ) => onEarthClick(lat, lng)}
        htmlElementsData={places}
        htmlLat="latitude"
        htmlLng="longitude"
        htmlAltitude={0.025}
        htmlElement={(datum: object) => createMarker(datum as TravelPlace, onSelect)}
        onGlobeClick={({ lat, lng }: { lat: number; lng: number }) => onEarthClick(lat, lng)}
        htmlElementVisibilityModifier={(element: HTMLElement, visible: boolean) => {
          element.style.opacity = visible ? '1' : '0';
          element.style.pointerEvents = visible ? 'auto' : 'none';
        }}
      />
      {selected && (
        <div className="selection-label">
          Exploring <b>{selected.name}</b>
        </div>
      )}
    </div>
  );
});
