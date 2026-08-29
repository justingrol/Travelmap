export type PlaceStatus = 'visited' | 'want-to-visit';
export interface TravelPhoto { id:string; url:string; caption?:string; isCover?:boolean; sourceUrl?:string }
export interface TravelPlace { id:string; name:string; country:string; region?:string; continent?:string; latitude:number; longitude:number; status:PlaceStatus; visitedDate?:string; rating?:number; notes?:string; tags:string[]; photos:TravelPhoto[]; createdAt:string; updatedAt:string }
export type PlaceDraft = Omit<TravelPlace,'id'|'createdAt'|'updatedAt'>;
export type PlaceFilter = 'all' | PlaceStatus;
