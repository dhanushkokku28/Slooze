import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Country, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestUserService {
  constructor(private readonly prisma: PrismaService) {}

  async fromHeader(userId: string | undefined): Promise<User> {
    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id header');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Invalid x-user-id header');
    }

    return user;
  }

  assertRole(user: User, allowed: Role[]): void {
    if (!allowed.includes(user.role)) {
      throw new ForbiddenException(
        `Role ${user.role} is not allowed to perform this action`,
      );
    }
  }

  assertCountry(userCountry: Country, entityCountry: Country): void {
    if (userCountry !== entityCountry) {
      throw new ForbiddenException(
        'Cross-country access is forbidden by relationship policy',
      );
    }
  }
}
