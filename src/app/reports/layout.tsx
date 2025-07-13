'use server'
import TableLayout from "@/_components/tableLayout"
import { ReactNode } from "react"

export default async function ReportLayout({
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