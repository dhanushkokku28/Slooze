import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { RequestUserService } from './auth/request-user.service';
import { FoodResolver } from './food/food.resolver';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      sortSchema: true,
      path: '/graphql',
    }),
  ],
  providers: [FoodResolver, RequestUserService],
})
export class AppModule {}
