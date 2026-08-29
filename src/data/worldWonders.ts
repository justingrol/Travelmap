import type{TravelPlace}from'../types/travel';
const created='2026-08-29T00:00:00.000Z';
const wonder=(id:string,name:string,country:string,continent:string,region:string,latitude:number,longitude:number,aliases:string[]=[]):TravelPlace=>({id:`wonder-${id}`,name,country,countries:[country],aliases,continent,region,latitude,longitude,status:'want-to-visit',favorite:true,worldWonder:true,priority:'must-visit',tags:['World Wonder','Culture','History','Architecture','UNESCO'],photos:[],createdAt:created,updatedAt:created});
export const worldWonders:TravelPlace[]=[
 wonder('great-wall','Great Wall of China','China','Asia','Beijing / Hebei',40.4319,116.5704),
 wonder('petra','Petra','Jordan','Asia','Ma’an Governorate',30.3285,35.4444),
 wonder('christ-redeemer','Christ the Redeemer','Brazil','South America','Rio de Janeiro',-22.9519,-43.2105,['Cristo Redentor']),
 wonder('machu-picchu','Machu Picchu','Peru','South America','Cusco Region',-13.1631,-72.545),
 wonder('chichen-itza','Chichén Itzá','Mexico','North America','Yucatán',20.6843,-88.5678,['Chichen Itza']),
 wonder('colosseum','Colosseum','Italy','Europe','Rome',41.8902,12.4922,['Roman Colosseum','Coliseum']),
 wonder('taj-mahal','Taj Mahal / Agra','India','Asia','Uttar Pradesh',27.1751,78.0421,['Taj Mahal','Agra'])
];
