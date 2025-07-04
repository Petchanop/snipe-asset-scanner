'use client'
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import { tableHeadersAdditional } from "@/_constants/constants";
import { JSX, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import { blue } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { fetchSearchAsset } from "@/_apis/snipe-it/snipe-it.api";
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { TAssetRow } from "@/_types/types";

function createSearchAssetTableCell(data: TAssetRow, action: JSX.Element,
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
                {assignedTo.first_name} {assignedTo.last_name}
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

function SearchAssetTable(props: { data: TAssetRow[], isCheckTable: boolean, assetTab: boolean }) {
    const { data } = props
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
                    data.length ?
                        (data).map((asset: TAssetRow) =>
                            <TableRow key={asset.assetCode}>
                                {createSearchAssetTableCell(asset, <></>, "")}
                            </TableRow>
                        )
                        : <></>
                }
            </TableBody>
        </>
    )
}

export default function SearchAsset() {
    const [searchInput, setSearchInput] = useState<string>()
    const [fetchData, setFetchData] = useState<boolean>(false)
    const [searchResult, setSearchResult] = useState<TAssetRow[]>([])

    async function callFetchAssetSearch() {
        if (searchInput && fetchData) {
            const { data, error } = await fetchSearchAsset(searchInput);
            if (error) {
                toast(`${searchInput} not found.`)
            } else {
                const asset:TAssetRow = {
                    assetCode: data.asset_tag as string,
                    assetName: data.name as string,
                    assignedTo: {
                        id: data.assigned_to?.id as unknown as number,
                        first_name: data.assigned_to?.first_name as unknown as string,
                        last_name: data.assigned_to?.last_name as unknown as string
                    },
                    countCheck: false,
                    assignIncorrect: false,
                }
                setSearchResult([...searchResult, asset])
            }
        }
        setFetchData(false)
    }

    useEffect(() => {
        callFetchAssetSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData])

    return (
        <>
            <Toaster
                containerStyle={{
                    position: 'relative'
                }}
                toastOptions={{
                    duration: 1000,
                }}
            >
                {(t) => (
                    <ToastBar
                        toast={t}
                        style={{
                            ...t.style,
                            animation: t.visible
                                ? 'custom-enter 1s ease-in-out'
                                : 'custom-exit 1s ease-in',
                        }}
                    />
                )}
            </Toaster>
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
                    <Button onClick={() => setFetchData(true)}>Search</Button>
                </div>

                <Table stickyHeader size="small" sx={{
                    // lg: {
                    //     minHeight: 300
                    // },
                    // minHeight: 580,
                    minWidth: 650,
                    border: 'solid',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                    borderWidth: 1,
                    borderColor: blue[400]
                }}>
                    <SearchAssetTable data={searchResult} isCheckTable={true} assetTab={false} />
                </Table>
            </div>
        </>
    )
}