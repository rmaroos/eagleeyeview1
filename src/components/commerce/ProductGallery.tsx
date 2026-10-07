import { useState } from 'react';
import { ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2 lg:w-20">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                activeIndex === i ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover bg-gray-50" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 relative">
        <div
          className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative group cursor-zoom-in"
          onClick={() => setZoomed(true)}
        >
          <img
            src={images[activeIndex]}
            alt={alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={18} className="text-gray-700" />
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <img
            src={images[activeIndex]}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-lg"
            onClick={() => setZoomed(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
