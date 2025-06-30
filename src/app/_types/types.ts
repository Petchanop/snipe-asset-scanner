
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
    status: string;
    action: string;
}

export type TAssetRow = {
    assetCode: string;
    assetName: string;
    assignedTo: string;
    countCheck: boolean;
    assignIncorrect: boolean;
};

export type TAssetTab = "INLOCATION" | "OUTLOCATION"