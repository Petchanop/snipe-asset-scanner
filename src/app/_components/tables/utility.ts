import { ConvertImageUrl } from "@/_libs/convert_url.utils";
import { TLocation } from "@/_types/snipe-it.type";
import { AssetCountLine, AssetCountLocation, TAssetRow, User } from "@/_types/types";
import { ChangeEvent, MouseEvent } from "react";
import { ExtendAssetResponse } from "./search-asset";
import { AssetResponse } from "@/api/snipe-it/snipe-it.api";
import { PNewCountTableProps } from "./new-count-table";

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
    asset : AssetResponse,
    location : PNewCountTableProps,
    user: any,
    assetLocationId: AssetCountLocation,
    allLocation : TLocation[]
): ExtendAssetResponse {
    return {
        ...asset,
        asset_name_not_correct: false,
        is_not_asset_loc: asset.location?.id != location.id,
        is_assigned_incorrectly: false,
        asset_check: false,
        checked_by: parseInt(user.id),
        in_report: false,
        location_id: assetLocationId?.id as string,
        status: asset.status_label?.status_meta as string,
        prev_location: allLocation.find((loc) => loc.id == asset.location) as TLocation,
        image: asset.image as string
    }
}

export async function mapAssetData(asset: AssetCountLine, data: User, prev_loc: TLocation): Promise<TAssetRow> {
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
        image: await ConvertImageUrl(asset.image as string),
        remarks: asset.remarks
    } as unknown as TAssetRow
}



