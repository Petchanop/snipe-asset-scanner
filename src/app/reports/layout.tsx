'use client'
import TableLayout from "@/_components/tableLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function ReportLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const { data: session } = useSession()
    console.log("report layout", session)
    if (!session)
        redirect('/auth/login')
    return (
            <TableLayout>
                {children}
            </TableLayout>
    );
}