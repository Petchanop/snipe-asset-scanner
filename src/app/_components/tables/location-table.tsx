'use client'
import { mockLocationTableData } from "./mockData";
import { ChangeEvent, useState, MouseEvent } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
// import TablePaginationActions from "@/_components/tables/table-pagination";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { blue, green, red, yellow } from "@mui/material/colors";
// import { TablePaginationActionsProps } from "@mui/material/TablePaginationActions";

interface HeadersLocationTable {
    label: string;
    isSelectBox: boolean;
    fontColor: string[];
}

const tableHeaders: HeadersLocationTable[] = [
    {
        label: "Date",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Document No.",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Location",
        isSelectBox: false,
        fontColor: ["black"]
    },
    {
        label: "Status",
        isSelectBox: true,
        fontColor: ["blue", "yellow", "green", "red"]
    },
    {
        label: "Actions",
        isSelectBox: true,
        fontColor: ["black"]
    }
]

const MapColor: Record<string, { [key: number]: string }> = {
    "NEW": blue,
    "IN PROGRESS": yellow,
    "COMPLETED": green,
    "CANCEL": red
}

type locationTableData = {
    date: string;
    documentNumber: string;
    location: string;
    status: string;
    action: string;
}

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
            <TableCell sx={{
                color: MapColor[status][700],
                fontWeight: 700, bgcolor:
                    MapColor[status][300]
            }}>
                {status}
            </TableCell>
            <TableCell>
                [{action}]
            </TableCell>
        </>
    )
}

export default function LocationTable() {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - mockLocationTableData.length) : 0;

    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <>
            <Table stickyHeader>
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
                        (mockLocationTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).map((mockData) =>
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
                            colSpan={3}
                            count={mockLocationTableData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}