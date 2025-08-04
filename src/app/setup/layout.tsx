'use client'
import TableLayout from "@/_components/tableLayout"
import { ReactNode } from "react"

export default function SetUpLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <TableLayout>
            {children}
        </TableLayout>
    )
}