export type Pitch = {
  id: string;
  venue: string;
  city: string;
  district: string;
  address: string;
  price: number;
  surface: string;
  indoor: boolean;
  players: string;
  rating: number;
  image: string;
  amenities: string[];
  slots: string[];
};

export const pitches: Pitch[] = [
  {
    id: "almaty-arena-1",
    venue: "Almaty Arena Football",
    city: "Almaty",
    district: "Bostandyk",
    address: "Al-Farabi Ave, Almaty",
    price: 12000,
    surface: "Artificial turf",
    indoor: false,
    players: "5v5",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Changing room", "Showers", "Parking", "Lighting"],
    slots: ["17:00", "18:00", "19:00", "21:00"]
  },
  {
    id: "astana-football-hub",
    venue: "Astana Football Hub",
    city: "Astana",
    district: "Yesil",
    address: "Mangilik El Ave, Astana",
    price: 15000,
    surface: "Artificial turf",
    indoor: true,
    players: "6v6",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1553778263-73a05d1f9d93?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Indoor", "Changing room", "Parking", "Wi-Fi"],
    slots: ["16:00", "17:00", "19:00", "20:00"]
  },
  {
    id: "shymkent-sport-park",
    venue: "Shymkent Sport Park",
    city: "Shymkent",
    district: "Karatau",
    address: "Tauke Khan Ave, Shymkent",
    price: 9000,
    surface: "Artificial turf",
    indoor: false,
    players: "5v5",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Lighting", "Parking", "Equipment rental"],
    slots: ["15:00", "16:00", "18:00", "20:00"]
  }
];
