import { asset_count, asset_count_line, assets, locations, users } from "@/prisma/generated/prisma";

export type TSnipeDocument = {
    date: string;
    documentNumber: string;
    location: string;
    status: string;
    action: string;
}

export type locationTableData = {
    date: string;
    documentNumber: string;
    location: string;
    state: string;
    action: string;
}

export type assetUser = {
    id: number;
    first_name: string;
    last_name: string;
}

export type TAssetRow = {
    assetCode: string;
    assetName: string;
    assignedTo: assetUser;
    countCheck: boolean;
    assignIncorrect: boolean;
};

export type AssetCount = asset_count;
export type AssetCountLine = asset_count_line;
export type Asset = assets;
export type Location = locations;
export type User = users;

export type TAssetTab = "INLOCATION" | "OUTLOCATION"
export const INLOCATION = "INLOCATION"
export const OUTLOCATION = "OUTLOCATION"