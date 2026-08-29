import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { TravelPhoto } from '../../types/travel';

export function PlaceGallery({ photos, placeName }: { photos: TravelPhoto[]; placeName: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? undefined : photos[activeIndex];
  const move = useCallback((direction: number) => setActiveIndex((current) => current === null ? 0 : (current + direction + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, move]);

  if (photos.length < 2) return null;
  return <><div className="place-gallery" aria-label={`${placeName} photo gallery`}>{photos.map((photo,index)=><button key={photo.id} onClick={()=>setActiveIndex(index)} aria-label={`View ${photo.caption||`${placeName} photo ${index+1}`}`}><img src={photo.url} alt={photo.caption||`${placeName} view ${index+1}`} loading="lazy"/></button>)}</div>{activePhoto&&<div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${placeName} image viewer`}><button className="gallery-close" onClick={()=>setActiveIndex(null)} aria-label="Close image viewer"><X/></button><button className="gallery-previous" onClick={()=>move(-1)} aria-label="Previous image"><ChevronLeft/></button><figure><img src={activePhoto.url} alt={activePhoto.caption||placeName}/><figcaption>{activePhoto.caption||placeName}{activePhoto.sourceUrl&&<a href={activePhoto.sourceUrl} target="_blank" rel="noreferrer">Wikimedia Commons <ExternalLink/></a>}</figcaption></figure><button className="gallery-next" onClick={()=>move(1)} aria-label="Next image"><ChevronRight/></button></div>}</>;
}
