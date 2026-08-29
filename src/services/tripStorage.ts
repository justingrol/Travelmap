import type { TravelTrip } from '../types/travel';
const KEY='travel-globe.trips.v1';
export const tripStorage={load():TravelTrip[]{try{const value:unknown=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(value)?value.filter((trip):trip is TravelTrip=>Boolean(trip&&typeof trip==='object'&&'id'in trip&&'name'in trip&&'stops'in trip)):[]}catch{return[]}},save(trips:TravelTrip[]){try{localStorage.setItem(KEY,JSON.stringify(trips))}catch{/* Keep trips usable in memory when storage is unavailable. */}}};
