"use server"
import { Asset, AssetCount } from "@/_types/types";
import { prisma } from "@/_libs/prisma"

export async function getReportFromChildLocation(location: number) : Promise<AssetCount[]>{
    const result = await prisma.asset_count.findMany( { where: { location_id: location} })
    return result
}

export async function getReportFromParentLocation(location: number) : Promise<AssetCount[]>{
    const result = await prisma.asset_count.findMany( { where: { rtd_location_id: location} })
    return result
}

export async function getAssetsByLocation(location: number ) : Promise<Asset[]>{
    return await prisma.assets.findMany( { where: { location_id: location}})
}