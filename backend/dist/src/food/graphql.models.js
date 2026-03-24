"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentMethodInput = exports.AddPaymentMethodInput = exports.CreateOrderInput = exports.OrderItemInput = exports.PaymentMethodModel = exports.OrderModel = exports.OrderItemModel = exports.RestaurantModel = exports.MenuItemModel = exports.UserModel = void 0;
const graphql_1 = require("@nestjs/graphql");
const client_1 = require("@prisma/client");
(0, graphql_1.registerEnumType)(client_1.Role, { name: 'Role' });
(0, graphql_1.registerEnumType)(client_1.Country, { name: 'Country' });
(0, graphql_1.registerEnumType)(client_1.OrderStatus, { name: 'OrderStatus' });
(0, graphql_1.registerEnumType)(client_1.PaymentType, { name: 'PaymentType' });
let UserModel = class UserModel {
    id;
    name;
    email;
    role;
    country;
};
exports.UserModel = UserModel;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UserModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserModel.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.Role),
    __metadata("design:type", String)
], UserModel.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.Country),
    __metadata("design:type", String)
], UserModel.prototype, "country", void 0);
exports.UserModel = UserModel = __decorate([
    (0, graphql_1.ObjectType)()
], UserModel);
let MenuItemModel = class MenuItemModel {
    id;
    name;
    priceCents;
    restaurantId;
};
exports.MenuItemModel = MenuItemModel;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], MenuItemModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MenuItemModel.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], MenuItemModel.prototype, "priceCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], MenuItemModel.prototype, "restaurantId", void 0);
exports.MenuItemModel = MenuItemModel = __decorate([
    (0, graphql_1.ObjectType)()
], MenuItemModel);
let RestaurantModel = class RestaurantModel {
    id;
    name;
    country;
    menuItems;
};
exports.RestaurantModel = RestaurantModel;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RestaurantModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RestaurantModel.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.Country),
    __metadata("design:type", String)
], RestaurantModel.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(() => [MenuItemModel]),
    __metadata("design:type", Array)
], RestaurantModel.prototype, "menuItems", void 0);
exports.RestaurantModel = RestaurantModel = __decorate([
    (0, graphql_1.ObjectType)()
], RestaurantModel);
let OrderItemModel = class OrderItemModel {
    id;
    quantity;
    unitPriceCents;
    menuItemId;
    orderId;
};
exports.OrderItemModel = OrderItemModel;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderItemModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItemModel.prototype, "quantity", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItemModel.prototype, "unitPriceCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderItemModel.prototype, "menuItemId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderItemModel.prototype, "orderId", void 0);
exports.OrderItemModel = OrderItemModel = __decorate([
    (0, graphql_1.ObjectType)()
], OrderItemModel);
let OrderModel = class OrderModel {
    id;
    status;
    totalCents;
    userId;
    restaurantId;
    country;
    createdAt;
    items;
};
exports.OrderModel = OrderModel;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.OrderStatus),
    __metadata("design:type", String)
], OrderModel.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderModel.prototype, "totalCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderModel.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderModel.prototype, "restaurantId", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.Country),
    __metadata("design:type", String)
], OrderModel.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], OrderModel.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderItemModel]),
    __metadata("design:type", Array)
], OrderModel.prototype, "items", void 0);
exports.OrderModel = OrderModel = __decorate([
    (0, graphql_1.ObjectType)()
], OrderModel);
let PaymentMethodModel = class PaymentMethodModel {
    id;
    label;
    type;
    last4;
    userId;
};
exports.PaymentMethodModel = PaymentMethodModel;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PaymentMethodModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PaymentMethodModel.prototype, "label", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.PaymentType),
    __metadata("design:type", String)
], PaymentMethodModel.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PaymentMethodModel.prototype, "last4", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PaymentMethodModel.prototype, "userId", void 0);
exports.PaymentMethodModel = PaymentMethodModel = __decorate([
    (0, graphql_1.ObjectType)()
], PaymentMethodModel);
let OrderItemInput = class OrderItemInput {
    menuItemId;
    quantity;
};
exports.OrderItemInput = OrderItemInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderItemInput.prototype, "menuItemId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItemInput.prototype, "quantity", void 0);
exports.OrderItemInput = OrderItemInput = __decorate([
    (0, graphql_1.InputType)()
], OrderItemInput);
let CreateOrderInput = class CreateOrderInput {
    restaurantId;
    items;
};
exports.CreateOrderInput = CreateOrderInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], CreateOrderInput.prototype, "restaurantId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderItemInput]),
    __metadata("design:type", Array)
], CreateOrderInput.prototype, "items", void 0);
exports.CreateOrderInput = CreateOrderInput = __decorate([
    (0, graphql_1.InputType)()
], CreateOrderInput);
let AddPaymentMethodInput = class AddPaymentMethodInput {
    userId;
    label;
    type;
    last4;
};
exports.AddPaymentMethodInput = AddPaymentMethodInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], AddPaymentMethodInput.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AddPaymentMethodInput.prototype, "label", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.PaymentType),
    __metadata("design:type", String)
], AddPaymentMethodInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AddPaymentMethodInput.prototype, "last4", void 0);
exports.AddPaymentMethodInput = AddPaymentMethodInput = __decorate([
    (0, graphql_1.InputType)()
], AddPaymentMethodInput);
let UpdatePaymentMethodInput = class UpdatePaymentMethodInput {
    id;
    label;
    type;
    last4;
};
exports.UpdatePaymentMethodInput = UpdatePaymentMethodInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdatePaymentMethodInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdatePaymentMethodInput.prototype, "label", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.PaymentType, { nullable: true }),
    __metadata("design:type", String)
], UpdatePaymentMethodInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdatePaymentMethodInput.prototype, "last4", void 0);
exports.UpdatePaymentMethodInput = UpdatePaymentMethodInput = __decorate([
    (0, graphql_1.InputType)()
], UpdatePaymentMethodInput);
//# sourceMappingURL=graphql.models.js.map