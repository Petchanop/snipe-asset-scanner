import { AssetCount, AssetCountLine } from '@/_types/types'
import { prisma } from './prisma';

export type FCreateAssetCountReport = {
    document_number: string;
    document_date: Date;
    rtd_location_id: number | null;
    location_id: number | null;
    state: string;
}

export async function createAssetCountReport(
    payload: FCreateAssetCountReport)
    : Promise<AssetCount> {
    return await prisma.asset_count.create({
        data: payload
    })
}

export async function getAssetCountReportList(
    date: Date, locationId?: number)
    : Promise<AssetCount[]> {
    return await prisma.asset_count.findMany({
        where: {
            created_at: date,
            location_id: locationId
        }
    })
}

export async function getAssetCountReport(
    date: Date, locationId: number)
    : Promise<AssetCount | null> {
    return await prisma.asset_count.findFirst({
        where: {
            document_date: date,
            location_id: locationId
        }
    })
}

type FCreateAssetCountLine = {
    asset_count_id: number;
    asset_id: number;
    asset_code: string;
    asset_name: string;
    assigned_to: number | null;
    asset_check: boolean;
    checked_by: number | null;
    checked_on: Date;
    is_not_asset_loc: boolean;
    asset_name_not_correct: boolean;
}

export async function createAssetCountLine(payload: FCreateAssetCountLine)
    : Promise<AssetCountLine> {
    return await prisma.asset_count_line.create({ data: payload })
}

type FUpdateAssetCountLine = {
    assigned_to: number | null;
    asset_check: boolean;
    checked_by: number | null;
    checked_on: Date;
    is_not_asset_loc: boolean;
    asset_name_not_correct: boolean;
}

export async function UpdateAssetCountLine(
    countId: number, payload: FUpdateAssetCountLine)
    : Promise<AssetCountLine | null> {
    const assetCountLine = await getAssetCountLine(countId)
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

export async function getAssetCountLine(
    countId: number
): Promise<AssetCountLine | null> {
    return await prisma.asset_count_line.findUnique({
        where: {
            id: countId
        }
    })
}

export async function getAssetCountLineByAssetCount(
    assetCountId: number
): Promise<AssetCountLine[]> {
    return await prisma.asset_count_line.findMany({
        where: {
            asset_count_id: assetCountId
        }
    })
}