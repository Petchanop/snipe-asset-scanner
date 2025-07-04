'use client'
import { mockLocationTableData } from "@/_constants/mockData";
import { useState, ChangeEvent, useEffect, useMemo } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { dataPerPage, handleChangePage, handleChangeRowsPerPage } from "@/_components/tables/utility";
import { MapActionColor, MapColor } from "@/_constants/constants";
import { locationTableData } from "@/_types/types";
import { tableHeaders } from "@/_constants/mockData";
import { TLocation } from "@/_types/snipe-it.type";
import { getReportFromParentLocation } from "@/_apis/report.api";
import { AssetCount, Location } from "@/_types/types";
import { useLocationUrlContext } from "@/reports/layout";
import { usePathname, useRouter } from "next/navigation";

function createLocationTableCell(data: locationTableData) {
    const { date, documentNumber, location, status, action } = data;
    return (
        <>
            <TableCell>
                {date}
            </TableCell>
            <TableCell>
                {documentNumber}
            </TableCell>
            <TableCell>
                {location}
            </TableCell>
            <TableCell>
                <Typography sx={{
                    color: MapColor[status]![700],
                    fontWeight: 700, bgcolor: MapColor[status]![300],
                }}>
                    {status}
                </Typography>
            </TableCell>
            <TableCell>
                <Button variant="text">
                    <Typography sx={{ color: MapActionColor[action]![500] }}>
                        [{action}]
                    </Typography>
                </Button>
            </TableCell>
        </>
    )
}

function ChildrenSelectComponent(props: {
    parent: TLocation,
    locationByParent: TLocation[],
    setChildId: (value: number) => void
}) {
    const { parent, locationByParent, setChildId } = props
    const [childLocation, setChildLocation] = useState("")
    const [childrenLocation, setChildrenLocation] = useState<TLocation[]>([])
    const pathname = usePathname()
    const { replace } = useRouter()
    const context = useLocationUrlContext()

    const handleOnClick = (target: EventTarget & (HTMLInputElement | HTMLTextAreaElement)) => {
        const locationByName = childrenLocation.filter((loc) => loc.name == target.value)[0] as unknown as Location
        setChildId(locationByName.id)
        setChildLocation(target.value)
        context.current = locationByName.id
        replace(`${pathname}?location=${context.current}`)
    }

    const childrenLocationChange = useMemo(() => { 
        return locationByParent.filter((loc) =>
        // @ts-expect-error cause it not wrong type the object has => id in parent properties
        loc.parent.id === parent.id
    )}, [parent])
    // locationByParent

    useEffect(() => {
        const setDefaultValue = () => {
            const defaultValue = childrenLocationChange.length ? childrenLocationChange[0]!.name : "";
            context.current = childrenLocationChange[0]?.id as unknown as number
            setChildLocation(defaultValue as string)
        }
        setChildrenLocation(childrenLocationChange)
        setDefaultValue();

        //fetch report by child location later
    }, [childrenLocationChange])

    return (
        <>
            <TextField
                select
                label="sub location"
                name={parent.name}
                value={childLocation}
                className="mt-3 p-4"
                onChange={(event) => handleOnClick(event.target)}
            >
                {
                    childrenLocation.map((loc) =>
                        <MenuItem value={loc.name as unknown as string} key={loc.id}>
                            <div dangerouslySetInnerHTML={{ __html: loc.name! }} data-key={loc.id} data-name={loc.name}></div>
                        </MenuItem>
                    )
                }
            </TextField>
        </>
    )
}

function ParentSelectComponent(props: {
    parentLocation: TLocation[],
    setParent: (location: TLocation) => void,
}) {
    const { parentLocation, setParent } = props

    return (
        <TextField
            select
            label="location"
            defaultValue={parentLocation[0]?.name ? parentLocation[0]?.name : ""}
            className="mt-3 p-4"
            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const newParent = parentLocation.find((loc) => loc.name == event.target.value);
                setParent(newParent!)
            }}>
            {
                parentLocation.map((loc) =>
                    <MenuItem value={loc.name} key={loc.id}>{loc.name}</MenuItem>
                )
            }
        </TextField>
    )
}

export default function LocationTable(props: { parentLocation: TLocation[], childrenLocation: TLocation[] }) {
    const { parentLocation, childrenLocation } = props
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [parent, setParent] = useState(parentLocation[0])
    const [report, setReport] = useState([] as AssetCount[])
    const [childId, setChildId] = useState<number | null>(null)
    useEffect(() => {
        const filterReportByChildId = () => {
            setReport(report.filter((report) => report.location_id == childId))
        }
        const fetchReportByParent = async () => {
            const parentId = parentLocation.find((loc) => loc.name === (parent as TLocation).name) as TLocation
            const newReport = await getReportFromParentLocation(parentId.id!)
            setReport(newReport)
        }
        fetchReportByParent();
        filterReportByChildId();
    }, [childId, parent])
    return (
        <>
            <ParentSelectComponent parentLocation={parentLocation} setParent={setParent} />
            <ChildrenSelectComponent parent={parent!} locationByParent={childrenLocation} setChildId={setChildId} />
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        {tableHeaders.map((header) => (
                            <TableCell key={header.label}>
                                {header.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody sx={{ overflow: 'hidden' }}>
                    {
                        (dataPerPage(report, page, rowsPerPage)).map((mockData) =>
                            <TableRow key={mockData.documentNumber}>
                                {createLocationTableCell(mockData)}
                            </TableRow>
                        )
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            showFirstButton
                            showLastButton
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={4}
                            count={mockLocationTableData.length}
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