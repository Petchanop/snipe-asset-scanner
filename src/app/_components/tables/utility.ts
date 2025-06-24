import { ChangeEvent, MouseEvent } from "react";

export function dataPerPage(data: any, page: number, rowsPerPage: number): any[] {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
}

export function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
    setPage: (number: number) => void
) {
    console.log(newPage);
    setPage(newPage);
};

export function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement>,
    setRowsPerPage: (number: number) => void,
    setPage: (number: number) => void
) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};