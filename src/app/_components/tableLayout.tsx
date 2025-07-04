'use client'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import TableContainer from "@mui/material/TableContainer";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function TableLayout({
    children,
}: {
    children: ReactNode
}) {
    const [selected, setSelected] = useState<string>("/reports")
    const router = useRouter();

    useEffect(() => {
        router.push(`${selected}`)
    }, [selected])
    return <>
        <Card className='w-screen h-screen lg:w-4/6 lg:h-3/4 absolute lg:top-22'
            sx={{
                borderRadius: {
                    lg: 4
                }
            }}
        >
            <CardHeader
                className='h-1/8 bg-blue-400 text-white'
                title="Asset Count"
            />
            <CardContent className="space-y-4">
                <Tabs
                    value={selected}
                    className="pl-2">
                    <Tab value="/reports" label="reports" onClick={() =>
                        setSelected("/reports")
                    }>
                    </Tab>
                    <Tab value="/locations/assets" label="new-count" onClick={() => setSelected("/locations/assets")}></Tab>
                    <Tab value="/locations/assets/search" label="search" onClick={() => setSelected("/locations/assets/search")}></Tab>
                </Tabs>
                <Paper elevation={10}>
                    <TableContainer className="w-full lg:max-h-[55vh] max-h-[75vh]">
                        {children}
                    </TableContainer>
                </Paper>
            </CardContent>
        </Card >
    </>
}