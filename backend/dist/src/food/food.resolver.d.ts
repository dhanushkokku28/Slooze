import { Request } from 'express';
import { RequestUserService } from '../auth/request-user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AddPaymentMethodInput, CreateOrderInput, OrderModel, PaymentMethodModel, RestaurantModel, UpdatePaymentMethodInput, UserModel } from './graphql.models';
type GraphqlContext = {
    req: Request;
};
export declare class FoodResolver {
    private readonly prisma;
    private readonly requestUserService;
    constructor(prisma: PrismaService, requestUserService: RequestUserService);
    demoUsers(): Promise<UserModel[]>;
    me(context: GraphqlContext): Promise<UserModel>;
    restaurants(context: GraphqlContext): Promise<RestaurantModel[]>;
    orders(context: GraphqlContext): Promise<OrderModel[]>;
    paymentMethods(context: GraphqlContext): Promise<PaymentMethodModel[]>;
    createOrder(context: GraphqlContext, input: CreateOrderInput): Promise<OrderModel>;
    checkoutOrder(context: GraphqlContext, orderId: string): Promise<OrderModel>;
    cancelOrder(context: GraphqlContext, orderId: string): Promise<OrderModel>;
    addPaymentMethod(context: GraphqlContext, input: AddPaymentMethodInput): Promise<PaymentMethodModel>;
    updatePaymentMethod(context: GraphqlContext, input: UpdatePaymentMethodInput): Promise<PaymentMethodModel>;
    private getCurrentUser;
}
export {};
