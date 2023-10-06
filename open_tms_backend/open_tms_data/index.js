import { PrismaClient } from '@prisma/client';
import { env } from '@appblocks/node-sdk';

env.init();

const prisma = new PrismaClient();

export default { prisma }
