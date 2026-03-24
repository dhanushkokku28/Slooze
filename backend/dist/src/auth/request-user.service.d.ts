import { Country, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class RequestUserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    fromHeader(userId: string | undefined): Promise<User>;
    assertRole(user: User, allowed: Role[]): void;
    assertCountry(userCountry: Country, entityCountry: Country): void;
}
