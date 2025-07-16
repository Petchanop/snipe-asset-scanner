import { ChangeEvent, MouseEvent } from "react";

export function dataPerPage(data: any, page: number, rowsPerPage: number): any[] {
    return data.length ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : []
}

export function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
    setPage: (number: number) => void
) {
    const direction = event?.currentTarget.getAttribute('aria-label')?.includes("next")
    let change = 0
    direction ? change = 1 : change = -1
    setPage(newPage + change);
};

export function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement>,
    setRowsPerPage: (number: number) => void,
    setPage: (number: number) => void
) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};
