import { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto no-scrollbar lg:overflow-y-auto lg:w-20 shrink-0 py-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === i
                  ? 'border-[#2347F5] ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-400 opacity-75 hover:opacity-100'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`${alt} thumb ${i + 1}`} className="w-full h-full object-cover bg-slate-50" />
            </button>
          ))}
        </div>
      )}

      {/* Main Showcase Image */}
      <div className="flex-1 relative">
        <div
          className="aspect-square rounded-2xl overflow-hidden bg-slate-50 relative group cursor-zoom-in border border-gray-200 shadow-xs"
          onClick={() => setZoomed(true)}
        >
          <img
            src={images[activeIndex]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Zoom button hint */}
          <div className="absolute top-3.5 right-3.5 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} />
          </div>

          {/* Quick navigation chevrons */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur-md text-[#15171C] shadow-sm hover:scale-105 transition-transform"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur-md text-[#15171C] shadow-sm hover:scale-105 transition-transform"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setZoomed(false)}
            aria-label="Close zoomed view"
          >
            <X size={22} />
          </button>
          <img
            src={images[activeIndex]}
            alt={alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
