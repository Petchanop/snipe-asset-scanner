"use server"
import { AssetCount, AssetCountLine, ExtendAssetResponse } from "@/_types/types";
import { prisma } from "@/_libs/prisma"
import dayjs from "dayjs";
import { AssetStatusEnum, assetStatusOptions } from "@/_constants/constants";

type FCreateAssetCountLine = {
    asset_count_id: string;
    asset_id: number;
    asset_code: string;
    asset_name: string;
    assigned_to: number | null;
    asset_check: boolean;
    checked_by: number | null;
    checked_on: Date;
    is_not_asset_loc: boolean;
    asset_name_not_correct: boolean;
    asset_count_line_location_id: string;
    asset_count_line_status_id: number;
    previous_loc_id?: number;
    image?: string;
}

type FUpdateAssetCountLine = {
    assigned_to?: number | null;
    asset_check?: boolean;
    checked_by?: number | null;
    checked_on?: Date;
    is_not_asset_loc?: boolean;
    is_assigned_incorrectly?: boolean;
    asset_name_not_correct?: boolean;
    asset_count_line_status_id?: number;
    image?: string;
    remarks?: string;
    owned_by?: number | null;
}

export async function findStatusId(data: ExtendAssetResponse): Promise<number> {
    return assetStatusOptions.find((status) => status.value == data.status)?.id || 2;
}

export async function BulkCreateAssetCountLine(data: any[]) {
    await prisma.asset_count_line.createMany({ data: data })
}

export async function createAssetCountLine(payload: FCreateAssetCountLine)
    : Promise<AssetCountLine> {
    return await prisma.asset_count_line.create({ data: payload })
}

export async function AddAssetCountLine(data: ExtendAssetResponse, assetCountReport: AssetCount): Promise<AssetCountLine> {
    const findLatest = await prisma.asset_count_line.findFirst({
        where: {
            asset_count_id: assetCountReport.id!,
            asset_code: data.asset_tag,
            asset_name: data.name,
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
            checked_by: data.checked_by,
            checked_on: dayjs().toDate(),
            is_not_asset_loc: data.is_not_asset_loc,
            asset_name_not_correct: false,
            asset_count_line_location_id: data.location_id,
            asset_count_line_status_id: AssetStatusEnum.DEPLOYABLE,
            previous_loc_id: data.prev_location?.id,
            image: data.image
        })
    }
    return await prisma.asset_count_line.update({
        where: {
            id: findLatest?.id,
            asset_code: data.asset_tag!,
            asset_count_id: assetCountReport.id
        },
        data: {
            asset_count_id: assetCountReport.id,
            asset_name: data.name!,
            checked_on: dayjs().toDate(),
            is_assigned_incorrectly: data.is_assigned_incorrectly,
            is_not_asset_loc: data.is_not_asset_loc,
            asset_check: data.asset_check,
            asset_count_line_status_id: await findStatusId(data),
            previous_loc_id: data.prev_location?.id,
            image: data.image
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

export async function getAssetCountLine(
    countId: string
): Promise<AssetCountLine | null> {
    return await prisma.asset_count_line.findUnique({
        where: {
            id: countId
        }
    })
}

export async function getAssetCountLineByAssetCount(
    assetCountId: string, location_id: string
): Promise<AssetCountLine[]> {
    const result = await prisma.asset_count_line.findMany({
        where: {
            asset_count_id: assetCountId,
            asset_count_line_location_id: location_id
        }
    })
    return result
}

export async function UpdateAssetCountLine(
    countId: string, payload: FUpdateAssetCountLine)
    : Promise<AssetCountLine | null> {
    const assetCountLine = await getAssetCountLine(countId)
    payload.checked_on = dayjs().toDate()
    if (assetCountLine) {
        return await prisma.asset_count_line.update({
            where: {
                id: countId
            },
            data: payload
        })
    }
    return null
}

export async function getAssetCountLineByCodeOrName(
    keyword: string
): Promise<AssetCountLine[] | null> {
    const result = await prisma.asset_count_line.findMany({
        where: {
            OR: [
                { asset_code: { contains: keyword } },
                { asset_name: { contains: keyword } }
            ]
        }
    })
    return result
}