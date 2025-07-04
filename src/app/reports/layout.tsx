'use client'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import TableContainer from "@mui/material/TableContainer";
import Tabs from "@mui/material/Tabs";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";

const LocationUrlContext = createContext<RefObject<number> | null>(null);

export default function TableLayout({
    children,
}: {
    children: ReactNode
}) {
    const pathname = usePathname()
    const paramId = useParams()
    const [selected, setSelected] = useState<string>(pathname)
    const locationUrl = useRef(0)
    const router = useRouter();
    console.log("report page : ", pathname, location)

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
                    <Tab value={`/locations/${locationUrl.current}/assets`} label="new count" onClick={() => setSelected(`/locations/${locationUrl.current}/assets`)}></Tab>
                    <Tab value="/locations/search" label="search" onClick={() => setSelected("/locations/search")}></Tab>
                </Tabs>
                <Paper elevation={10}>
                   <TableContainer className="w-full lg:max-h-[55vh] max-h-[75vh]">
                        <LocationUrlContext value={locationUrl}>
                            {children}
                        </LocationUrlContext>
                    </TableContainer>
                </Paper>
            </CardContent>
        </Card >
    </>
}

export function useLocationUrlContext() {
    const context = useContext(LocationUrlContext)
    if (!context) {
        throw new Error("useLocatoinUrlContext must be use within Context provider")
    }
    return context
}