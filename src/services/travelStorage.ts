import { demoPlaces } from '../data/demoPlaces';
import { withVisitGuide } from '../data/visitGuides';
import { worldDestinations } from '../data/worldDestinations';
import type { TravelPlace } from '../types/travel';

const STORAGE_KEY='travel-globe.places.v1';
const VERSION_KEY='travel-globe.data-version';
export const DATA_VERSION=2;

const valid=(place:TravelPlace)=>place&&typeof place.id==='string'&&typeof place.name==='string'&&Number.isFinite(place.latitude)&&Number.isFinite(place.longitude)&&Math.abs(place.latitude)<=90&&Math.abs(place.longitude)<=180;
export const normalizeDestinationName=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();
const names=(place:TravelPlace)=>[place.name,...(place.aliases||[])].map(normalizeDestinationName);
const matches=(left:TravelPlace,right:TravelPlace)=>names(left).some(name=>names(right).includes(name));

/** Seed fields enrich records, but user-owned status, notes, dates, rating and photos always win. */
function mergeSeed(existing:TravelPlace,seed:TravelPlace):TravelPlace{
 const photos=[...existing.photos];for(const photo of seed.photos)if(!photos.some(item=>item.id===photo.id||item.url===photo.url))photos.push(photo);
 return withVisitGuide({...seed,...existing,id:existing.id,country:existing.country||seed.country,countries:[...new Set([...(existing.countries||[existing.country]),...(seed.countries||[seed.country])])],aliases:[...new Set([...(existing.aliases||[]),...(seed.aliases||[])])],continent:existing.continent||seed.continent,region:existing.region||seed.region,destinationType:existing.destinationType||seed.destinationType,tags:[...new Set([...existing.tags,...seed.tags])],photos});
}
function catalog():TravelPlace[]{const result:TravelPlace[]=[];for(const seed of [...demoPlaces,...worldDestinations]){const index=result.findIndex(item=>matches(item,seed));if(index<0)result.push(withVisitGuide(seed));else result[index]=mergeSeed(result[index],seed)}return result}
export function migratePlaces(existing:TravelPlace[]):TravelPlace[]{const result=existing.filter(valid).map(withVisitGuide);for(const seed of catalog()){const index=result.findIndex(item=>matches(item,seed));if(index<0)result.push(seed);else result[index]=mergeSeed(result[index],seed)}return result}

export const travelStorage={
 load():TravelPlace[]{try{const raw=localStorage.getItem(STORAGE_KEY),parsed:unknown=raw?JSON.parse(raw):[];const current=Array.isArray(parsed)?parsed.filter((item):item is TravelPlace=>valid(item as TravelPlace)):[];const migrated=migratePlaces(current);this.save(migrated);localStorage.setItem(VERSION_KEY,String(DATA_VERSION));return migrated}catch{return catalog()}},
 save(places:TravelPlace[]){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(places))}catch{/* Keep the in-memory collection usable if storage is full. */}},
 version(){return Number(localStorage.getItem(VERSION_KEY)||0)}
};
