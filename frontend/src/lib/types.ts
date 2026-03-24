export type Role = "ADMIN" | "MANAGER" | "MEMBER";
export type Country = "INDIA" | "AMERICA";
export type OrderStatus = "PENDING" | "CHECKED_OUT" | "CANCELED";
export type PaymentType = "CARD" | "UPI" | "BANK";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  country: Country;
};

export type MenuItem = {
  id: string;
  name: string;
  priceCents: number;
  restaurantId: string;
};

export type Restaurant = {
  id: string;
  name: string;
  country: Country;
  menuItems: MenuItem[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  unitPriceCents: number;
  menuItemId: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  totalCents: number;
  userId: string;
  country: Country;
  items: OrderItem[];
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  label: string;
  type: PaymentType;
  last4: string;
  userId: string;
};
