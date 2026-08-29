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
  getCountryLabelPosition,
  loadCountryBoundaries,
  type CountryBoundary,
} from '../../services/countryBoundaries';
import type { MapLayers, TravelPlace, TravelTrip } from '../../types/travel';

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
  layers:MapLayers;
  selectedTrip?:TravelTrip;
  allPlaces:TravelPlace[];
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
  { places, autoRotate, selected, onSelect, onEarthClick, onInteraction, layers, selectedTrip, allPlaces },
  ref,
) {
  const globe = useRef<GlobeMethods | undefined>(undefined);
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [countries, setCountries] = useState<CountryBoundary[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<CountryBoundary | null>(null);
  const tripStops=(selectedTrip?.stops.map(stop=>allPlaces.find(place=>place.id===stop.placeId)).filter((place):place is TravelPlace=>Boolean(place)))??[];
  const tripRoutes=tripStops.slice(0,-1).map((place,index)=>({startLat:place.latitude,startLng:place.longitude,endLat:tripStops[index+1].latitude,endLng:tripStops[index+1].longitude,name:`${place.name} → ${tripStops[index+1].name}`}));
  const countryCounts=(name:string)=>allPlaces.filter(place=>place.country===name);

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
        showAtmosphere={layers.atmosphere}
        atmosphereAltitude={0.18}
        polygonsData={layers.countryBorders||layers.visitedCountries||layers.wishlistCountries?countries:[]}
        polygonAltitude={(boundary: object) => boundary === hoveredCountry ? 0.008 : 0.006}
        polygonCapColor={(boundary: object) => {const matches=countryCounts(getCountryName(boundary as CountryBoundary));const visited=matches.some(place=>place.status==='visited'),wishlist=matches.some(place=>place.status==='want-to-visit');if(boundary===hoveredCountry)return'rgba(126,220,202,.14)';if(visited&&layers.visitedCountries)return'rgba(55,210,165,.10)';if(wishlist&&layers.wishlistCountries)return'rgba(255,177,69,.08)';return'rgba(255,255,255,.005)'}}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={(boundary: object) => !layers.countryBorders?'rgba(0,0,0,0)':boundary === hoveredCountry
          ? 'rgba(185, 246, 234, 0.92)'
          : 'rgba(210, 226, 238, 0.42)'}
        polygonLabel={(boundary: object) => {const name=getCountryName(boundary as CountryBoundary),matches=countryCounts(name);return`<b>${name}</b><br/>Visited places: ${matches.filter(place=>place.status==='visited').length}<br/>Wishlist: ${matches.filter(place=>place.status==='want-to-visit').length}`}}
        polygonsTransitionDuration={180}
        onPolygonHover={(boundary: object | null) => {
          setHoveredCountry(boundary as CountryBoundary | null);
        }}
        onPolygonClick={(
          _boundary: object,
          _event: MouseEvent,
          { lat, lng }: { lat: number; lng: number },
        ) => onEarthClick(lat, lng)}
        labelsData={layers.countryNames?countries.filter(country=>country.properties.LABEL_X!==undefined):[]}
        labelLat={(country:object)=>getCountryLabelPosition(country as CountryBoundary).lat}
        labelLng={(country:object)=>getCountryLabelPosition(country as CountryBoundary).lng}
        labelText={(country:object)=>getCountryName(country as CountryBoundary)}
        labelColor={()=> 'rgba(230,240,248,.72)'}
        labelSize={0.55}
        labelDotRadius={0}
        labelAltitude={0.012}
        arcsData={layers.tripRoutes?tripRoutes:[]}
        arcColor={()=>['rgba(95,225,193,.2)','rgba(95,225,193,.9)']}
        arcDashLength={0.35}
        arcDashGap={0.18}
        arcDashAnimateTime={1800}
        arcAltitudeAutoScale={0.22}
        htmlElementsData={[...places,...(layers.tripStops?tripStops.filter(stop=>!places.some(place=>place.id===stop.id)):[])]}
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
