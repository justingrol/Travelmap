import { useMemo, useRef, useState } from 'react';
import { BarChart3, Globe2, Map, MapPin, Plus, Search } from 'lucide-react';
import { TravelGlobe, type GlobeHandle } from './components/globe/TravelGlobe';
import { GlobeControls } from './components/globe/GlobeControls';
import { AllPlaces } from './components/places/AllPlaces';
import { AddPlaceForm } from './components/places/AddPlaceForm';
import { PlaceDetails } from './components/places/PlaceDetails';
import { LocationSearch } from './components/search/LocationSearch';
import { TravelSidebar } from './components/sidebar/TravelSidebar';
import { TravelStats } from './components/stats/TravelStats';
import { useTravelPlaces } from './hooks/useTravelPlaces';
import type { SearchResult } from './services/geocoding';
import type { PlaceDraft, PlaceFilter, TravelPlace } from './types/travel';

type Panel = 'places' | 'search' | 'stats' | 'add' | null;
type Page = 'globe' | 'all-places';

export function App() {
  const { places, add, update, remove } = useTravelPlaces();
  const globe = useRef<GlobeHandle>(null);
  const [page, setPage] = useState<Page>('globe');
  const [panel, setPanel] = useState<Panel>('places');
  const [selected, setSelected] = useState<TravelPlace>();
  const [statusFilter, setStatusFilter] = useState<PlaceFilter>('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [autoRotate, setAutoRotate] = useState(true);
  const [draft, setDraft] = useState<Partial<TravelPlace>>();

  const countries = useMemo(
    () => [...new Set(places.map((place) => place.country))].sort(),
    [places],
  );
  const visiblePlaces = useMemo(() => places
    .filter((place) => statusFilter === 'all' || place.status === statusFilter)
    .filter((place) => countryFilter === 'all' || place.country === countryFilter),
  [places, statusFilter, countryFilter]);

  const openOnGlobe = (place: TravelPlace) => {
    setPage('globe');
    setSelected(place);
    setPanel(null);
    window.setTimeout(() => globe.current?.flyTo(place.latitude, place.longitude), 50);
  };
  const selectGlobePlace = (place: TravelPlace) => {
    setSelected(place);
    setPanel(null);
    globe.current?.flyTo(place.latitude, place.longitude);
  };
  const startAdd = (initial: Partial<TravelPlace>) => {
    setDraft(initial);
    setPanel('add');
  };
  const savePlace = (place: PlaceDraft) => {
    if (draft?.id) {
      update(draft.id, place);
      setSelected({ ...draft, ...place } as TravelPlace);
    } else add(place);
    setPanel(null);
    setDraft(undefined);
    if (page === 'globe') globe.current?.flyTo(place.latitude, place.longitude);
  };
  const selectWorldResult = (result: SearchResult) => {
    setPage('globe');
    window.setTimeout(() => globe.current?.flyTo(result.latitude, result.longitude, 1.35), 50);
    startAdd({ ...result, status: 'want-to-visit', tags: [], photos: [] });
  };

  return (
    <main className={page === 'all-places' ? 'collection-mode' : ''}>
      <div className="stars" />
      {page === 'globe' && (
        <TravelGlobe
          ref={globe}
          places={visiblePlaces}
          selected={selected}
          autoRotate={autoRotate}
          onSelect={selectGlobePlace}
          onEarthClick={(latitude, longitude) => startAdd({ latitude, longitude, status: 'want-to-visit', tags: [], photos: [] })}
          onInteraction={() => setAutoRotate(false)}
        />
      )}

      <nav>
        <button className="brand" onClick={() => { setPage('globe'); window.setTimeout(() => globe.current?.reset(), 50); }}>
          <span><Globe2 /></span><b>Travel<span>Globe</span></b>
        </button>
        <div className="nav-actions">
          <button className={page === 'globe' ? 'current' : ''} onClick={() => setPage('globe')}><Globe2 /><span>Globe</span></button>
          <button className={page === 'all-places' ? 'current' : ''} onClick={() => { setPage('all-places'); setPanel(null); }}><Map /><span>All places</span></button>
          <button onClick={() => setPanel(panel === 'search' ? null : 'search')}><Search /><span>Search</span></button>
          <button onClick={() => setPanel(panel === 'stats' ? null : 'stats')}><BarChart3 /><span>Stats</span></button>
          <button className="add" onClick={() => startAdd({ latitude: 0, longitude: 0, status: 'want-to-visit', tags: [], photos: [] })}><Plus /><span>Add place</span></button>
        </div>
      </nav>

      {page === 'globe' ? (
        <>
          <div className="hero-copy"><span>YOUR WORLD, REMEMBERED</span><h1>Explore the places<br />that <i>move you.</i></h1><p>Drag to discover · Scroll to zoom · Click Earth to save</p></div>
          <div className="legend"><span><i className="visited" />Visited</span><span><i className="want" />Want to visit</span><b>{visiblePlaces.length} destinations</b></div>
          <GlobeControls onReset={() => globe.current?.reset()} onZoom={(amount) => globe.current?.zoom(amount)} auto={autoRotate} onAuto={() => setAutoRotate((value) => !value)} onCenter={() => selected && globe.current?.flyTo(selected.latitude, selected.longitude)} />
          <TravelSidebar open={panel === 'places'} onClose={() => setPanel(null)} places={visiblePlaces} onPick={selectGlobePlace} filter={statusFilter} setFilter={setStatusFilter} country={countryFilter} countries={countries} setCountry={setCountryFilter} />
        </>
      ) : (
        <AllPlaces places={places} statusFilter={statusFilter} countryFilter={countryFilter} countries={countries} onStatusChange={setStatusFilter} onCountryChange={setCountryFilter} onOpen={setSelected} onViewGlobe={openOnGlobe} />
      )}

      {selected && panel !== 'add' && <PlaceDetails place={selected} onClose={() => setSelected(undefined)} onDelete={() => { remove(selected.id); setSelected(undefined); }} onEdit={() => startAdd(selected)} onToggle={() => { const status = selected.status === 'visited' ? 'want-to-visit' : 'visited'; update(selected.id, { status, visitedDate: status === 'visited' ? new Date().toISOString().slice(0, 10) : undefined }); setSelected({ ...selected, status }); }} />}
      {panel === 'add' && <AddPlaceForm initial={draft} onClose={() => setPanel(null)} onSave={savePlace} />}
      {panel === 'search' && <LocationSearch saved={places} onClose={() => setPanel(null)} onPick={openOnGlobe} onWorldPick={selectWorldResult} />}
      {panel === 'stats' && <TravelStats places={places} onClose={() => setPanel(null)} />}
      {page === 'globe' && <button className="mobile-add" onClick={() => startAdd({ latitude: 0, longitude: 0, status: 'want-to-visit', tags: [], photos: [] })}><MapPin /> Save a place</button>}
    </main>
  );
}
