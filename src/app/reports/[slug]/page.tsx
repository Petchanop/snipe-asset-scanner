'use client'
import { useParams } from "next/navigation";

export default function ReportTablePage() {
    const params = useParams<{slug: string}>()
    const { slug } = params;

    //fetch data by slug retrieve from params
    return (
        <pre>
            {slug}
        </pre>
    )
}