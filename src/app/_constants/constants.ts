import { HeadersAssetTable } from "@/_types/interfaces"
import { blue, green, grey, red, yellow } from "@mui/material/colors"

export const INLOCATION = "INLOCATION"
export const OUTLOCATION = "OUTLOCATION"

export const timeFormat = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}

export const MapColor: Record<string, { [key: number]: string }> = {
    "NEW": blue,
    "IN PROGRESS": yellow,
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
    "OPEN": blue,
    "VIEW": grey,
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
        label: "Status",
        isSelectBox: true,
        fontColor: ["black"]
    }
]

export type AssetStatus =
  | 'pending'
  | 'deployable'
  | 'deployed'
  | 'sold out'
  | 'unavailable'
  | 'archived'
  | 'disposed';

export const assetStatusOptions: { id: number; value: AssetStatus; label: string }[] = [
  { id: 1 ,value: 'pending', label: 'Pending' },
  { id: 2, value: 'deployable', label: 'Deployable' },
  { id: 3, value: 'deployed', label: 'Deployed' },
  { id: 4, value: 'sold out', label: 'Sold Out' },
  { id: 5, value: 'unavailable', label: 'Unavailable' },
  { id: 6, value: 'archived', label: 'Archived' },
  { id: 7, value: 'disposed', label: 'Disposed' }
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
        label: "Action",
        isSelectBox: true,
        fontColor: ["black"]
    }
]
