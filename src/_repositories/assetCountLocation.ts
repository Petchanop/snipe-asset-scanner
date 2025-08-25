'use server'
import { prisma } from "@/_libs/prisma"
import { AssetCountLocation } from "@/_types/types"

export async function CreateAssetCountLocation(
    locationId: number, assetCountId: string
): Promise<AssetCountLocation | Error> {
    try {
        return await prisma.asset_count_location.create({
            data: {
                location_id: locationId,
                asset_count_id: assetCountId,
            }
        })
    } catch (error) {
        return error as Error
    }
}

export async function GetAssetCountLocationByAssetCountReport(
    assetCountId: string
): Promise<AssetCountLocation[]> {
    return await prisma.asset_count_location.findMany({
        where: {
            asset_count_id: assetCountId
        }
    })
}

export async function UpdateAssetCountLocationByAssetCountId(
    assetCountId: string,
    asestCountLocationId: string,
    locationId: number): Promise<AssetCountLocation> {
    return await prisma.asset_count_location.upsert({
        where: {
            id: asestCountLocationId
        },
        update: {
            location_id: locationId
        },
        create: {
            asset_count_id: assetCountId,
            location_id: locationId
        }
    })
}

export async function FindAssetCountLocationByAssetCountId(
    assetCountId: string, locationId: number
): Promise<AssetCountLocation | null> {
    return await prisma.asset_count_location.findFirst({
        where: {
            asset_count_id: assetCountId,
            location_id: locationId
        }
    })
}

export async function DeleteAssetCountLocationByAssetCountId(
    assetCountLocationId: string, assetCountId: string, locationId: number
) {
    try {
        await prisma.asset_count_location.delete({
            where: {
                id: assetCountLocationId,
                asset_count_id: assetCountId,
                location_id: locationId
            }
        })
    } catch (error) {
        return error
    }
}