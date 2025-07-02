'use client'
import { mockLocationTableData } from "@/_constants/mockData";
import { useState, ChangeEvent, useEffect } from "react";
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
    locationByParent: TLocation[]
}) {
    const { parent, locationByParent } = props
    const [childLocation, setChildLocation] = useState("")
    const [childrenLocation, setChildrenLocatoin] = useState<TLocation[]>([])

    useEffect(() => {
        const childrenLocation = locationByParent.filter((loc) =>
            // @ts-expect-error cause it not wrong type the object has => id in parent properties
            loc.parent.id === parent.id
        )
        const setDefaultValue = () => {
            const defaultValue = childrenLocation.length ? childrenLocation[0]!.name : "";
            console.log(childrenLocation[0])
            setChildLocation(defaultValue as string)
        }
        setDefaultValue();
        setChildrenLocatoin(childrenLocation)

        //fetch report by child location later
    }, [locationByParent, parent])
    return (
        <>
            <TextField
                select
                label="sub location"
                value={childLocation}
                className="mt-3 p-4"
                onChange={(event) => setChildLocation(event?.target.value)}
            >
                {
                    childrenLocation.map((loc) =>
                        <MenuItem value={loc.name as unknown as string} key={loc.id}><div dangerouslySetInnerHTML={{__html: loc.name!}}></div></MenuItem>
                    )
                }
            </TextField>
        </>
    )
}

function ParentSelectComponent(props: { parentLocation: TLocation[], setParent: (location: TLocation) => void }) {
    const { parentLocation, setParent } = props
    return (
        <TextField
            select
            label="location"
            defaultValue={parentLocation[0]?.name ? parentLocation[0]?.name : ""}
            className="mt-3 p-4"
            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setParent(parentLocation.find((loc) => loc.name == event.target.value)!)}
        >
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

    return (
        <>
            <ParentSelectComponent parentLocation={parentLocation} setParent={setParent} />
            <ChildrenSelectComponent parent={parent!} locationByParent={childrenLocation} />
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
                        (dataPerPage(mockLocationTableData, page, rowsPerPage)).map((mockData) =>
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