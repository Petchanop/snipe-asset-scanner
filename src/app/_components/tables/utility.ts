import { ConvertImageUrl } from "@/_libs/convert_url.utils";
import { TLocation } from "@/_types/snipe-it.type";
import { AssetCount, AssetCountLine, AssetCountLocation, TAssetRow, User } from "@/_types/types";
import { ChangeEvent, MouseEvent } from "react";
import { AssetResponse } from "@/api/snipe-it/snipe-it.api";
import { PNewCountTableProps } from "./new-count-table";
import dayjs from "dayjs";
import { AssetStatusEnum } from "@/_constants/constants";

export function emptyRows(page: number, rowsPerPage: number, rows: any[]): number {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
}

export function dataPerPage(data: any, page: number, rowsPerPage: number): any[] {
    return data.length ? data.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage) : []
}

export function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
    setPage: (number: number) => void,
    dataLength: number,
    rowsPerPage: number
) {
    if (newPage * rowsPerPage > dataLength) {
        setPage(Math.ceil(dataLength / rowsPerPage) - 1)
    } else {
        setPage(newPage)
    }
};

export function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement>,
    setRowsPerPage: (number: number) => void,
    setPage: (number: number) => void
) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};

function Comparator<T>(a: T, b: T, orderBy: keyof T) {
    const result = b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0
    if (orderBy == 'assignedTo') {
        for (const key in a[orderBy]) {
            return b[orderBy][key] < a[orderBy][key] ? -1 : b[orderBy][key] > a[orderBy][key] ? 1 : 0
        }
    }
    return result
}

export type Order = 'asc' | 'desc'

export function getComparator<T, Key extends keyof T>(
    order: Order,
    orderBy: Key
): (
    a: T,
    b: T
) => number {
    return order === 'desc'
        ? (a, b) => Comparator(a, b, orderBy)
        : (a, b) => -(Comparator(a, b, orderBy))
}

export function parseDataForCreateAssetCountLine(
    asset: AssetResponse,
    location: PNewCountTableProps,
    user: any,
    assetLocationId: AssetCountLocation,
    allLocation: TLocation[],
    assetCountReport: AssetCount
) {
    return {
        asset_count_id: assetCountReport.id!,
        asset_id: asset.id,
        asset_code: asset.asset_tag!,
        asset_name: asset.name!,
        assigned_to: asset.assigned_to?.id || null,
        asset_check: false,
        checked_by: parseInt(user.id),
        checked_on: dayjs().toDate(),
        is_not_asset_loc: asset.location?.id != location.id,
        asset_name_not_correct: false,
        asset_count_line_location_id: assetLocationId?.id as string,
        asset_count_line_status_id: AssetStatusEnum.DEPLOYABLE,
        previous_loc_id: allLocation.find((loc) => loc.id == asset.location)?.id,
        image: asset.image as string
    }
}

export function mapAssetData(asset: AssetCountLine, data: User, prev_loc: TLocation, baseUrl: string): TAssetRow {
    return {
        id: asset.id,
        assetCode: asset.asset_code,
        assetName: asset.asset_name,
        assignedTo: {
            id: asset.assigned_to,
            first_name: data ? data!.first_name : null,
            last_name: data ? data!.last_name : null
        },
        countCheck: asset.asset_check ? asset.asset_check : false,
        notInLocation: asset.is_not_asset_loc ? asset.is_not_asset_loc : false,
        assignIncorrect: asset.is_assigned_incorrectly,
        status: asset.asset_count_line_status_id,
        prev_location: prev_loc?.name,
        image: ConvertImageUrl(baseUrl, asset.image as string),
        remarks: asset.remarks
    } as unknown as TAssetRow
}



