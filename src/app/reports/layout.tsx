import TableLayout from "@/_components/tableLayout"
import Skeleton from "@mui/material/Skeleton"
import { ReactNode, Suspense } from "react"

function LoadingSkeleton(){
  return (
    <Skeleton className='w-screen h-screen lg:w-4/6 lg:h-3/4 absolute lg:top-22' />
  )
}

export default function ReportLayout({
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