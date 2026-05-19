export interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  review: string;
  rating: number;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Raza",
    location: "Lahore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    review: "Zameen 360 made buying our first home incredibly easy. The property listings are accurate, and the team provided outstanding support throughout the entire process. Highly recommended!",
    rating: 5
  },
  {
    id: 2,
    name: "Sana Farooq",
    location: "Karachi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    review: "I found the perfect apartment for rent within two days of browsing. The search filters are very detailed, and I didn't have to deal with any misleading ads. Great platform!",
    rating: 4
  },
  {
    id: 3,
    name: "Usman Ali",
    location: "Islamabad",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    review: "As a property dealer, posting listings on Zameen 360 has significantly increased my client reach. The dashboard is user-friendly and the response rate from genuine buyers is impressive.",
    rating: 5
  },
  {
    id: 4,
    name: "Ayesha Khan",
    location: "Rawalpindi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    review: "The market insights and area guides on Zameen 360 helped me make an informed investment decision. The transparency and data accuracy are what set this platform apart.",
    rating: 4
  },
  {
    id: 5,
    name: "Hassan Sheikh",
    location: "Faisalabad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    review: "Excellent customer service! I had an issue with a listing, and their support team resolved it within hours. It's rare to see such dedication on a real estate platform.",
    rating: 5
  }
];