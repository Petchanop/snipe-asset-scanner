'use server'
import { AssetCount, AssetCountLine } from '@/_types/types'
import { prisma } from '@/_libs/prisma';
import dayjs from 'dayjs';
import { AssetResponse } from '@/api/snipe-it/snipe-it.api';
import { createGateway, TResponse } from '@/api/next.api';


export async function changeDateToIsoString(date: Date): Promise<string> {
    date.setUTCHours(0, 0, 0, 0)
    return date.toISOString()
}

export async function createDocumentNumber(locationId: number, date: string): Promise<string> {
    let divided = locationId
    let i = 0
    while (Math.floor(divided)) {
        divided /= 10
        i++
    }
    const fillZero = '0'.repeat(3 - i)
    const formatDate = date.split('/').join('')
    const beforeEncryptString = `${fillZero}${locationId}${formatDate}`
    return beforeEncryptString
}

export type FCreateAssetCountReport = {
    id?: string;
    created_by?: number | null;
    document_name?: string | null;
    document_date?: Date | null;
    state?: string;
}

export async function getAllAssetCount(): Promise<AssetCount[]> {
    return await prisma.asset_count.findMany()
}

export async function findAssetCount(document_number: number): Promise<AssetCount | null> {
    return await prisma.asset_count.findFirst({
        where: {
            document_number: document_number
        }
    })
}

export async function createAssetCountReport(
    payload: FCreateAssetCountReport)
    : Promise<AssetCount> {
    if (payload.id) {
        return await prisma.asset_count.update({
            where: {
                id: payload.id,
            },
            data: {
                document_name: payload.document_name,
                document_date: await changeDateToIsoString(payload.document_date!),
                state: payload.state as string
            }
        })
    } else {
        return await prisma.asset_count.create({
            data: {
                created_by: payload.created_by,
                document_name: payload.document_name,
                document_date: await changeDateToIsoString(payload.document_date!),
                state: payload.state as string
            }
        })
    }
}

export async function updateAssetCountReport(
    documentNumber: number, payload: FCreateAssetCountReport)
    : Promise<AssetCount | null> {
    const assetCount = await findAssetCount(documentNumber)
    if (assetCount) {
        return await prisma.asset_count.update({
            where: {
                document_number: documentNumber
            },
            data: {
                document_name: payload.document_name,
                document_date: payload.document_date as Date,
                state: payload.state
            }
        })
    }
    return null
}

export async function getAssetCountReportList(
    date: Date, locationId?: number)
    : Promise<AssetCount[]> {
    return await prisma.asset_count.findMany({
        where: {
            created_at: await changeDateToIsoString(date),
            location_id: locationId
        }
    })
}

export async function getAssetCountReport(
    documentNumber: number, location?: boolean, assetCountLine?: boolean)
    : Promise<AssetCount | null> {
    return await prisma.asset_count.findUnique({
        where: {
            document_number: documentNumber
        },
        include: {
            AssetCountLocation: location ? location : true,
            AssetCountLine: assetCountLine ? assetCountLine : false
        }
    })
}

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

export async function createAssetCountLine(payload: FCreateAssetCountLine)
    : Promise<AssetCountLine> {
    return await prisma.asset_count_line.create({ data: payload })
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
        },
    })
    return result
}

export async function getAssetByLocationId(
    locationId: number
): Promise<TResponse<AssetResponse[]>> {
    const client = await createGateway();
    const { data, error } = await client.GET("/hardware", {
        params: {
            query: { location_id: locationId }
        }
    })
    if (error) {
        return { data: null, error: error }
    }
    return { data: data.rows as AssetResponse[], error: null }
}

export async function CheckAllDataCount(assetCountId: string): Promise<boolean> {
    const assetInReport = await prisma.asset_count_line.findMany({
        where: {
            asset_count_id: assetCountId
        }
    })
    return assetInReport.every((asset) => asset.asset_check == true)
}