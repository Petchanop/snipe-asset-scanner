'use client'
import TableLayout from "@/_components/tableLayout";
import { ReactNode } from "react";

export default function ReportLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <TableLayout>
            {children}
        </TableLayout>
    );
}