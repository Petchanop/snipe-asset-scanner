'use server'
import { ReactNode } from "react"

export default  async function ReportLayout({
  children
}: {
  children: ReactNode
}) {
  return (
        <>{children}</>
  )
}