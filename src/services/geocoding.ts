export interface SearchResult { id:string; name:string; country:string; region?:string; latitude:number; longitude:number }
export async function searchLocations(query:string,signal?:AbortSignal):Promise<SearchResult[]>{
 const url=new URL('https://nominatim.openstreetmap.org/search'); url.searchParams.set('q',query);url.searchParams.set('format','jsonv2');url.searchParams.set('addressdetails','1');url.searchParams.set('limit','5');
 const res=await fetch(url,{signal,headers:{'Accept-Language':'en'}}); if(!res.ok) throw new Error('Search is temporarily unavailable');
 const data=await res.json() as Array<{place_id:number;display_name:string;lat:string;lon:string;address?:Record<string,string>}>;
 return data.map(x=>({id:String(x.place_id),name:x.display_name.split(',')[0],country:x.address?.country??'Unknown',region:x.address?.state,latitude:Number(x.lat),longitude:Number(x.lon)}));
}
