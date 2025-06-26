'use client'

import Table from "@mui/material/Table";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { handleChangePage, handleChangeRowsPerPage } from "@/_components/tables/utility";
import { mockAssetsByLocation, mockLocationTableData } from "@/_components/tables/mockData";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ListAsset from "@/_components/tables/list-asset";
import ButtonGroup from "@mui/material/ButtonGroup";
import { blue } from "@mui/material/colors";

type AssetRow = {
    assetCode: string;
    assetName: string;
    assignedTo: string;
    countCheck: boolean;
    assignIncorrect: boolean;
};

function CheckAdditionalAssetButton() {
    return (
        <div className="flex flex-col w-1/2 pt-10">
            <div className="flex flex-row w-full lg:pl-8 lg:space-x-8" >
                <Button className={
                    `hover:bg-blue-200 max-md:w-1/3
                        max-md:text-xs max-md:font-medium`
                }
                >Scan</Button>
            </div>
            <div className="flex flex-row w-full lg:pl-8 lg:space-x-8" >
                <Button className={
                    `hover:bg-blue-200 max-md:w-1/3 
                        max-md:text-xs max-md:font-medium`
                }>Add Asset</Button>
            </div>
        </div>
    )
}

function CheckAssetButton(props: {
    setIsCheckTable: (value: SetStateAction<boolean>) => void
}) {
    const { setIsCheckTable } = props
    return (
        <div className="flex flex-row w-full lg:pl-8 lg:space-x-8">
            <Button className={
                `hover:bg-blue-200 max-md:w-1/3
                        max-md:text-xs max-md:font-medium`
            }
                href="/locations/scanner"
            >Scan</Button>
            <Button className={
                `hover:bg-blue-200 max-md:w-1/3 
                        max-md:text-xs max-md:font-medium`
            }>Finish</Button>
            <Button className={
                `hover:bg-blue-200 max-md:w-1/3 
                        max-md:text-xs max-md:font-medium`
            }
                onClick={() => setIsCheckTable((pre) => !pre)}
            >Cancel</Button>
        </div>
    )
}

function SelectCountInput(props: {
    locations: string[],
    selectedLocation: string,
    setSelectedLocation: (value: string) => void,
    setDocumentDate: (value: string) => void,
    isCheckTable: boolean
}) {
    const { locations,
        selectedLocation,
        setSelectedLocation,
        setDocumentDate,
        isCheckTable
    } = props

    return (
        <div className="flex flex-col w-1/2 max-md:w-3/4 space-y-2">
            {
                isCheckTable ?
                    <Typography className="">Document Number</Typography>
                    : <></>
            }
            <div className="flex flex-row items-center">
                <Typography className="lg:w-30 w-20">Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Select Date"
                        disableFuture
                        format="DD/MM/YYYY"
                        className="lg:w-2/3 w-3/5"
                        slotProps={{ textField: { size: 'small' } }}
                        onChange={(value) => {
                            value ?
                                setDocumentDate(value.format("DD/MM/YYYY").toString())
                                : null
                        }}
                        disabled={isCheckTable}
                    />
                </LocalizationProvider>
            </div>
            <div className="flex flex-row">
                <Typography className="lg:w-30 w-20">Location</Typography>
                <Select
                    id="display location"
                    className="lg:w-2/3 w-3/5"
                    label="location"
                    value={selectedLocation}
                    renderValue={(selected: string) => {
                        if (!selected.length) {
                            return <em>Location</em>
                        }
                        return selected
                    }}
                    onChange={(event) => setSelectedLocation(event.target.value)}
                    size="small"
                    disabled={isCheckTable}
                >
                    {
                        locations.map((loc) =>
                            <MenuItem value={loc}>{loc}</MenuItem>
                        )
                    }
                </Select>
            </div>
        </div>
    )
}

function SelectCountButton(props: {
    selectedLocation: string,
    setLocation: (value: string) => void,
    setIsCheckTable: (value: SetStateAction<boolean>) => void
}) {
    const {
        selectedLocation,
        setLocation,
        setIsCheckTable
    } = props
    return (
        <div className="flex flex-col pt-2 max-md:w-2/5 items-center space-y-2">
            <div className="flex flex-row">
                <Button className={
                    `hover:bg-blue-200 max-md:w-2/5 
                        max-md:text-xs max-md:font-medium`
                }
                    onClick={() => {
                        setLocation(selectedLocation);
                    }}
                >
                    Get Data
                </Button>
            </div>
            <div className="flex flex-row">
                <Button className={
                    `hover:bg-blue-200 max-md:w-2/5
                    max-md:text-xs max-md:font-medium
                `}
                    onClick={() => setIsCheckTable((pre) => !pre)}
                >
                    Start
                </Button>
            </div>
        </div>
    )
}

export function NewCountInput(props: {
    locations: string[],
    location: string,
    setLocation: (value: string) => void
    isCheckTable: boolean,
    setIsCheckTable: (value: SetStateAction<boolean>) => void
    assetTab: boolean,
}) {
    const {
        locations,
        location,
        setLocation,
        isCheckTable,
        setIsCheckTable,
        assetTab,
    } = props
    const [selectedLocation, setSelectedLocation] = useState<string>(location)
    const [documentDate, setDocumentDate] = useState<string>((new Date()).toDateString())
    const [documentNumber, setDocumentNumber] = useState<string>("")

    function findDocumentNumber(): any[] {
        return mockLocationTableData.filter((data) => data.location == selectedLocation && data.date == documentDate)
    }
    useEffect(() => {
        if (selectedLocation && documentDate) {
            const docNumber = findDocumentNumber();
            console.log(docNumber)
            docNumber.length ?
                setDocumentNumber(docNumber[0].documentNumber)
                : null
        }
    }, [selectedLocation, documentDate])
    return (
        <div className="flex flex-row w-full py-2 pl-2 lg:pl-10 content-center">
            <SelectCountInput
                locations={locations}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                setDocumentDate={setDocumentDate}
                isCheckTable={isCheckTable}
            />
            {
                isCheckTable ?
                    assetTab ?
                        <CheckAssetButton setIsCheckTable={setIsCheckTable} />
                        : <CheckAdditionalAssetButton />
                    :
                    <SelectCountButton
                        selectedLocation={selectedLocation}
                        setLocation={setLocation}
                        setIsCheckTable={setIsCheckTable}
                    />
            }
        </div>
    )
}

function AssetTable(props: {
    data: AssetRow[],
    isCheckTable: boolean,
    assetTab: boolean,
    setAssetTab: (value: SetStateAction<boolean>) => void
}) {
    const { data, isCheckTable, assetTab, setAssetTab } = props
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    return (
        <>
            <ButtonGroup >
                <Button sx={{
                    borderBottom: 'none',
                    borderBottomLeftRadius: 0,
                }}
                    className={!assetTab ? '' : 'bg-blue-200'}
                    onClick={() => setAssetTab((pre) => !pre)}
                >
                    Asset List in Location
                </Button>
                <Button sx={{
                    borderBottom: 'none',
                    borderBottomRightRadius: 0
                }}
                    className={assetTab ? '' : 'bg-blue-200'}
                    onClick={() => setAssetTab((pre) => !pre)}
                >
                    Additional Asset List in Location
                </Button>
            </ButtonGroup>
            <Table stickyHeader size="small" sx={{
                minWidth: 650,
                border: 'solid',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                borderWidth: 1,
                borderColor: blue[400]
            }}>
                <ListAsset data={data} isCheckTable={isCheckTable} assetTab={assetTab} />
                <TableFooter>
                    <TableRow>
                        {
                            data.length ?
                                <TablePagination
                                    showFirstButton
                                    showLastButton
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={4}
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(event, page) => handleChangePage(event, page, setPage)}
                                    onRowsPerPageChange={(event) =>
                                        handleChangeRowsPerPage(event as ChangeEvent<HTMLInputElement>, setRowsPerPage, setPage)
                                    }
                                />
                                : <></>
                        }
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}

export default function NewCountTable(props: {
    locations: string[]
}) {
    const { locations } = props
    const [location, setLocation] = useState<string>(locations[0])
    const [isCheckTable, setIsCheckTable] = useState<boolean>(false)
    const [assetTab, setAssetTab] = useState<boolean>(true);

    //use effect to fetch data from location change
    useEffect(() => {
    }, [])
    return (
        <>
            <NewCountInput
                locations={locations}
                location={location}
                setLocation={setLocation}
                isCheckTable={isCheckTable}
                setIsCheckTable={setIsCheckTable}
                assetTab={assetTab}
            />
            <AssetTable
                data={mockAssetsByLocation[location]}
                isCheckTable={isCheckTable}
                assetTab={assetTab}
                setAssetTab={setAssetTab}
            />
        </>
    )
}