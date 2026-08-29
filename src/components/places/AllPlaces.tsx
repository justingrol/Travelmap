import { ArrowUpDown, MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { PlaceFilter, TravelPlace } from '../../types/travel';

type SortOption = 'name' | 'country' | 'recent' | 'status';

interface Props {
  places: TravelPlace[];
  statusFilter: PlaceFilter;
  countryFilter: string;
  countries: string[];
  onStatusChange: (filter: PlaceFilter) => void;
  onCountryChange: (country: string) => void;
  onOpen: (place: TravelPlace) => void;
  onViewGlobe: (place: TravelPlace) => void;
}

export function AllPlaces({
  places,
  statusFilter,
  countryFilter,
  countries,
  onStatusChange,
  onCountryChange,
  onOpen,
  onViewGlobe,
}: Props) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState<SortOption>('name');

  const regions = useMemo(() => [...new Set(places
    .filter((place) => countryFilter === 'all' || place.country === countryFilter)
    .map((place) => place.region)
    .filter((value): value is string => Boolean(value)))].sort(), [places, countryFilter]);
  const tags = useMemo(() => [...new Set(places.flatMap((place) => place.tags))].sort(), [places]);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return places
      .filter((place) => statusFilter === 'all' || place.status === statusFilter)
      .filter((place) => countryFilter === 'all' || place.country === countryFilter)
      .filter((place) => region === 'all' || place.region === region)
      .filter((place) => tag === 'all' || place.tags.includes(tag))
      .filter((place) => !normalizedQuery || place.name.toLocaleLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        if (sort === 'country') return a.country.localeCompare(b.country) || a.name.localeCompare(b.name);
        if (sort === 'recent') return b.createdAt.localeCompare(a.createdAt);
        if (sort === 'status') return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });
  }, [places, statusFilter, countryFilter, region, tag, query, sort]);

  return (
    <section className="all-places-page">
      <header className="collection-heading">
        <div>
          <span className="eyebrow">YOUR TRAVEL COLLECTION</span>
          <h1>All places</h1>
          <p>{filteredPlaces.length} of {places.length} destinations</p>
        </div>
        <label className="collection-search">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search destinations"
            aria-label="Search destinations by name"
          />
        </label>
      </header>

      <div className="collection-filters" aria-label="Destination filters">
        <div className="collection-status">
          {(['all', 'want-to-visit', 'visited'] as PlaceFilter[]).map((filter) => (
            <button
              key={filter}
              className={statusFilter === filter ? 'active' : ''}
              onClick={() => onStatusChange(filter)}
            >
              {filter === 'all' ? 'All' : filter === 'visited' ? 'Visited' : 'Want to visit'}
            </button>
          ))}
        </div>
        <select value={countryFilter} onChange={(event) => { onCountryChange(event.target.value); setRegion('all'); }} aria-label="Filter by country">
          <option value="all">All Countries</option>
          {countries.map((country) => <option key={country}>{country}</option>)}
        </select>
        <select value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Filter by province or region">
          <option value="all">All Regions</option>
          {regions.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={tag} onChange={(event) => setTag(event.target.value)} aria-label="Filter by tag">
          <option value="all">All Tags</option>
          {tags.map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="sort-select"><ArrowUpDown /><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Sort destinations"><option value="name">Name A–Z</option><option value="country">Country</option><option value="recent">Recently added</option><option value="status">Travel status</option></select></label>
      </div>

      {filteredPlaces.length ? (
        <div className="collection-grid">
          {filteredPlaces.map((place) => {
            const cover = place.photos.find((photo) => photo.isCover) ?? place.photos[0];
            return (
              <article className="collection-card" key={place.id}>
                <button className="collection-card-main" onClick={() => onOpen(place)} aria-label={`Open details for ${place.name}`}>
                  <div className="collection-photo">{cover ? <img src={cover.url} alt={place.name} loading="lazy" /> : <MapPin />}</div>
                  <div className="collection-card-body">
                    <span className={`status-dot ${place.status}`} />
                    <small>{place.status === 'visited' ? 'Visited' : 'Want to visit'}</small>
                    <h2>{place.name}</h2>
                    <p className="collection-location">{[place.region, place.country].filter(Boolean).join(', ')}</p>
                    <p className="collection-notes">{place.notes || 'No notes added yet.'}</p>
                    <div className="tags">{place.tags.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
                  </div>
                </button>
                <button className="view-globe" onClick={() => onViewGlobe(place)}><MapPin /> View on Globe</button>
              </article>
            );
          })}
        </div>
      ) : <div className="collection-empty"><MapPin /><h2>No destinations found</h2><p>Reset a filter or try another search.</p></div>}
    </section>
  );
}
