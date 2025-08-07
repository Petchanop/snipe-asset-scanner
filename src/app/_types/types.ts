import { ReportState } from "@/_constants/constants";
import { asset_count, asset_count_line, asset_count_location, assets, locations, users } from "@/prisma/generated/prisma";
//eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function hasOwnProperty<X extends {}, Y extends PropertyKey>
 (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    if (obj == null)
        return false
    return obj.hasOwnProperty(prop)
}

export type TSnipeDocument = {
    date: string;
    documentNumber: number;
    location: string;
    status: string;
    action: string;
}

export type locationTableData = {
    date: string;
    name: string;
    documentNumber: number;
    state: string;
    action: string;
}

export type assetUser = {
    id: number;
    first_name: string;
    last_name: string;
}

export type TAssetRow = {
    id?: string;
    assetCode: string;
    assetName: string;
    assignedTo: assetUser;
    countCheck: boolean;
    assignIncorrect: boolean;
    notInLocation: boolean;
    status: number;
    prev_location?: string;
    image?: string;
    remarks?: string;
};

export type TReportForm = {
    id?: string,
    document_number?: number,
    document_name: string,
    document_date: Date | null,
    created_by: number,
    state: ReportState,
    asset_count_location: number[]
}

export type AssetCount = asset_count;
export type AssetCountLine = asset_count_line;
export type Asset = assets;
export type Location = locations;
export type User = users;
export type AssetCountLocation = asset_count_location

export type TAssetTab = "INLOCATION" | "OUTLOCATION"
export const INLOCATION = "INLOCATION"
export const OUTLOCATION = "OUTLOCATION"