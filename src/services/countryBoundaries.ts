export interface CountryBoundary {
  type: 'Feature';
  properties: Record<string, unknown> & {
    ADMIN?: string;
    NAME?: string;
    SOVEREIGNT?: string;
    LABEL_X?: number;
    LABEL_Y?: number;
  };
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

interface CountryBoundaryCollection {
  type: 'FeatureCollection';
  features: CountryBoundary[];
}

// Natural Earth 1:110m Admin 0 countries: detailed enough for a globe overview,
// while remaining considerably lighter than the 1:50m and 1:10m editions.
const COUNTRY_BOUNDARIES_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

function isBoundaryCollection(value: unknown): value is CountryBoundaryCollection {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CountryBoundaryCollection>;
  return candidate.type === 'FeatureCollection' && Array.isArray(candidate.features);
}

export async function loadCountryBoundaries(signal?: AbortSignal): Promise<CountryBoundary[]> {
  const response = await fetch(COUNTRY_BOUNDARIES_URL, { signal });
  if (!response.ok) {
    throw new Error(`Country boundaries could not be loaded (${response.status})`);
  }

  const data: unknown = await response.json();
  if (!isBoundaryCollection(data)) {
    throw new Error('Country boundary data has an unexpected format');
  }

  return data.features.filter(
    (feature) => feature?.type === 'Feature' && Boolean(feature.geometry),
  );
}

export function getCountryName(boundary: CountryBoundary): string {
  return boundary.properties.ADMIN
    ?? boundary.properties.NAME
    ?? boundary.properties.SOVEREIGNT
    ?? 'Unknown country';
}

export function getCountryLabelPosition(boundary:CountryBoundary){return{lat:Number(boundary.properties.LABEL_Y)||0,lng:Number(boundary.properties.LABEL_X)||0}}
