"use server"
import { AssetCount, AssetCountLine, User } from "@/_types/types";
import { prisma } from "@/_libs/prisma"
import { TResponse } from "@/_apis/next.api";
import dayjs from "dayjs";
import { ExtendAssetResponse } from "@/_components/tables/search-asset";
import { assetStatusOptions } from "@/_constants/constants";

export async function getReportFromChildLocation(location: number): Promise<AssetCount[]> {
    const result = await prisma.asset_count.findMany({ where: { location_id: location } })
    return result
}

export async function getReportFromParentLocation(location: number): Promise<AssetCount[]> {
    const result = await prisma.asset_count.findMany({
        where: {
            OR: [
                {
                    rtd_location_id: location
                },
                {
                    location_id: location
                }
            ]
        }
    })
    return result
}

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

export async function getUserByIdPrisma(userId: number): Promise<Partial<User> | null> {
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

export async function findStatusId(data: ExtendAssetResponse) : Promise<number> {
    console.log(data.status_label?.status_meta)
    return assetStatusOptions.find((status) => status.value.includes(data.status))?.id  as number
}

export async function AddAssetCountLine(data: ExtendAssetResponse, assetCountReport: AssetCount): Promise<AssetCountLine> {
    const findLatest = await prisma.asset_count_line.findFirst({
        where: {
            asset_count_id: assetCountReport.id!,
            asset_code: data.asset_tag
        },
        orderBy: {}
    })
    return await prisma.asset_count_line.upsert({
        where: {
            id: findLatest?.id,
            asset_code: data.asset_tag!
        },
        update: {
            asset_count_id: assetCountReport.id,
            asset_name: data.name!,
            checked_on: dayjs().toDate(),
            is_not_asset_loc: data.is_not_asset_loc,
        },
        create: {
            asset_check: false,
            asset_id: data.id,
            asset_name: data.name!,
            asset_code: data.asset_tag!,
            asset_count_id: assetCountReport.id,
            assigned_to: data.assigned_to?.id,
            asset_name_not_correct: false,
            is_not_asset_loc: data.is_not_asset_loc,
            checked_on: dayjs().toDate(),
            asset_count_line_status_id: await findStatusId(data)
        }
    })
}

export async function DeleteAssetCountLine(assetCountId: string, assetTag: string): Promise<AssetCountLine | null> {
    return await prisma.asset_count_line.delete({
        where: {
            asset_count_id: assetCountId,
            asset_code: assetTag
        }
    })
}

export async function GetAllUserPrisma(): Promise<User[]> {
    return await prisma.users.findMany()
}