import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import type { TravelPlace } from '../../types/travel';

export interface GlobeHandle {
  flyTo: (lat: number, lng: number, altitude?: number) => void;
  zoom: (delta: number) => void;
  reset: () => void;
}

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

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    if (wrap.current) resizeObserver.observe(wrap.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const controls = globe.current?.controls();
    if (!controls) return;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
  }, [autoRotate]);

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, altitude = 1.65) {
      globe.current?.pointOfView({ lat, lng, altitude }, 1300);
    },
    zoom(delta) {
      const currentView = globe.current?.pointOfView();
      if (!currentView) return;
      globe.current?.pointOfView(
        {
          ...currentView,
          altitude: Math.max(0.7, Math.min(3.5, currentView.altitude + delta)),
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
