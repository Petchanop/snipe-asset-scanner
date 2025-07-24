import { HeadersAssetTable } from "@/_types/interfaces"
import { blue, green, grey, red, deepOrange, brown } from "@mui/material/colors"

export const INLOCATION = "INLOCATION"
export const OUTLOCATION = "OUTLOCATION"

export enum CreateDocumentStep {
    CHOOSEDATE = 0,
    REPORTNAME = 1,
    ADDLOCATION = 2,
    CONFIRM = 3
}

export const timeFormat = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}

export const MapColor: Record<string, { [key: number]: string }> = {
    "NEW": blue,
    "IN PROGRESS": deepOrange,
    "COMPLETED": green,
    "CANCEL": red
}

export enum ReportState {
    NEW = "NEW",
    INPROGRESS = "IN PROGRESS",
    COMPLETED = "COMPLETED",
    CANCEL = "CANCEL"
}

export const MapActionColor: Record<string, { [key: number]: string }> = {
    "เริ่ม" : blue,
    "ตรวจนับ" : brown,
    "แก้ไข": red,
    "เรียกดู": grey,
}

export const tableHeaders: HeadersAssetTable[] = [
    {
        label: "Asset code",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Asset Name",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Assigned to",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Count Check",
        isSelectBox: true,
        fontColor: ["black"]
    },
    {
        label: "Assign Incorrect",
        isSelectBox: true,
        fontColor: ["black"]
    },
     {
        label: "Not in Location",
        isSelectBox: true,
        fontColor: ["black"]
    },
    {
        label: "ชำรุด",
        isSelectBox: true,
        fontColor: ["black"]
    }
]

export type AssetStatus =
  | 'Malfunctioning'
  | 'Deployable'

export enum AssetStatusEnum {
    MALFUNCTIONING = 1,
    DEPLOYABLE = 2
}

export const assetStatusOptions: { id: number; value: AssetStatus; label: string }[] = [
  { id: 1, value: 'Malfunctioning', label: 'ชำรุด' },
  { id: 2, value: 'Deployable', label: 'ปกติ' },
];

export const tableHeadersAdditional: HeadersAssetTable[] = [
    {
        label: "Asset code",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Asset Name",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Assigned to",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Assign Incorrect",
        isSelectBox: true,
        fontColor: ["black"]
    },
    {
        label: "ชำรุด",
        isSelectBox: true,
        fontColor: ["black"]
    }
]
