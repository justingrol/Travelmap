import type { TravelPlace, VisitGuide } from '../types/travel';

const outdoors = new Set(['Nature','National Park','National Parks','Mountains','Hiking','Lakes','Waterfalls','Wildlife','Arctic','Fjord']);
const official = (place:TravelPlace) => place.country==='Canada'
  ? place.region==='Québec'
    ? {name:'Sépaq',url:'https://www.sepaq.com/'}
    : {name:'Parks Canada',url:'https://parks.canada.ca/'}
  : {name:`Official tourism information for ${place.country}`,url:'https://www.unwto.org/tourism-data/country-profile-inbound-tourism'};

/** Conservative baseline guide for seeded data; changing requirements always defer to official sources. */
export function createVisitGuide(place:TravelPlace):VisitGuide{
 const nature=place.tags.some(tag=>outdoors.has(tag)), source=official(place);
 const activities=place.tags.slice(0,5).map((tag,index)=>({id:`${place.id}-activity-${index}`,name:tag==='National Park'?'Scenic exploration':tag,description:`Experience ${tag.toLowerCase()} in and around ${place.name}.`,categories:[tag],duration:index===0?'Half day':'1–3 hours',equipment:nature?['Weather-appropriate layers','Water']:[],difficulty:index>2&&nature?'moderate' as const:'easy' as const}));
 return {whyVisit:place.notes||`Explore the landscapes, culture and signature experiences of ${place.name}.`,bestMonths:nature?['June','July','August','September']:['April','May','September','October'],goodMonths:['May','October'],peakSeason:'Seasonal — verify current visitor levels and operating dates.',lowSeason:'Conditions and services may be limited outside peak season.',minimumDuration:'1 day',recommendedDuration:nature?'2–4 days':'2–3 days',activities,seasonalConsiderations:['Weather and access can change. Check current official conditions before travelling.','Verify current wildfire, trail, road or attraction alerts where relevant.'],reservationConsiderations:['Popular accommodation, camping, transport and activities may require advance booking. Check current official requirements.'],permitConsiderations:['Check current official entry, parking, camping and backcountry permit requirements.'],transportation:{standardCar:true,awdRecommended:false,fourByFourRequired:false,highClearanceRequired:false,winterTires:'seasonal',specialTransport:[],notes:'Access varies by activity and season. Confirm routes and transport with the official destination source.'},equipment:nature?['Hiking shoes','Rain jacket','Layers','Water','Sun protection','Day pack','Camera']:['Comfortable shoes','Weather layers','Water','Sun protection','Camera'],accessibility:['Check the official destination accessibility guide for current accessible facilities, routes and transportation.'],importantToKnow:['Weather can change quickly.','Services and mobile coverage may be limited in some areas.','Check current official alerts before departure.'],officialSourceName:source.name,officialSourceUrl:source.url,lastVerified:'Baseline planning guide — verify time-sensitive details'};
}

export function withVisitGuide(place:TravelPlace):TravelPlace{return place.visitGuide?place:{...place,priority:place.priority??'standard',visitGuide:createVisitGuide(place)}}
