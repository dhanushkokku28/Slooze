import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderStatus, PaymentType, Role, User } from '@prisma/client';
import { Request } from 'express';
import { RequestUserService } from '../auth/request-user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddPaymentMethodInput,
  CreateOrderInput,
  OrderModel,
  PaymentMethodModel,
  RestaurantModel,
  UpdatePaymentMethodInput,
  UserModel,
} from './graphql.models';

type GraphqlContext = {
  req: Request;
};

@Injectable()
@Resolver()
export class FoodResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestUserService: RequestUserService,
  ) {}

  @Query(() => [UserModel])
  async demoUsers(): Promise<UserModel[]> {
    return this.prisma.user.findMany({ orderBy: { name: 'asc' } });
  }

  @Query(() => UserModel)
  async me(@Context() context: GraphqlContext): Promise<UserModel> {
    return this.getCurrentUser(context);
  }

  @Query(() => [RestaurantModel])
  async restaurants(@Context() context: GraphqlContext): Promise<RestaurantModel[]> {
    const currentUser = await this.getCurrentUser(context);

    return this.prisma.restaurant.findMany({
      where: { country: currentUser.country },
      include: { menuItems: true },
      orderBy: { name: 'asc' },
    });
  }

  @Query(() => [OrderModel])
  async orders(@Context() context: GraphqlContext): Promise<OrderModel[]> {
    const currentUser = await this.getCurrentUser(context);

    const whereClause =
      currentUser.role === Role.MEMBER
        ? { userId: currentUser.id }
        : { country: currentUser.country };

    return this.prisma.order.findMany({
      where: whereClause,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Query(() => [PaymentMethodModel])
  async paymentMethods(
    @Context() context: GraphqlContext,
  ): Promise<PaymentMethodModel[]> {
    const currentUser = await this.getCurrentUser(context);

    if (currentUser.role !== Role.ADMIN) {
      return [];
    }

    return this.prisma.paymentMethod.findMany({
      where: { user: { country: currentUser.country } },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Mutation(() => OrderModel)
  async createOrder(
    @Context() context: GraphqlContext,
    @Args('input') input: CreateOrderInput,
  ): Promise<OrderModel> {
    const currentUser = await this.getCurrentUser(context);
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
      include: { menuItems: true },
    });

    if (!restaurant) {
      throw new BadRequestException('Restaurant not found');
    }

    this.requestUserService.assertCountry(currentUser.country, restaurant.country);

    if (input.items.length === 0) {
      throw new BadRequestException('At least one order item is required');
    }

    const menuItemsById = new Map(restaurant.menuItems.map((m) => [m.id, m]));

    let totalCents = 0;
    const orderItemsData = input.items.map((item) => {
      if (item.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than zero');
      }

      const menuItem = menuItemsById.get(item.menuItemId);
      if (!menuItem) {
        throw new BadRequestException(
          `Menu item ${item.menuItemId} does not belong to this restaurant`,
        );
      }

      totalCents += menuItem.priceCents * item.quantity;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPriceCents: menuItem.priceCents,
      };
    });

    return this.prisma.order.create({
      data: {
        userId: currentUser.id,
        restaurantId: restaurant.id,
        country: restaurant.country,
        totalCents,
        items: { createMany: { data: orderItemsData } },
      },
      include: { items: true },
    });
  }

  @Mutation(() => OrderModel)
  async checkoutOrder(
    @Context() context: GraphqlContext,
    @Args('orderId') orderId: string,
  ): Promise<OrderModel> {
    const currentUser = await this.getCurrentUser(context);
    this.requestUserService.assertRole(currentUser, [Role.ADMIN, Role.MANAGER]);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    this.requestUserService.assertCountry(currentUser.country, order.country);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be checked out');
    }

    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CHECKED_OUT },
      include: { items: true },
    });
  }

  @Mutation(() => OrderModel)
  async cancelOrder(
    @Context() context: GraphqlContext,
    @Args('orderId') orderId: string,
  ): Promise<OrderModel> {
    const currentUser = await this.getCurrentUser(context);
    this.requestUserService.assertRole(currentUser, [Role.ADMIN, Role.MANAGER]);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    this.requestUserService.assertCountry(currentUser.country, order.country);

    if (order.status === OrderStatus.CANCELED) {
      throw new BadRequestException('Order is already canceled');
    }

    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CANCELED },
      include: { items: true },
    });
  }

  @Mutation(() => PaymentMethodModel)
  async addPaymentMethod(
    @Context() context: GraphqlContext,
    @Args('input') input: AddPaymentMethodInput,
  ): Promise<PaymentMethodModel> {
    const currentUser = await this.getCurrentUser(context);
    this.requestUserService.assertRole(currentUser, [Role.ADMIN]);

    if (!/^\d{4}$/.test(input.last4)) {
      throw new BadRequestException('last4 must be exactly 4 digits');
    }

    const targetUser = await this.prisma.user.findUnique({ where: { id: input.userId } });
    if (!targetUser) {
      throw new BadRequestException('Target user not found');
    }

    this.requestUserService.assertCountry(currentUser.country, targetUser.country);

    return this.prisma.paymentMethod.create({
      data: {
        userId: targetUser.id,
        label: input.label,
        type: input.type,
        last4: input.last4,
      },
    });
  }

  @Mutation(() => PaymentMethodModel)
  async updatePaymentMethod(
    @Context() context: GraphqlContext,
    @Args('input') input: UpdatePaymentMethodInput,
  ): Promise<PaymentMethodModel> {
    const currentUser = await this.getCurrentUser(context);
    this.requestUserService.assertRole(currentUser, [Role.ADMIN]);

    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: input.id },
      include: { user: true },
    });

    if (!paymentMethod) {
      throw new BadRequestException('Payment method not found');
    }

    this.requestUserService.assertCountry(currentUser.country, paymentMethod.user.country);

    if (input.last4 && !/^\d{4}$/.test(input.last4)) {
      throw new BadRequestException('last4 must be exactly 4 digits');
    }

    if (!input.label && !input.last4 && !input.type) {
      throw new ForbiddenException('No fields provided for update');
    }

    return this.prisma.paymentMethod.update({
      where: { id: paymentMethod.id },
      data: {
        label: input.label,
        type: input.type as PaymentType | undefined,
        last4: input.last4,
      },
    });
  }

  private async getCurrentUser(context: GraphqlContext): Promise<User> {
    const userId = context.req.headers['x-user-id'];
    const normalizedUserId = Array.isArray(userId) ? userId[0] : userId;

    return this.requestUserService.fromHeader(normalizedUserId);
  }
}
