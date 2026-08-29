import { demoPlaces } from '../data/demoPlaces'; import { withVisitGuide } from '../data/visitGuides'; import type { TravelPlace } from '../types/travel';
const KEY='travel-globe.places.v1';
const valid=(p:TravelPlace)=>p&&typeof p.id==='string'&&typeof p.name==='string'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
export const travelStorage={
 load():TravelPlace[]{ try{const seeded=demoPlaces.map(withVisitGuide);const raw=localStorage.getItem(KEY); if(!raw){this.save(seeded);return seeded} const parsed:unknown=JSON.parse(raw); if(!Array.isArray(parsed))return seeded;const saved=parsed.filter((p):p is TravelPlace=>valid(p as TravelPlace)).map(withVisitGuide);const ids=new Set(saved.map(place=>place.id));const merged=[...saved,...seeded.filter(place=>!ids.has(place.id))];this.save(merged);return merged}catch{return demoPlaces.map(withVisitGuide)}},
 save(places:TravelPlace[]){try{localStorage.setItem(KEY,JSON.stringify(places))}catch{ /* Storage may be unavailable or full; the in-memory app remains usable. */ }}
};
