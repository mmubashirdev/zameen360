export interface Agent {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceLabel: string;
  type: "House" | "Apartment" | "Commercial" | "Plot";
  purpose: "Buy" | "Rent";
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: "Karachi" | "Lahore" | "Islamabad" | "Rawalpindi" | "Peshawar";
  address: string;
  images: string[];
  features: string[];
  agent: Agent;
  featured: boolean;
  yearBuilt: number;
}

export interface SearchFilters {
  location: string;
  type: string;
  purpose: string;
  minPrice: string;
  maxPrice: string;
}
