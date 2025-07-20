import path from 'node:path'
import type { PrismaConfig } from '@prisma/config'

export default {
    earlyAccess: true,
    schema: path.join('prisma')
} satisfies PrismaConfig