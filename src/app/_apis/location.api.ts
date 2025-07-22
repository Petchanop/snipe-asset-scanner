import { prisma } from "@/_libs/prisma"
import { Location } from "@/_types/types"

export async function getLocationById(location: number) : Promise<Location | null>{
    return await prisma.locations.findUnique({ where : { id: location }})
}