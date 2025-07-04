import { tableHeaders, tableHeadersAdditional } from "@/_constants/constants";
import { TAssetRow, TAssetTab } from "@/_types/types";
import { JSX } from "@emotion/react/jsx-runtime";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"

export function createAssetTableCell(
    data: TAssetRow, 
    assetTab: TAssetTab, 
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
                {assignedTo.first_name} {assignedTo.last_name}
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

export default function ListAsset(props: { data: TAssetRow[], isCheckTable: boolean, assetTab: TAssetTab }) {
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
                        (data).map((mockData: TAssetRow) =>
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