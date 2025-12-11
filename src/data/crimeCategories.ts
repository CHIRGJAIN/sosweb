export const crimeCategories = [
  "Animal Cruelty",
  "Mob Lynching",
  "Harassment",
  "Accidents",
  "Stealing",
  "Domestic Violence",
  "Theft",
  "Drug Dealing",
  "Child Abuse",
  "Cyber Crime",
  "Corruption",
  "Human Trafficking",
  "Rape",
  "Murder",
  "Robbery",
  "Arson",
  "Fraud",
  "Public Violence",
] as const;

export type CrimeCategory = (typeof crimeCategories)[number];
