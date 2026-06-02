import luxuryHouseImage from "../../auth/assets/photo-1722421492323-eaf9c401befe.avif";

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  status: "For Sale" | "For Rent";
  beds: number;
  baths: number;
  area: string;
  image: string;
}

export const propertiesData: Property[] = [
  {
    id: 1,
    title: "Luxury House",
    location: "DHA Phase 6, Lahore",
    price: "PKR 4.85 Crore",
    status: "For Sale",
    beds: 5,
    baths: 6,
    area: "1 Kanal",
    image: luxuryHouseImage
  },
  {
    id: 2,
    title: "Elegant Apartment",
    location: "Bahria Town, Karachi",
    price: "PKR 85,000 / Month",
    status: "For Rent",
    beds: 3,
    baths: 3,
    area: "1350 sqft",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
  },
  {
    id: 3,
    title: "Premium Villa",
    location: "F-7, Islamabad",
    price: "PKR 7.25 Crore",
    status: "For Sale",
    beds: 6,
    baths: 7,
    area: "2 Kanal",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
  },
  {
    id: 4,
    title: "Spacious Apartment",
    location: "Gulberg, Lahore",
    price: "PKR 65,000 / Month",
    status: "For Rent",
    beds: 2,
    baths: 2,
    area: "1100 sqft",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
  },
  {
    id: 5,
    title: "Modern Family Home",
    location: "Clifton, Karachi",
    price: "PKR 5.5 Crore",
    status: "For Sale",
    beds: 4,
    baths: 4,
    area: "1 Kanal",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
  }
];