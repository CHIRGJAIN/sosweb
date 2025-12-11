export type Ngo = {
  id: string;
  title: string;
  imageUrl: string;
  required: number;
  received: number;
  contact: string;
  description: string;
};

export const ngos: Ngo[] = [
  {
    id: "animal-rescue-kerala",
    title: "Animal Rescue Kerala",
    imageUrl:
      "https://images.unsplash.com/photo-1558944351-c7e13bcf9a06?auto=format&fit=crop&w=900&q=80",
    required: 50000,
    received: 20000,
    contact: "help@ark.org",
    description:
      "Emergency veterinary support and shelter for animals displaced by floods in Kerala.",
  },
  {
    id: "flood-victims-rajasthan",
    title: "Flood Victims Relief Rajasthan",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    required: 100000,
    received: 75000,
    contact: "relief@rajasthan.gov.in",
    description:
      "Supplying clean water, dry rations, and medical kits to flood-affected districts in Rajasthan.",
  },
  {
    id: "child-welfare-trust",
    title: "Child Welfare Trust",
    imageUrl:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80",
    required: 30000,
    received: 15000,
    contact: "care@cwt.in",
    description:
      "Providing trauma counselling and shelter to vulnerable children impacted by civic unrest.",
  },
];
