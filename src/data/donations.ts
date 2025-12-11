export type DonationRecord = {
  id: string;
  name: string;
  amount: number;
  date: string;
};

export const receivedDonations: DonationRecord[] = [
  { id: "rec-1", name: "Corporate Relief Fund", amount: 150000, date: "2025-09-18" },
  { id: "rec-2", name: "Citizens Collective", amount: 54000, date: "2025-10-02" },
  { id: "rec-3", name: "Global Aid Trust", amount: 82000, date: "2025-10-11" },
];

export const usedDonations: DonationRecord[] = [
  { id: "used-1", name: "Medical Supplies", amount: 60000, date: "2025-09-20" },
  { id: "used-2", name: "Field Operations", amount: 42000, date: "2025-10-05" },
  { id: "used-3", name: "Volunteer Housing", amount: 30000, date: "2025-10-12" },
];

const totalFunds = receivedDonations.reduce((sum, record) => sum + record.amount, 0);
const usedFunds = usedDonations.reduce((sum, record) => sum + record.amount, 0);

export const totals = {
  totalFunds,
  usedFunds,
  remainingFunds: totalFunds - usedFunds,
};
