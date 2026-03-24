import { Country, OrderStatus, PaymentType, Role } from '@prisma/client';
export declare class UserModel {
    id: string;
    name: string;
    email: string;
    role: Role;
    country: Country;
}
export declare class MenuItemModel {
    id: string;
    name: string;
    priceCents: number;
    restaurantId: string;
}
export declare class RestaurantModel {
    id: string;
    name: string;
    country: Country;
    menuItems: MenuItemModel[];
}
export declare class OrderItemModel {
    id: string;
    quantity: number;
    unitPriceCents: number;
    menuItemId: string;
    orderId: string;
}
export declare class OrderModel {
    id: string;
    status: OrderStatus;
    totalCents: number;
    userId: string;
    restaurantId: string;
    country: Country;
    createdAt: Date;
    items: OrderItemModel[];
}
export declare class PaymentMethodModel {
    id: string;
    label: string;
    type: PaymentType;
    last4: string;
    userId: string;
}
export declare class OrderItemInput {
    menuItemId: string;
    quantity: number;
}
export declare class CreateOrderInput {
    restaurantId: string;
    items: OrderItemInput[];
}
export declare class AddPaymentMethodInput {
    userId: string;
    label: string;
    type: PaymentType;
    last4: string;
}
export declare class UpdatePaymentMethodInput {
    id: string;
    label?: string;
    type?: PaymentType;
    last4?: string;
}
