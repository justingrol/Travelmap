import { demoPlaces } from '../data/demoPlaces'; import type { TravelPlace } from '../types/travel';
const KEY='travel-globe.places.v1';
const valid=(p:TravelPlace)=>p&&typeof p.id==='string'&&typeof p.name==='string'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
export const travelStorage={
 load():TravelPlace[]{ try{const raw=localStorage.getItem(KEY); if(!raw){this.save(demoPlaces);return demoPlaces} const parsed:unknown=JSON.parse(raw); return Array.isArray(parsed)?parsed.filter((p):p is TravelPlace=>valid(p as TravelPlace)):demoPlaces}catch{return demoPlaces}},
 save(places:TravelPlace[]){try{localStorage.setItem(KEY,JSON.stringify(places))}catch{ /* Storage may be unavailable or full; the in-memory app remains usable. */ }}
};
