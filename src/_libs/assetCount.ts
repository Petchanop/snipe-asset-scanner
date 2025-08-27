'use server'
import { AssetCount, AssetCountLine, CFiltertype, TFilter } from '@/_types/types'
import { prisma } from './prisma';
import dayjs from 'dayjs';
import { ReportState } from '@/_constants/constants';
import { getAssetCountLineByCodeOrName } from '@/_repositories/assetCountLine';

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

export async function CheckAllDataCount(assetCountId: string): Promise<boolean> {
    const assetInReport = await prisma.asset_count_line.findMany({
        where: {
            asset_count_id: assetCountId
        }
    })
    return assetInReport.every((asset: AssetCountLine) => asset.asset_check == true)
}

export async function filterReportBytype(data: AssetCount[], filter: TFilter) : Promise<AssetCount[]> {
    switch (filter.type) {
        case CFiltertype.STATUS:
            if (filter.key == ReportState.ALL)
                return data
            return data.filter((items) => items.state == filter.key)
        case CFiltertype.DATE:
            const minMaxDate = filter.key.split(' ')
            const minDate = dayjs(minMaxDate[0], 'MM-DD-YYYY').toDate()
            const maxDate = dayjs(minMaxDate[1], 'MM-DD-YYYY').toDate()
            return data.filter((items) => items.document_date >= minDate
                && items.document_date <= maxDate)
        case CFiltertype.NAME:
            return data.filter((items) => items.document_name?.includes(filter.key))
        case CFiltertype.ASSET:
            return Promise.resolve(getAssetCountLineByCodeOrName(filter.key)).then((assets) => {
                return data.filter((items) => assets?.filter((asset) => items.id == asset.asset_count_id)) as AssetCount[]
            })
    }
    return data
}
