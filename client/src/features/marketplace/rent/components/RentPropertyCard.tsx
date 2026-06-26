// client/src/features/marketplace/rent/components/RentPropertyCard.tsx
import { MapPin, Bed, Bath, Maximize, Heart, Star } from "lucide-react";
import type { Property } from "../api/rentApi";
import { formatPrice } from "../../../../shared/utils/helpers"; // ✅ shared util
import styles from "../../components/media/styles/Buy.module.css";

interface RentPropertyCardProps {
  property: Property;
  onSeeMore: (id: number) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400";

// ✅ Reusable guard — same logic as SellerProperties
// WHY: isFeatured=true in DB doesn't mean it's still active.
// Extract this to shared/utils/helpers.ts if used in 3+ places.
const isStillFeatured = (property: Property): boolean =>
  property.isFeatured &&
  !!property.featuredUntil &&
  new Date(property.featuredUntil) > new Date();

const RentPropertyCard = ({
  property: p,
  onSeeMore,
}: RentPropertyCardProps) => {
  return (
    <div
      className={styles.card}
      onClick={() => onSeeMore(p.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSeeMore(p.id)}
    >
      {/* ✅ imageWrap already has position:relative — badge goes inside it */}
      <div className={styles.imageWrap}>
        {/* ✅ p.isFeatured not property.isFeatured — was the runtime bug */}
        {isStillFeatured(p) && (
          <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={10} fill="white" />
            Featured
          </div>
        )}

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

      <div className={styles.cardBody}>
        <h4 className={styles.propTitle}>{p.title}</h4>

        <div className={styles.location}>
          <MapPin size={14} />
          {p.locality}, {p.city}
        </div>

        {/* ✅ formatPrice now from shared utils — not redefined locally */}
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

        {p.amenities?.length > 0 && (
          <div className={styles.chips}>
            {/* ✅ key={a} not key={i} — stable identity for reconciliation */}
            {p.amenities.slice(0, 3).map((a) => (
              <span key={a}>{a}</span>
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
