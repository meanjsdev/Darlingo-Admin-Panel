export interface Subscription {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  perks: string[];
  imageUrl: string;
  popular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}
