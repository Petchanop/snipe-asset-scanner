import { JSX } from "@emotion/react/jsx-runtime";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"

interface HeadersAssetTable {
    label: string,
    isSelectBox: boolean,
    fontColor: string[]
}

const tableHeaders: HeadersAssetTable[] = [
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

export type AssetRow = { 
    assetCode: string;
    assetName: string;
    assignedTo: string;
    countCheck: boolean;
    assignIncorrect: boolean;
};

export function createAssetTableCell(
    data: AssetRow, 
    assetTab: boolean, 
    action: JSX.Element, 
    actionLabel: string, 
    isCheckTable: boolean
) {
    const { assetCode, assetName, assignedTo, countCheck, assignIncorrect } = data;
    return (
        <>
            <TableCell>
                {assetCode}
            </TableCell>
            <TableCell>
                {assetName}
            </TableCell>
            <TableCell>
                {assignedTo}
            </TableCell>
            {
                assetTab ?
                    <TableCell>
                        {countCheck}
                        <Checkbox checked={countCheck} disabled={!isCheckTable} />
                    </TableCell>
                    : <></>
            }
            <TableCell  className="place-content-center">
                {assignIncorrect}
                <Checkbox checked={assignIncorrect} disabled={!isCheckTable} />
            </TableCell>
            {
                !assetTab ?
                    <TableCell>
                        {action} {actionLabel}
                        {/* <Checkbox disabled={!isCheckTable} />[Del] */}
                    </TableCell>
                    : <></>
            }
        </>
    )
}

export default function ListAsset(props: { data: AssetRow[], isCheckTable: boolean, assetTab: boolean }) {
    const { data, isCheckTable, assetTab } = props
    const headers = assetTab ? tableHeaders : tableHeadersAdditional
    return (
        <>
            <TableHead>
                <TableRow className="place-content-center">
                    {headers.map((header) => (
                        <TableCell key={header.label}>
                            {header.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody sx={{ overflow: 'hidden' }} className="place-content-center">
                {
                    data.length ?
                        (data).map((mockData: AssetRow) =>
                            <TableRow key={mockData.assetCode}>
                                {createAssetTableCell(mockData, assetTab, <Checkbox disabled={!isCheckTable} />, "[Del]", isCheckTable)}
                            </TableRow>
                        )
                        : <></>
                }
            </TableBody>
        </>
    )
}