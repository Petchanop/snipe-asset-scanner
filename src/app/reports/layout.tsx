'use server'
import { LoadingSkeleton } from "@/_components/loading"
import TableLayout from "@/_components/tableLayout"
import { ReactNode, Suspense } from "react"

export default async function ReportLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <TableLayout>
        {children}
      </TableLayout>
    </Suspense>
  )
}