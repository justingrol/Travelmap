import type { TravelPhoto } from '../types/travel';

interface CommonsPage {
  pageid: number;
  title: string;
  imageinfo?: Array<{
    thumburl?: string;
    descriptionurl?: string;
    extmetadata?: { ImageDescription?: { value?: string } };
  }>;
}

interface CommonsResponse {
  query?: { pages?: Record<string, CommonsPage> };
}

/** Finds appropriately sized, place-specific images from Wikimedia Commons. */
export async function discoverPlacePhotos(
  placeName: string,
  country: string,
  count: number,
  signal?: AbortSignal,
): Promise<TravelPhoto[]> {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrnamespace', '6');
  url.searchParams.set('gsrlimit', String(Math.max(count + 3, 6)));
  url.searchParams.set('gsrsearch', `"${placeName}" ${country} filetype:bitmap`);
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|extmetadata');
  url.searchParams.set('iiurlwidth', '1200');

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Commons image search failed (${response.status})`);
  const payload = await response.json() as CommonsResponse;
  const pages = Object.values(payload.query?.pages ?? {});

  return pages
    .flatMap((page): TravelPhoto[] => {
      const info = page.imageinfo?.[0];
      if (!info?.thumburl) return [];
      const rawCaption = info.extmetadata?.ImageDescription?.value;
      const caption = rawCaption?.replace(/<[^>]*>/g, '').trim() || page.title.replace(/^File:/, '');
      return [{
        id: `commons-${page.pageid}`,
        url: info.thumburl,
        caption,
        sourceUrl: info.descriptionurl,
      }];
    })
    .slice(0, count);
}
