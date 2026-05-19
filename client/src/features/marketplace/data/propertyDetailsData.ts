// src/features/marketplace/data/propertyDetailsData.ts
import house2 from "../../marketplace/assets/image copy.png";
import house3 from "../../marketplace/assets/image copy 2.png";
import house4 from "../../marketplace/assets/image.png";

const house1 =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

type PropertyFeature = {
  label: string;
  value: string | number;
  icon: string;
};

type NearbyPlace = {
  place: string;
  distance: string;
  icon: string;
};

type Specification = {
  label: string;
  value: string | number;
};

type Review = {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
  verified: boolean;
};

type RecentlyViewed = {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
};

export type PropertyData = {
  title: string;
  price: string;
  priceInWords: string;
  location: string;
  fullLocation: string;
  propertyId: string;
  images: string[];
  badges: string[];
  features: PropertyFeature[];
  description: string[];
  amenities: string[];
  specifications: Specification[];
  nearbyPlaces: NearbyPlace[];
  reviews: Review[];
  ratingBreakdown: { stars: number; count: number }[];
  totalReviews: number;
  averageRating: number;
  recentlyViewed: RecentlyViewed[];
};

export const propertyData: PropertyData = {
  title: "1 Kanal Modern Luxury House for Sale in DHA Phase 6, Lahore",
  price: "PKR 125,000,000",
  priceInWords: "12.5 Crore",
  location: "DHA Phase 6, Lahore, Punjab",
  fullLocation: "DHA Phase 6, Lahore",
  propertyId: "Z360-LHR-6543",
  images: [house1, house2, house4, house3, house4],
  badges: ["For Sale", "Featured", "Premium", "Verified"],

  features: [
    { label: "Bedrooms", value: 5, icon: "bed" },
    { label: "Bathrooms", value: 6, icon: "bath" },
    { label: "Living Rooms", value: 2, icon: "sofa" },
    { label: "Kitchens", value: 2, icon: "kitchen" },
    { label: "Area", value: "1 Kanal", icon: "area" },
    { label: "Car Parking", value: 4, icon: "car" },
  ],

  description: [
    "Experience luxury living in this beautifully designed 1 Kanal house located in the heart of DHA Phase 6, Lahore.",
    "This brand new house features 5 spacious bedrooms with attached bathrooms, 2 elegant living areas, a modern kitchen, servant quarter, laundry area and a lush green lawn. Built with premium quality materials and contemporary architecture, this home offers the perfect blend of comfort and style.",
    "The house is conveniently located near parks, masjid, commercial areas and top schools.",
  ],

  amenities: [
    "Lawn",
    "Central Air Conditioning",
    "Servant Quarter",
    "Near Park",
    "Double Glazed Windows",
    "Broadband Internet",
    "Power Backup",
    "Fire Fighting System",
    "Car Parking (4)",
    "CCTV Security",
  ],

  specifications: [
    { label: "Property Type", value: "House" },
    { label: "Purpose", value: "For Sale" },
    { label: "Location", value: "DHA Phase 6, Lahore" },
    { label: "Property ID", value: "Z360-LHR-6543" },
    { label: "Area", value: "1 Kanal" },
    { label: "Bedrooms", value: 5 },
    { label: "Bathrooms", value: 6 },
    { label: "Living Rooms", value: 2 },
    { label: "Kitchens", value: 2 },
    { label: "Car Parking", value: 4 },
    { label: "Floors", value: 2 },
    { label: "Construction Status", value: "Brand New" },
    { label: "Furnished", value: "Semi Furnished" },
    { label: "Facing", value: "South" },
    { label: "Approved By", value: "LDA" },
    { label: "Added On", value: "May 15, 2024" },
  ],

  nearbyPlaces: [
    { place: "DHA Phase 6 Park", distance: "350 m", icon: "park" },
    { place: "DHA Phase 6 Masjid", distance: "500 m", icon: "masjid" },
    { place: "Lahore Grammar School", distance: "1.2 km", icon: "school" },
    { place: "Packages Mall", distance: "2.6 km", icon: "mall" },
    {
      place: "Allama Iqbal International Airport",
      distance: "7.5 km",
      icon: "airport",
    },
  ],

  reviews: [
    {
      id: 1,
      name: "Hamza Ali",
      date: "May 10, 2024",
      rating: 5,
      comment:
        "Excellent experience with Zameen 360. The property was exactly as shown and the agent was very professional and cooperative.",
      avatar: "https://i.pravatar.cc/100?img=12",
      verified: true,
    },
  ],

  ratingBreakdown: [
    { stars: 5, count: 112 },
    { stars: 4, count: 13 },
    { stars: 3, count: 2 },
    { stars: 2, count: 1 },
    { stars: 1, count: 0 },
  ],

  totalReviews: 128,
  averageRating: 4.9,

  recentlyViewed: [
    {
      id: 1,
      title: "1 Kanal House",
      location: "DHA Phase 6",
      price: "PKR 125M",
      image: house1,
    },
    {
      id: 2,
      title: "10 Marla House",
      location: "DHA Phase 5",
      price: "PKR 68M",
      image: house1,
    },
    {
      id: 3,
      title: "5 Marla House",
      location: "DHA Phase 9",
      price: "PKR 42M",
      image: house1,
    },
    {
      id: 4,
      title: "2 Kanal House",
      location: "DHA Phase 7",
      price: "PKR 250M",
      image: house1,
    },
  ],
};
