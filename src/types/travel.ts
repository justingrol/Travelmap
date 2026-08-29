export type PlaceStatus = 'visited' | 'want-to-visit';
export interface TravelPhoto { id:string; url:string; caption?:string; isCover?:boolean; sourceUrl?:string }
export type TravelPriority = 'standard'|'high'|'must-visit';
export interface TravelActivity { id:string; name:string; description?:string; categories:string[]; duration?:string; seasons?:string[]; reservationRequired?:boolean; equipment?:string[]; feeRequired?:boolean; difficulty?:'easy'|'moderate'|'challenging' }
export interface TransportationInfo { standardCar?:boolean; awdRecommended?:boolean; fourByFourRequired?:boolean; highClearanceRequired?:boolean; winterTires?:'not-usually'|'seasonal'|'required'; specialTransport?:string[]; notes?:string }
export interface VisitGuide { whyVisit?:string; bestMonths?:string[]; goodMonths?:string[]; peakSeason?:string; lowSeason?:string; recommendedDuration?:string; minimumDuration?:string; activities:TravelActivity[]; seasonalConsiderations?:string[]; reservationConsiderations?:string[]; permitConsiderations?:string[]; transportation?:TransportationInfo; equipment?:string[]; accessibility?:string[]; importantToKnow?:string[]; officialSourceName?:string; officialSourceUrl?:string; lastVerified?:string }
export type BudgetStyle='budget'|'standard'|'comfortable';
export interface BudgetEstimate { currency:string; travelers:number; nights:number; style:BudgetStyle; isEstimate:boolean; costs:Record<string,number> }
export interface TravelPlace { id:string; name:string; country:string; countries?:string[]; aliases?:string[]; destinationType?:'place'|'region'; region?:string; continent?:string; latitude:number; longitude:number; status:PlaceStatus; priority?:TravelPriority; visitedDate?:string; rating?:number; notes?:string; tags:string[]; photos:TravelPhoto[]; visitGuide?:VisitGuide; budget?:BudgetEstimate; createdAt:string; updatedAt:string }
export type PlaceDraft = Omit<TravelPlace,'id'|'createdAt'|'updatedAt'>;
export type PlaceFilter = 'all' | PlaceStatus;
export type TripStatus='planning'|'booked'|'completed';
export type RouteType='driving'|'flying'|'train'|'boat'|'walking'|'other';
export interface TripStop { id:string; placeId:string; routeToNext?:RouteType; notes?:string }
export interface TravelTrip { id:string; name:string; coverImage?:string; description?:string; startDate?:string; endDate?:string; travelers:number; budget?:number; currency:string; status:TripStatus; stops:TripStop[]; createdAt:string; updatedAt:string }
export interface MapLayers { countryBorders:boolean; countryNames:boolean; destinations:boolean; wantToVisit:boolean; visited:boolean; visitedCountries:boolean; wishlistCountries:boolean; tripRoutes:boolean; tripStops:boolean; atmosphere:boolean }
