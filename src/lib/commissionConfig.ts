// Commission Configuration - Matches actual GFunnel Partner Program structure

export type MembershipTier = 'standard' | 'office' | 'business';

export interface TierConfig {
  id: MembershipTier;
  name: string;
  price: number;
  description: string;
  commissions: {
    direct: number; // Direct software commission %
    secondGen: number; // 2nd generation override %
    thirdGen: number; // 3rd generation override %
  };
  eliteBoost: number; // Direct commission when Elite (+$30/mo)
}

export const membershipTiers: TierConfig[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 0,
    description: 'Free Plan',
    commissions: { direct: 30, secondGen: 0, thirdGen: 0 },
    eliteBoost: 50,
  },
  {
    id: 'office',
    name: 'Office',
    price: 97,
    description: '$97/month',
    commissions: { direct: 30, secondGen: 10, thirdGen: 0 },
    eliteBoost: 50,
  },
  {
    id: 'business',
    name: 'Business',
    price: 297,
    description: '$297/month',
    commissions: { direct: 30, secondGen: 10, thirdGen: 5 },
    eliteBoost: 50,
  },
];

export const softwareProducts = {
  office: { name: 'Office Plan', price: 97, recurring: true },
  business: { name: 'Business Plan', price: 297, recurring: true },
};

export const serviceProducts = {
  starter: { name: 'Starter', price: 1497, hours: 40 },
  pro: { name: 'Pro', price: 2497, hours: 80 },
  scale: { name: 'Scale', price: 3997, hours: 140 },
  unlimited: { name: 'Unlimited', price: 5997, hours: 0 },
};

export const supportProducts = {
  pro: { name: 'Pro Support', price: 399, subAccounts: 15 },
  platinum: { name: 'Platinum', price: 699, subAccounts: 100 },
  premium: { name: 'Premium Unlimited', price: 1299, subAccounts: 0 },
};

export const getTierById = (id: MembershipTier): TierConfig => {
  return membershipTiers.find(t => t.id === id) || membershipTiers[0];
};

export const ACTION_HUB_URL = 'https://www.gfunnel.com/action-hub';
