"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.user.deleteMany();
    const [indiaAdmin, indiaManager, indiaMember] = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Aarav Admin',
                email: 'aarav.admin@slooze.dev',
                role: client_1.Role.ADMIN,
                country: client_1.Country.INDIA,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Meera Manager',
                email: 'meera.manager@slooze.dev',
                role: client_1.Role.MANAGER,
                country: client_1.Country.INDIA,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Rohan Member',
                email: 'rohan.member@slooze.dev',
                role: client_1.Role.MEMBER,
                country: client_1.Country.INDIA,
            },
        }),
    ]);
    const [usaAdmin, usaManager, usaMember] = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Avery Admin',
                email: 'avery.admin@slooze.dev',
                role: client_1.Role.ADMIN,
                country: client_1.Country.AMERICA,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Mason Manager',
                email: 'mason.manager@slooze.dev',
                role: client_1.Role.MANAGER,
                country: client_1.Country.AMERICA,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Harper Member',
                email: 'harper.member@slooze.dev',
                role: client_1.Role.MEMBER,
                country: client_1.Country.AMERICA,
            },
        }),
    ]);
    await Promise.all([
        prisma.paymentMethod.create({
            data: {
                userId: indiaMember.id,
                label: 'Rohan Visa',
                type: client_1.PaymentType.CARD,
                last4: '4242',
            },
        }),
        prisma.paymentMethod.create({
            data: {
                userId: usaMember.id,
                label: 'Harper Debit',
                type: client_1.PaymentType.CARD,
                last4: '1337',
            },
        }),
    ]);
    await prisma.restaurant.create({
        data: {
            name: 'Mumbai Masala House',
            country: client_1.Country.INDIA,
            menuItems: {
                create: [
                    { name: 'Paneer Tikka Wrap', priceCents: 34900 },
                    { name: 'Butter Chicken Bowl', priceCents: 45900 },
                    { name: 'Mango Lassi', priceCents: 14900 },
                ],
            },
        },
    });
    await prisma.restaurant.create({
        data: {
            name: 'Bangalore Bite Lab',
            country: client_1.Country.INDIA,
            menuItems: {
                create: [
                    { name: 'Mysore Masala Dosa', priceCents: 29900 },
                    { name: 'Ghee Podi Idli', priceCents: 23900 },
                    { name: 'Filter Coffee', priceCents: 9900 },
                ],
            },
        },
    });
    await prisma.restaurant.create({
        data: {
            name: 'Austin Smoke Yard',
            country: client_1.Country.AMERICA,
            menuItems: {
                create: [
                    { name: 'Smoked Brisket Plate', priceCents: 1899 },
                    { name: 'Cornbread Stack', priceCents: 699 },
                    { name: 'Sweet Tea', priceCents: 299 },
                ],
            },
        },
    });
    await prisma.restaurant.create({
        data: {
            name: 'Seattle Green Fork',
            country: client_1.Country.AMERICA,
            menuItems: {
                create: [
                    { name: 'Wild Salmon Salad', priceCents: 1699 },
                    { name: 'Avocado Grain Bowl', priceCents: 1499 },
                    { name: 'Blueberry Kombucha', priceCents: 499 },
                ],
            },
        },
    });
    console.log('Seed complete');
    console.log('India Admin:', indiaAdmin.id);
    console.log('India Manager:', indiaManager.id);
    console.log('USA Admin:', usaAdmin.id);
    console.log('USA Manager:', usaManager.id);
}
main()
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map