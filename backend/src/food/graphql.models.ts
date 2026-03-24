import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Country, OrderStatus, PaymentType, Role } from '@prisma/client';

registerEnumType(Role, { name: 'Role' });
registerEnumType(Country, { name: 'Country' });
registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(PaymentType, { name: 'PaymentType' });

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => Country)
  country!: Country;
}

@ObjectType()
export class MenuItemModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Int)
  priceCents!: number;

  @Field(() => ID)
  restaurantId!: string;
}

@ObjectType()
export class RestaurantModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Country)
  country!: Country;

  @Field(() => [MenuItemModel])
  menuItems!: MenuItemModel[];
}

@ObjectType()
export class OrderItemModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Int)
  unitPriceCents!: number;

  @Field(() => ID)
  menuItemId!: string;

  @Field(() => ID)
  orderId!: string;
}

@ObjectType()
export class OrderModel {
  @Field(() => ID)
  id!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field(() => Int)
  totalCents!: number;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field(() => Country)
  country!: Country;

  @Field()
  createdAt!: Date;

  @Field(() => [OrderItemModel])
  items!: OrderItemModel[];
}

@ObjectType()
export class PaymentMethodModel {
  @Field(() => ID)
  id!: string;

  @Field()
  label!: string;

  @Field(() => PaymentType)
  type!: PaymentType;

  @Field()
  last4!: string;

  @Field(() => ID)
  userId!: string;
}

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  menuItemId!: string;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  restaurantId!: string;

  @Field(() => [OrderItemInput])
  items!: OrderItemInput[];
}

@InputType()
export class AddPaymentMethodInput {
  @Field(() => ID)
  userId!: string;

  @Field()
  label!: string;

  @Field(() => PaymentType)
  type!: PaymentType;

  @Field()
  last4!: string;
}

@InputType()
export class UpdatePaymentMethodInput {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  label?: string;

  @Field(() => PaymentType, { nullable: true })
  type?: PaymentType;

  @Field({ nullable: true })
  last4?: string;
}
