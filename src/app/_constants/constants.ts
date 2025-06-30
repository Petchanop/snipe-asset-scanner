import { HeadersAssetTable } from "@/_types/interfaces"
import { blue, green, grey, red, yellow } from "@mui/material/colors"

export const INLOCATION = "INLOCATION"
export const OUTLOCATION = "OUTLOCATION"

export const MapColor: Record<string, { [key: number]: string }> = {
    "NEW": blue,
    "IN PROGRESS": yellow,
    "COMPLETED": green,
    "CANCEL": red
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
        label: "assigned to",
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
    }
]

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
        label: "assigned to",
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
