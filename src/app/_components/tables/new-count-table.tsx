'use client'

import Table from "@mui/material/Table";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ChangeEvent, createContext, Dispatch, SetStateAction, SyntheticEvent, useContext, useEffect, useState } from "react";
import { handleChangePage, handleChangeRowsPerPage } from "@/_components/tables/utility";
import { mockLocationTableData } from "@/_constants/mockData";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ListAsset from "@/_components/tables/list-asset";
import { blue } from "@mui/material/colors";
import { TAssetRow, TAssetTab, TSnipeDocument } from "@/_types/types";
import { INLOCATION, OUTLOCATION } from "@/_constants/constants";
import { getAssetByLocationCount, getAssetsByLocation, getUserByIdPrisma } from "@/_apis/report.api";
import dayjs, { Dayjs } from "dayjs";
import { useLocationUrlContext } from "@/reports/layout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { usePathname, useRouter } from "next/navigation";
import { getAssetCountLineByAssetCount, getAssetCountReport } from "@/_libs/report.utils";

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
    locations: PNewCountTableProps[],
    selectedLocation: string,
    setSelectedLocation: (value: string) => void,
    setDocumentDate: (value: string) => void,
    isCheckTable: boolean,
}) {
    const { locations,
        selectedLocation,
        setSelectedLocation,
        setDocumentDate,
        isCheckTable,
    } = props
    // const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs())
    const context = useLocationUrlContext()
    const dateContext = useDateContext()

    const handleDateOnChange = (value: SetStateAction<dayjs.Dayjs | null>) => {
        if (value) {
            setDocumentDate(value.toString())
            dateContext.setDateValue(value)
        }
    }

    function decodeHtmlEntities(html: string): string {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.documentElement.textContent || "";
    }

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
                        value={dateContext.dateValue}
                        disableFuture
                        format="DD/MM/YYYY"
                        className="lg:w-2/3 w-3/5"
                        slotProps={{ textField: { size: 'small' } }}
                        onChange={handleDateOnChange}
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
                    size="small"
                    disabled={isCheckTable}
                >
                    {
                        locations.map((loc) =>
                            <MenuItem value={loc.name as unknown as string} key={loc.id}>
                                <div dangerouslySetInnerHTML={{ __html: loc.name! }}
                                    data-key={loc.id}
                                    data-value={loc.name}
                                    onClick={(event) => {
                                        const target = event.target as HTMLElement
                                        context.setLocationId(parseInt(target.dataset.key as string))
                                        setSelectedLocation(target.dataset.value as string)
                                        context.setSelected(`/reports/count-assets?location=${target.dataset.key}`)

                                    }}
                                ></div>
                            </MenuItem>
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
    const { replace } = useRouter()
    const pathname = usePathname()
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
                    onClick={() => {
                        setIsCheckTable((pre) => !pre)
                        replace(`${window.location.href}/`)
                    }}
                >
                    Start
                </Button>
            </div>
        </div>
    )
}

export function NewCountInput(props: {
    locations: PNewCountTableProps[],
    location: string,
    setLocation: (value: string) => void
    isCheckTable: boolean,
    setIsCheckTable: (value: SetStateAction<boolean>) => void
    assetTab: TAssetTab,
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

    function findDocumentNumber(): TSnipeDocument[] {
        return mockLocationTableData.filter((data) => data.location == selectedLocation && data.date == documentDate)
    }
    useEffect(() => {
        if (selectedLocation && documentDate) {
            const docNumber = findDocumentNumber();
            if (docNumber.length)
                setDocumentNumber((docNumber[0] as TSnipeDocument).documentNumber)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    data: TAssetRow[],
    isCheckTable: boolean,
    assetTab: TAssetTab,
    setAssetTab: (value: SetStateAction<TAssetTab>) => void
    page: number,
    setPage: Dispatch<SetStateAction<number>>,
    rowsPerPage: number,
    setRowsPerPage: Dispatch<SetStateAction<number>>
    dataLength: number,
}) {
    const {
        data,
        isCheckTable,
        assetTab,
        setAssetTab,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        dataLength
    } = props

    function handleSelectValue(event: SyntheticEvent, newValue: string) {
        setAssetTab(newValue as TAssetTab)
    }

    return (
        <>
            <Tabs
                value={assetTab}
                className="pl-2"
                onChange={handleSelectValue}
            >
                <Tab value={INLOCATION} label="in location"></Tab>
                <Tab value={OUTLOCATION} label="additional in location"></Tab>
            </Tabs>
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
                        <TablePagination
                            showFirstButton
                            showLastButton
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={4}
                            count={dataLength}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(event, page) => handleChangePage(event, page, setPage)}
                            onRowsPerPageChange={(event) =>
                                handleChangeRowsPerPage(event as ChangeEvent<HTMLInputElement>, setRowsPerPage, setPage)
                            }
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}

export type PNewCountTableProps =
    { name: string, id: number }


type TDateValueContext = {
    dateValue: Dayjs;
    setDateValue: Dispatch<SetStateAction<Dayjs | null>>
}

const DateValueContext = createContext<TDateValueContext | null>(null)

export default function NewCountTable(props: {
    locations: PNewCountTableProps[],
    defaultLocation: string;
    locationId: number;
}) {
    const { locations, defaultLocation, locationId } = props
    const [location, setLocation] = useState<string>(defaultLocation)
    const [isCheckTable, setIsCheckTable] = useState<boolean>(false)
    const [assetTab, setAssetTab] = useState<TAssetTab>("INLOCATION");
    const [data, setData] = useState<TAssetRow[]>([])
    const [dataLength, setDataLength] = useState(0)
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs())

    useEffect(() => {
        const getPageLength = async () => {
            const pageLength = await getAssetByLocationCount(locationId)
            setDataLength(pageLength)
        }
        getPageLength()
    }, [locationId])


    useEffect(() => {
        const fetchAssetCountLine = async () => {
            const assetCount = await getAssetCountReport(dateValue?.toDate()!, locationId)
            const data = await getAssetCountLineByAssetCount(assetCount!.id)
            const assetsRow = Promise.all(data.map(async (asset) => {
                return ({
                    assetCode: asset.asset_code as string,
                    assetName: asset.asset_name as string,
                    assignedTo: await getUserByIdPrisma(asset.assigned_to!),
                    countCheck: false,
                    assignIncorrect: false,
                })
            }))
            const assetData = await assetsRow
            setData(assetData as TAssetRow[])
        }

        // fetchAsset()
    }, [locationId, page, rowsPerPage, dateValue])
    return (
        <>
            <DateValueContext 
            value={{
                dateValue : dateValue!,
                setDateValue : setDateValue
            }}>
                <NewCountInput
                    locations={locations}
                    location={location}
                    setLocation={setLocation}
                    isCheckTable={isCheckTable}
                    setIsCheckTable={setIsCheckTable}
                    assetTab={assetTab}
                />
                <AssetTable
                    data={data as TAssetRow[]}
                    isCheckTable={isCheckTable}
                    assetTab={assetTab}
                    setAssetTab={setAssetTab}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    dataLength={dataLength}
                />
            </DateValueContext>
        </>
    )
}

function useDateContext() {
    const context = useContext(DateValueContext)
    if (!context) {
        throw new Error("useLocatoinUrlContext must be use within Context provider")
    }
    return context
}

// function fetchAsset() {
//       const { data, error } = await getAssetsByLocation(locationId, rowsPerPage, page)
//             if (error) {
//                 throw new Error(`Cannot retrieve asset at ${location}`)
//             }
//             const assetsRow = Promise.all(data.map(async (asset) => {
//                 return ({
//                     assetCode: asset.asset_tag as string,
//                     assetName: asset.name as string,
//                     assignedTo: await getUserByIdPrisma(asset.assigned_to),
//                     countCheck: false,
//                     assignIncorrect: false,
//                 })
//             }))
//             const assetData = await assetsRow
//             setData(assetData as TAssetRow[])
// }