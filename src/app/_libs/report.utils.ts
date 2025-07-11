'use server'
import { AssetCount, AssetCountLine } from '@/_types/types'
import { prisma } from './prisma';
import dayjs from 'dayjs';

export async function changeDateToIsoString(date : Date) : Promise<string> {
    const [month, day, year] = date.toLocaleDateString('th-Bk').split('/').map(Number);
    return (new Date(year!, month! - 1, day)).toISOString()
}

export async function createDocumentNumber(locationId: number, date: string) : Promise<string> {
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
    document_number: string;
    document_date: Date;
    rtd_location_id: number | null;
    location_id: number | null;
    state: string;
}

// const queryAssetCountSchema = Prisma.validator<Prisma.asset_countSelect>()({
//     id: true,
//     document_number: true,
//     document_date: true,
//     rtd_location_id : true,
//     location_id: true,
//     state: true
// })

export async function findAssetCount(document_number:string) : Promise<AssetCount | null> {
    return await prisma.asset_count.findFirst({
        where: {
           document_number: document_number
        }
    })
}

export async function createAssetCountReport(
    payload: FCreateAssetCountReport)
    : Promise<AssetCount> {
    return await prisma.asset_count.create({
        data: {
            document_number: payload.document_number,
            document_date: await changeDateToIsoString(payload.document_date),
            rtd_location_id: payload.rtd_location_id,
            location_id: payload.location_id,
            state: payload.state
        }
    })
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
    date: Date, locationId: number)
    : Promise<AssetCount | null> {
    return await prisma.asset_count.findFirst({
        where: {
            document_date: await changeDateToIsoString(date),
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
    assigned_to?: number | null;
    asset_check?: boolean;
    checked_by?: number | null;
    checked_on?: Date;
    is_not_asset_loc?: boolean;
    asset_name_not_correct?: boolean;
}

export async function UpdateAssetCountLine(
    countId: number, payload: FUpdateAssetCountLine)
    : Promise<AssetCountLine | null> {
    const assetCountLine = await getAssetCountLine(countId)
    payload.checked_on =  dayjs().toDate()
    console.log("update count line ", assetCountLine, payload)
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
    console.log("update id ", countId)
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