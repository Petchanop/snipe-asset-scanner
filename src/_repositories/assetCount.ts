'use server'
import { prisma } from "@/_libs/prisma"
import { changeDateToIsoString } from "@/_libs/assetCount";
import { AssetCount, FCreateAssetCountReport } from "@/_types/types";
import { AssetCountWithAssetLocation } from "@/_types/interfaces";

export async function createAssetCountReport(
    payload: FCreateAssetCountReport)
    : Promise<AssetCount> {
    if (payload.id != "" && payload.id != undefined) {
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

export async function getAssetCountByDocumentNumber(documentNumber: string) : Promise<AssetCountWithAssetLocation>{
    return  await prisma.asset_count.findUnique({
        where: {
          document_number: parseInt(documentNumber)
        },
        include: {
          AssetCountLocation: true
        }
      }) as AssetCountWithAssetLocation
}