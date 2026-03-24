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
exports.RequestUserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RequestUserService = class RequestUserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async fromHeader(userId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing x-user-id header');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid x-user-id header');
        }
        return user;
    }
    assertRole(user, allowed) {
        if (!allowed.includes(user.role)) {
            throw new common_1.ForbiddenException(`Role ${user.role} is not allowed to perform this action`);
        }
    }
    assertCountry(userCountry, entityCountry) {
        if (userCountry !== entityCountry) {
            throw new common_1.ForbiddenException('Cross-country access is forbidden by relationship policy');
        }
    }
};
exports.RequestUserService = RequestUserService;
exports.RequestUserService = RequestUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestUserService);
//# sourceMappingURL=request-user.service.js.map