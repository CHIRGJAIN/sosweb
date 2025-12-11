export type SocialScope = "Global" | "National" | "State" | "District";

export type SocialPost = {
  id: string;
  scope: SocialScope;
  location: string;
  description: string;
  imageUrl: string;
};

export const socialPosts: SocialPost[] = [
  {
    id: "world-food-programme",
    scope: "Global",
    location: "UNITED NATIONS",
    description:
      "Coordinated humanitarian air drops have resumed across the Indo-Pacific corridor with medical teams on standby.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "india-relief-update",
    scope: "National",
    location: "INDIA",
    description:
      "NDRF confirms 85% restoration of critical routes. Volunteer sign-ups are open for supply chain logistics across tier-2 cities.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "kerala-coastal",
    scope: "State",
    location: "KERALA",
    description:
      "Coastal shelters at Alappuzha reach safe capacity. Additional dry ration kits dispatched from Kozhikode hub.",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "jaipur-district-update",
    scope: "District",
    location: "JAIPUR",
    description:
      "District control room listing verified helpline numbers for anonymous crimes. Community kitchens serving 12,400 meals daily.",
    imageUrl:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "maharashtra-state-warning",
    scope: "State",
    location: "MAHARASHTRA",
    description:
      "Orange alert issued across Konkan belt. Evacuation drill scheduled for dawn with women-only transport wagons.",
    imageUrl:
      "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?auto=format&fit=crop&w=1000&q=80",
  },
];
