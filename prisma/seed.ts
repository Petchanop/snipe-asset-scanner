import { PrismaClient } from './generated/prisma';

 const assetStatusOptions: { value: string, label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'deployable', label: 'Deployable' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'sold out', label: 'Sold Out' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'archived', label: 'Archived' },
  { value: 'disposed', label: 'Disposed' }
];

const prisma = new PrismaClient()
async function main() {
    for (const [index, element] of assetStatusOptions.entries()){
        await prisma.asset_status.upsert({
            where : { id: index + 1 },
            update: {},
            create: {
                name: element.value,
                label: element.label,
                description: ""
            }
        })
    }
}

main().catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
}).finally(async () => await prisma.$disconnect)