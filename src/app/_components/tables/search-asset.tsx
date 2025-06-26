'use client'
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import { tableHeadersAdditional, AssetRow, createAssetTableCell } from "@/_components/tables/list-asset";
import { JSX, useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import { blue } from "@mui/material/colors";
import Button from "@mui/material/Button";

function createSearchAssetTableCell(data: AssetRow, action: JSX.Element, 
    actionLabel: string) {
    const { assetCode, assetName, assignedTo, assignIncorrect } = data;
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
            <TableCell className="place-content-center">
                {assignIncorrect}
                <Checkbox checked={assignIncorrect} />
            </TableCell>
            <TableCell>
                {action} {actionLabel}
                {/* <Checkbox disabled={!isCheckTable} />[Del] */}
            </TableCell>
        </>
    )
}

function SearchAssetTable(props: { isCheckTable: boolean, assetTab: boolean }) {
    const { isCheckTable, assetTab } = props
    const headers = tableHeadersAdditional
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
                    // data.length ?
                    //     (data).map((mockData: AssetRow) =>
                    //         <TableRow key={mockData.assetCode}>
                    //             {createAssetTableCell(mockData, assetTab, <></>, "", isCheckTable)}
                    //         </TableRow>
                    //     )
                    //     : <></>
}
            </TableBody>
        </>
    )
}

export default function SearchAsset() {
    const [searchInput, setSearchInput] = useState<string>()
    const [isCheckTable, setIsCheckTable] = useState<boolean>(false)
    const [assetTab, setAssetTab] = useState<boolean>(true);

    return (
        <div className="space-y-2">
            <div className="flex flex-row w-full py-2 pl-2 lg:pl-10 space-x-2 content-center">
                <TextField 
                    id="search-asset" 
                    label="Search asset" 
                    variant="outlined" 
                    size="small" 
                    className="w-1/2" 
                    onChange={(event) => setSearchInput(event.target.value)}
                />
                <Button onClick={fetchSearchAsset}>Search</Button>
            </div>
            <Table stickyHeader size="small" sx={{
                lg: {
                    minHeight: 300
                },
                minHeight: 580,
                minWidth: 650,
                border: 'solid',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                borderWidth: 1,
                borderColor: blue[400]
            }}>
                <SearchAssetTable isCheckTable={true} assetTab={false} />
            </Table>
        </div>
    )

}