import type { TravelPlace } from '../types/travel';
const now='2026-01-01T00:00:00.000Z';
const photo=(id:string,url:string)=>[{id,url,isCover:true}];
const canadaPlace=(id:string,name:string,region:string,latitude:number,longitude:number,notes:string,tags:string[]):TravelPlace=>({id,name,country:'Canada',region,continent:'North America',latitude,longitude,status:'want-to-visit',notes,tags,photos:[],createdAt:now,updatedAt:now});
const canadaPlaces:TravelPlace[]=[
 canadaPlace('jasper','Jasper National Park','Alberta',52.8734,-117.9543,'Glaciers, mountains, wildlife',['National Park','Mountains','Wildlife','Hiking']),
 canadaPlace('yoho','Yoho National Park','British Columbia',51.3957,-116.486,'Emerald Lake, waterfalls',['National Park','Nature','Lakes','Waterfalls']),
 canadaPlace('kootenay','Kootenay National Park','British Columbia',50.95,-116.033,'Mountains, hot springs',['National Park','Mountains','Nature','Hiking']),
 canadaPlace('pacific-rim','Pacific Rim National Park Reserve','British Columbia',48.635,-125.161,'Wild Pacific coast',['National Park','Coast','Beach','Nature']),
 canadaPlace('gros-morne','Gros Morne National Park','Newfoundland and Labrador',49.649,-57.755,'Fjords and dramatic mountains',['National Park','Fjord','Mountains','Hiking']),
 canadaPlace('fundy','Fundy National Park','New Brunswick',45.6138,-65.0316,'Huge tides and coastline',['National Park','Coast','Nature','Hiking']),
 canadaPlace('cape-breton','Cape Breton Highlands National Park','Nova Scotia',46.737,-60.618,'Cabot Trail and ocean cliffs',['National Park','Coast','Mountains','Hiking']),
 canadaPlace('pei-national-park','Prince Edward Island National Park','Prince Edward Island',46.415,-63.075,'Red cliffs and beaches',['National Park','Beach','Coast','Nature']),
 canadaPlace('la-mauricie','La Mauricie National Park','Québec',46.799,-72.97,'Lakes and forests',['National Park','Lakes','Nature','Hiking']),
 canadaPlace('forillon','Forillon National Park','Québec',48.9,-64.2,'Ocean cliffs and whales',['National Park','Coast','Wildlife','Hiking']),
 canadaPlace('gaspesie','Parc national de la Gaspésie','Québec',48.94,-66.12,'Mountains and wildlife',['National Park','Mountains','Wildlife','Hiking']),
 canadaPlace('bic','Parc national du Bic','Québec',48.35,-68.8,'Beautiful St. Lawrence sunsets',['National Park','Coast','Nature','Hiking']),
 canadaPlace('saguenay-fjord','Parc national du Fjord-du-Saguenay','Québec',48.24,-70.2,'Huge fjord cliffs',['National Park','Fjord','Hiking','Nature']),
 canadaPlace('hautes-gorges','Parc national des Hautes-Gorges-de-la-Rivière-Malbaie','Québec',47.85,-70.45,'Epic valleys and hiking',['National Park','Mountains','Hiking','Nature']),
 canadaPlace('jacques-cartier','Parc national de la Jacques-Cartier','Québec',47.3,-71.35,'Massive glacial valley',['National Park','Mountains','Hiking','Nature']),
 canadaPlace('mont-tremblant','Parc national du Mont-Tremblant','Québec',46.2,-74.58,'Lakes, mountains, fall colours',['National Park','Lakes','Mountains','Hiking']),
 canadaPlace('mont-megantic','Parc national du Mont-Mégantic','Québec',45.456,-71.152,'Hiking + incredible stars',['National Park','Hiking','Mountains','Stargazing']),
 canadaPlace('mont-orford','Parc national du Mont-Orford','Québec',45.324,-72.245,'Mountains and lakes',['National Park','Mountains','Lakes','Hiking']),
 canadaPlace('anticosti','Parc national d’Anticosti','Québec',49.5,-63,'Waterfalls and wild landscapes',['National Park','Waterfalls','Nature','Wildlife']),
 canadaPlace('kluane','Kluane National Park','Yukon',60.75,-139.5,'Giant mountains and glaciers',['National Park','Mountains','Hiking','Wildlife']),
 canadaPlace('nahanni','Nahanni National Park Reserve','Northwest Territories',61.55,-125.59,'Canyons and waterfalls',['National Park','Waterfalls','Hiking','Nature']),
 canadaPlace('auyuittuq','Auyuittuq National Park','Nunavut',67.3,-65.5,'Arctic mountains and glaciers',['National Park','Arctic','Mountains','Hiking'])
];
export const demoPlaces:TravelPlace[]=[
 {id:'santorini',name:'Santorini',country:'Greece',region:'Cyclades',continent:'Europe',latitude:36.3932,longitude:25.4615,status:'want-to-visit',notes:'Sunset over the caldera.',tags:['Beach','Culture'],photos:photo('s1','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'banff',name:'Banff National Park',country:'Canada',region:'Alberta',continent:'North America',latitude:51.1784,longitude:-115.5708,status:'want-to-visit',notes:'Mountains, Moraine Lake, Lake Louise',tags:['National Park','Mountains','Lakes','Hiking'],photos:photo('b1','https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'tokyo',name:'Tokyo',country:'Japan',continent:'Asia',latitude:35.6762,longitude:139.6503,status:'visited',rating:5,tags:['City','Food'],photos:photo('t1','https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'bora',name:'Bora Bora',country:'French Polynesia',continent:'Oceania',latitude:-16.5004,longitude:-151.7415,status:'want-to-visit',tags:['Beach','Adventure'],photos:photo('bo1','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'amalfi',name:'Amalfi Coast',country:'Italy',continent:'Europe',latitude:40.6333,longitude:14.6029,status:'want-to-visit',tags:['Road Trip','Food'],photos:photo('a1','https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'machu',name:'Machu Picchu',country:'Peru',continent:'South America',latitude:-13.1631,longitude:-72.545,status:'visited',rating:5,tags:['Hiking','Culture'],photos:photo('m1','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'serengeti',name:'Serengeti',country:'Tanzania',continent:'Africa',latitude:-2.3333,longitude:34.8333,status:'want-to-visit',tags:['Nature','Adventure'],photos:photo('se1','https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'sydney',name:'Sydney',country:'Australia',continent:'Oceania',latitude:-33.8688,longitude:151.2093,status:'visited',rating:4,tags:['City','Beach'],photos:photo('sy1','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 {id:'newyork',name:'New York City',country:'United States',continent:'North America',latitude:40.7128,longitude:-74.006,status:'visited',rating:5,tags:['City','Food'],photos:photo('n1','https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=80'),createdAt:now,updatedAt:now},
 ...canadaPlaces
];
