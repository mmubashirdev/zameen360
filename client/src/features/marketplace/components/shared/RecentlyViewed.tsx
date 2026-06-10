// components/property-details/shared/RecentlyViewed.tsx
interface Props {
  currentPropertyId: number;
}

const RecentlyViewed = ({ currentPropertyId }: Props) => {
  // ⭐ Use karo localStorage mein store ke liye
  console.log("Current property:", currentPropertyId);
  
  // TODO: Implement properly
  return null;
};

export default RecentlyViewed;