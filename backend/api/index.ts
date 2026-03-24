import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

let server: ((req: unknown, res: unknown) => void) | null = null;

async function bootstrapServer() {
  if (server) {
    return server;
  }

  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn'] },
  );

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000'];

  nestApp.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  await nestApp.init();

  server = expressApp;
  return server;
}

export default async function handler(req: unknown, res: unknown) {
  const activeServer = await bootstrapServer();
  activeServer(req, res);
}
