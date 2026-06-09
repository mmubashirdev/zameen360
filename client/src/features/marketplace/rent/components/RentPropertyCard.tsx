// client/src/features/marketplace/rent/components/RentPropertyCard.tsx
import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react";
import type { Property } from "../api/rentApi";
import styles from "../../components/media/styles/Buy.module.css";

interface RentPropertyCardProps {
  property: Property;
  onSeeMore: (id: number) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400";

const RentPropertyCard = ({
  property: p,
  onSeeMore,
}: RentPropertyCardProps) => {
  const formatPrice = (price: string | number): string => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(price));
  };

  return (
    <div
      className={styles.card}
      onClick={() => onSeeMore(p.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSeeMore(p.id)}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        <img
          src={p.images?.length > 0 ? p.images[0] : FALLBACK_IMAGE}
          alt={p.title}
          loading="lazy"
        />
        <span className={styles.tag}>For {p.purpose}</span>
        <button
          className={styles.heart}
          onClick={(e) => e.stopPropagation()}
          aria-label="Save property"
        >
          <Heart size={20} />
        </button>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <h4 className={styles.propTitle}>{p.title}</h4>

        <div className={styles.location}>
          <MapPin size={14} />
          {p.locality}, {p.city}
        </div>

        <div className={styles.price}>PKR {formatPrice(p.price)} / mo</div>

        <div className={styles.specs}>
          <div>
            <Bed size={16} />
            <span>{p.bedrooms || "—"} Beds</span>
          </div>
          <div>
            <Bath size={16} />
            <span>{p.bathrooms || "—"} Baths</span>
          </div>
          <div>
            <Maximize size={16} />
            <span>
              {p.areaSize} {p.areaUnit}
            </span>
          </div>
        </div>

        {/* Amenity chips */}
        {p.amenities?.length > 0 && (
          <div className={styles.chips}>
            {p.amenities.slice(0, 3).map((a, i) => (
              <span key={i}>{a}</span>
            ))}
            {p.amenities.length > 3 && (
              <span className={styles.more}>
                +{p.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <button
          className={styles.seeMoreBtn}
          onClick={(e) => {
            e.stopPropagation();
            onSeeMore(p.id);
          }}
        >
          See More Details →
        </button>
      </div>
    </div>
  );
};

export default RentPropertyCard;
