"use server"
import { Asset, AssetCount, User } from "@/_types/types";
import { prisma } from "@/_libs/prisma"
import { TResponse } from "@/_apis/next.api";

export async function getReportFromChildLocation(location: number) : Promise<AssetCount[]>{
    const result = await prisma.asset_count.findMany( { where: { location_id: location} })
    return result
}

export async function getReportFromParentLocation(location: number) : Promise<AssetCount[]>{
    const result = await prisma.asset_count.findMany( { where: { rtd_location_id: location} })
    return result
}

export async function getAssetsByLocation(
    location: number,
    limit: number = 10,
    offset: number = 0
) : Promise<TResponse<any[]>>{
    const result = await prisma.assets.findMany( {
        where: { location_id: location},
        select: {
            id: true,
            name: true,
            asset_tag: true,
            assigned_to: true
        },
        take: limit,
        skip: offset,
    })
    return { data: result , error: null }
}

export async function getAssetByLocationCount(locationId: number): Promise<number> {
    return await prisma.assets.count({ where: { location_id: locationId } });
}

export async function getUserByIdPrisma(userId: number) : Promise<Partial<User> | null> {
    return await prisma.users.findUnique({
        where: {
            id: userId
        },
        select: {
            first_name: true,
            last_name: true,
            id: true
        }
    })
}