"use server"
import { AssetCount, AssetCountLine, AssetCountLocation, User } from "@/_types/types";
import { prisma } from "@/_libs/prisma"
import { TResponse } from "@/api/next.api";
import dayjs from "dayjs";
import { ExtendAssetResponse } from "@/_components/tables/search-asset";
import { AssetStatusEnum, assetStatusOptions } from "@/_constants/constants";
import { createAssetCountLine } from "@/_libs/report.utils";

export async function getReportFromChildLocation(location: number): Promise<AssetCount[]> {
    const result = await prisma.asset_count_location.findMany({
        where: {
            location_id: location, // Replace with actual ID
        },
        include: {
            count_id: true, // This pulls the related asset_count
        }
    })
    return result.map((item: { count_id: any; }) => item.count_id);
}

export async function getReportFromParentLocation(location: number): Promise<AssetCount[]> {
    const result = await prisma.asset_count_location.findMany({
        where: {
            location_id: location, // Replace with actual ID
        },
        include: {
            count_id: true, // This pulls the related asset_count
        }
    })
    return result.map((item: { count_id: any; }) => item.count_id);
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

export async function findStatusId(data: ExtendAssetResponse): Promise<number> {
    return assetStatusOptions.find((status) => status.value == data.status)?.id || 2;
}

export async function AddAssetCountLine(data: ExtendAssetResponse, assetCountReport: AssetCount): Promise<AssetCountLine> {
    const findLatest = await prisma.asset_count_line.findFirst({
        where: {
            asset_count_id: assetCountReport.id!,
            asset_code: data.asset_tag,
            asset_count_line_location_id: data.location_id
        },
        orderBy: {}
    })
    if (!findLatest) {
        return await createAssetCountLine({
            asset_count_id: assetCountReport.id!,
            asset_id: data.id,
            asset_code: data.asset_tag!,
            asset_name: data.name!,
            assigned_to: data.assigned_to?.id || null,
            asset_check: data.asset_check,
            checked_by: null,
            checked_on: dayjs().toDate(),
            is_not_asset_loc: data.is_not_asset_loc,
            asset_name_not_correct: false,
            asset_count_line_location_id: data.location_id,
            asset_count_line_status_id: AssetStatusEnum.DEPLOYABLE,
            previous_loc_id: data.prev_location?.id
        })
    }
    return await prisma.asset_count_line.upsert({
        where: {
            id: findLatest?.id,
            asset_code: data.asset_tag!,
            asset_count_id: assetCountReport.id
        },
        update: {
            asset_count_id: assetCountReport.id,
            asset_name: data.name!,
            checked_on: dayjs().toDate(),
            is_assigned_incorrectly: data.is_assigned_incorrectly,
            is_not_asset_loc: data.is_not_asset_loc,
            asset_check: data.asset_check,
            asset_count_line_status_id: await findStatusId(data),
            previous_loc_id: data.prev_location?.id
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
            asset_count_line_location_id: data.location_id,
            asset_count_line_status_id: await findStatusId(data),
            previous_loc_id: data.prev_location?.id
        }
    })
}

export async function DeleteAssetCountLine(assetCountId: string, id: string): Promise<AssetCountLine | null> {
    return await prisma.asset_count_line.delete({
        where: {
            id: id,
            asset_count_id: assetCountId,
        }
    })
}

export async function GetAllUserPrisma(): Promise<User[]> {
    return await prisma.users.findMany()
}

export async function CreateAssetCountLocation(locationId: number, assetCountId: string): Promise<AssetCountLocation | Error> {
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

export async function GetAssetCountLocationByAssetCountReport(assetCountId: string): Promise<AssetCountLocation[]> {
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

export async function FindAssetCountLocationByAssetCountId(assetCountId: string, locationId: number): Promise<AssetCountLocation | null> {
    return await prisma.asset_count_location.findFirst({
        where: {
            asset_count_id: assetCountId,
            location_id: locationId
        }
    })
}

export async function DeleteAssetCountLocationByAssetCountId(assetCountLocationId: string, assetCountId: string, locationId: number) {
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