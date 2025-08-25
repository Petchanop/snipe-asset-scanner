'use server'
import { TResponse } from "@/_intergrations/next.api";
import { prisma } from "@/_libs/prisma"

export async function getAssetsByLocation(
    location: number,
    limit: number = 10,
    offset: number = 0
): Promise<TResponse<any[]>> {
    const result = await prisma.assets.findMany({
        where: { location_id: location },
        select: {
            id: true,
            name: true,
            asset_tag: true,
            assigned_to: true
        },
        take: limit,
        skip: offset,
    })
    return { data: result, error: null }
}

export async function getAssetByLocationCount(locationId: number): Promise<number> {
    return await prisma.assets.count({ where: { location_id: locationId } });
}
