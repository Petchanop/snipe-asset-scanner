'use client'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import TableContainer from "@mui/material/TableContainer";
import Tabs from "@mui/material/Tabs";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, Dispatch, ReactNode, SetStateAction, SyntheticEvent, useContext, useEffect, useRef, useState } from "react";

type LocationStateContext = {
    locationUrl: number;
    setLocationUrl: Dispatch<SetStateAction<number>>;
    setSelected: Dispatch<SetStateAction<string>>;
}

const LocationUrlContext = createContext<LocationStateContext | null>(null);

export default function TableLayout({
    children
}: {
    children: ReactNode
}) {
    const pathname = usePathname()
    const { location } = useParams()
    const [selected, setSelected] = useState<string>(pathname)
    const [ locationId, setLocationId ] = useState(parseInt(location?.toString()!))
    const router = useRouter();

    function handleOnChange(event: SyntheticEvent, newValue: string) {
        setSelected(newValue)
    }
    useEffect(() => {
        router.push(`${selected}`)
    }, [selected])
                 
    useEffect(() => {
        router.replace(`${selected}`)
    },[locationId])
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
                    className="pl-2"
                    onChange={handleOnChange}
                    >
                    <Tab value={`/reports?location=${locationId}`} label="reports">
                    </Tab>
                    <Tab value={`/locations/${locationId}/assets`} label="new count"></Tab>
                    <Tab value={`/locations/search?location=${locationId}`} label="search"></Tab>
                </Tabs>
                <Paper elevation={10}>
                    <TableContainer className="w-full lg:max-h-[55vh] max-h-[75vh]">
                        {/* <LocationUrlContext value={locationUrl}> */}
                        <LocationUrlContext 
                            value={{
                                locationUrl: locationId,
                                setLocationUrl: setLocationId,
                                setSelected: setSelected
                            }}>
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