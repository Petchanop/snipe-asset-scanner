import { ChangeEvent, MouseEvent } from "react";

export function emptyRows(page: number, rowsPerPage: number, rows: any[]): number {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
}

export function dataPerPage(data: any, page: number, rowsPerPage: number): any[] {
    return data.length ? data.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage) : []
}

export function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
    setPage: (number: number) => void,
    dataLength: number,
    rowsPerPage: number
) {
   if (newPage * rowsPerPage > dataLength) {
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

function Comparator<T>(a: T, b: T, orderBy: keyof T) {
    return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0
}

export type Order = 'asc' | 'desc'

export function getComparator<T, Key extends keyof T>(
    order: Order,
    orderBy: Key
): (
    a: T,
    b: T
) => number {
    return order === 'desc'
    ? (a,b) => Comparator(a,b, orderBy)
    : (a,b) => -(Comparator(a,b, orderBy))
}



