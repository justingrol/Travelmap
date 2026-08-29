import { demoPlaces } from '../data/demoPlaces'; import type { TravelPlace } from '../types/travel';
const KEY='travel-globe.places.v1';
const valid=(p:TravelPlace)=>p&&typeof p.id==='string'&&typeof p.name==='string'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
export const travelStorage={
 load():TravelPlace[]{ try{const raw=localStorage.getItem(KEY); if(!raw){this.save(demoPlaces);return demoPlaces} const parsed:unknown=JSON.parse(raw); if(!Array.isArray(parsed))return demoPlaces;const saved=parsed.filter((p):p is TravelPlace=>valid(p as TravelPlace));const ids=new Set(saved.map(place=>place.id));const merged=[...saved,...demoPlaces.filter(place=>!ids.has(place.id))];this.save(merged);return merged}catch{return demoPlaces}},
 save(places:TravelPlace[]){try{localStorage.setItem(KEY,JSON.stringify(places))}catch{ /* Storage may be unavailable or full; the in-memory app remains usable. */ }}
};
