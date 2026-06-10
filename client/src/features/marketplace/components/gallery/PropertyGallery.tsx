import { useState } from "react";

interface Props {
  images: string[];
  title: string | null;
}

const PropertyGallery = ({ images, title }: Props) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="w-full h-96 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={images[activeImage]}
          alt={title || "Property"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                activeImage === i ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
          {images.length > 5 && (
            <div className="h-20 rounded-lg bg-black/60 text-white flex items-center justify-center font-semibold">
              +{images.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;