import { ReactNode } from "react"

export default async function PlanLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <>
            {children}
        </>

    )
}