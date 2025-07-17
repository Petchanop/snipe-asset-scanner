import { ChangeEvent, MouseEvent } from "react";

export function dataPerPage(data: any, page: number, rowsPerPage: number): any[] {
    return data.length ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : []
}

export function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
    setPage: (number: number) => void,
    dataLength: number,
    rowsPerPage: number
) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (newPage * rowsPerPage > dataLength) {
        console.log("set page ", Math.ceil(dataLength / rowsPerPage) - 1, newPage, dataLength)
        setPage(Math.ceil(dataLength / rowsPerPage) - 1)
    } else {
        setPage(newPage)
    }
};

export function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement>,
    setRowsPerPage: (number: number) => void,
    setPage: (number: number) => void
) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};
