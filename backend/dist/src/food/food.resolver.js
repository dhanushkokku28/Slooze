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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const client_1 = require("@prisma/client");
const request_user_service_1 = require("../auth/request-user.service");
const prisma_service_1 = require("../prisma/prisma.service");
const graphql_models_1 = require("./graphql.models");
let FoodResolver = class FoodResolver {
    prisma;
    requestUserService;
    constructor(prisma, requestUserService) {
        this.prisma = prisma;
        this.requestUserService = requestUserService;
    }
    async demoUsers() {
        return this.prisma.user.findMany({ orderBy: { name: 'asc' } });
    }
    async me(context) {
        return this.getCurrentUser(context);
    }
    async restaurants(context) {
        const currentUser = await this.getCurrentUser(context);
        return this.prisma.restaurant.findMany({
            where: { country: currentUser.country },
            include: { menuItems: true },
            orderBy: { name: 'asc' },
        });
    }
    async orders(context) {
        const currentUser = await this.getCurrentUser(context);
        const whereClause = currentUser.role === client_1.Role.MEMBER
            ? { userId: currentUser.id }
            : { country: currentUser.country };
        return this.prisma.order.findMany({
            where: whereClause,
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async paymentMethods(context) {
        const currentUser = await this.getCurrentUser(context);
        if (currentUser.role !== client_1.Role.ADMIN) {
            return [];
        }
        return this.prisma.paymentMethod.findMany({
            where: { user: { country: currentUser.country } },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createOrder(context, input) {
        const currentUser = await this.getCurrentUser(context);
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: input.restaurantId },
            include: { menuItems: true },
        });
        if (!restaurant) {
            throw new common_1.BadRequestException('Restaurant not found');
        }
        this.requestUserService.assertCountry(currentUser.country, restaurant.country);
        if (input.items.length === 0) {
            throw new common_1.BadRequestException('At least one order item is required');
        }
        const menuItemsById = new Map(restaurant.menuItems.map((m) => [m.id, m]));
        let totalCents = 0;
        const orderItemsData = input.items.map((item) => {
            if (item.quantity <= 0) {
                throw new common_1.BadRequestException('Quantity must be greater than zero');
            }
            const menuItem = menuItemsById.get(item.menuItemId);
            if (!menuItem) {
                throw new common_1.BadRequestException(`Menu item ${item.menuItemId} does not belong to this restaurant`);
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
    async checkoutOrder(context, orderId) {
        const currentUser = await this.getCurrentUser(context);
        this.requestUserService.assertRole(currentUser, [client_1.Role.ADMIN, client_1.Role.MANAGER]);
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        this.requestUserService.assertCountry(currentUser.country, order.country);
        if (order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending orders can be checked out');
        }
        return this.prisma.order.update({
            where: { id: order.id },
            data: { status: client_1.OrderStatus.CHECKED_OUT },
            include: { items: true },
        });
    }
    async cancelOrder(context, orderId) {
        const currentUser = await this.getCurrentUser(context);
        this.requestUserService.assertRole(currentUser, [client_1.Role.ADMIN, client_1.Role.MANAGER]);
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        this.requestUserService.assertCountry(currentUser.country, order.country);
        if (order.status === client_1.OrderStatus.CANCELED) {
            throw new common_1.BadRequestException('Order is already canceled');
        }
        return this.prisma.order.update({
            where: { id: order.id },
            data: { status: client_1.OrderStatus.CANCELED },
            include: { items: true },
        });
    }
    async addPaymentMethod(context, input) {
        const currentUser = await this.getCurrentUser(context);
        this.requestUserService.assertRole(currentUser, [client_1.Role.ADMIN]);
        if (!/^\d{4}$/.test(input.last4)) {
            throw new common_1.BadRequestException('last4 must be exactly 4 digits');
        }
        const targetUser = await this.prisma.user.findUnique({ where: { id: input.userId } });
        if (!targetUser) {
            throw new common_1.BadRequestException('Target user not found');
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
    async updatePaymentMethod(context, input) {
        const currentUser = await this.getCurrentUser(context);
        this.requestUserService.assertRole(currentUser, [client_1.Role.ADMIN]);
        const paymentMethod = await this.prisma.paymentMethod.findUnique({
            where: { id: input.id },
            include: { user: true },
        });
        if (!paymentMethod) {
            throw new common_1.BadRequestException('Payment method not found');
        }
        this.requestUserService.assertCountry(currentUser.country, paymentMethod.user.country);
        if (input.last4 && !/^\d{4}$/.test(input.last4)) {
            throw new common_1.BadRequestException('last4 must be exactly 4 digits');
        }
        if (!input.label && !input.last4 && !input.type) {
            throw new common_1.ForbiddenException('No fields provided for update');
        }
        return this.prisma.paymentMethod.update({
            where: { id: paymentMethod.id },
            data: {
                label: input.label,
                type: input.type,
                last4: input.last4,
            },
        });
    }
    async getCurrentUser(context) {
        const userId = context.req.headers['x-user-id'];
        const normalizedUserId = Array.isArray(userId) ? userId[0] : userId;
        return this.requestUserService.fromHeader(normalizedUserId);
    }
};
exports.FoodResolver = FoodResolver;
__decorate([
    (0, graphql_1.Query)(() => [graphql_models_1.UserModel]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "demoUsers", null);
__decorate([
    (0, graphql_1.Query)(() => graphql_models_1.UserModel),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "me", null);
__decorate([
    (0, graphql_1.Query)(() => [graphql_models_1.RestaurantModel]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "restaurants", null);
__decorate([
    (0, graphql_1.Query)(() => [graphql_models_1.OrderModel]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "orders", null);
__decorate([
    (0, graphql_1.Query)(() => [graphql_models_1.PaymentMethodModel]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "paymentMethods", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_models_1.OrderModel),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, graphql_models_1.CreateOrderInput]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "createOrder", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_models_1.OrderModel),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "checkoutOrder", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_models_1.OrderModel),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "cancelOrder", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_models_1.PaymentMethodModel),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, graphql_models_1.AddPaymentMethodInput]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "addPaymentMethod", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_models_1.PaymentMethodModel),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, graphql_models_1.UpdatePaymentMethodInput]),
    __metadata("design:returntype", Promise)
], FoodResolver.prototype, "updatePaymentMethod", null);
exports.FoodResolver = FoodResolver = __decorate([
    (0, common_1.Injectable)(),
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        request_user_service_1.RequestUserService])
], FoodResolver);
//# sourceMappingURL=food.resolver.js.map