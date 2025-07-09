'use client'
import { checkSamePathName, checkTabPathname } from "@/_libs/location.utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import TableContainer from "@mui/material/TableContainer";
import Tabs from "@mui/material/Tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, Dispatch, ReactNode, SetStateAction, SyntheticEvent, useContext, useEffect, useState } from "react";

type LocationStateContext = {
  locationUrl: number;
  setLocationId: Dispatch<SetStateAction<number>>;
  setSelected: Dispatch<SetStateAction<string>>;
}

type ReportStateContext = {
  DocumentNumber: string;
  setDocumentNumber: Dispatch<SetStateAction<string>>;
}

//31 line of console.log
export const LocationUrlContext = createContext<LocationStateContext | null>(null);
export const ReportContext = createContext<ReportStateContext | null>(null);

export default function TableLayout({
  children
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const params = useSearchParams()
  const location = params.get('location')
  console.log("search param ", location)
  let tabPathname = ""
  if (!checkTabPathname(pathname)) {
    tabPathname = `/reports/count-assets?location=${parseInt(location?.toString()!)}` 
  } else {
    tabPathname = pathname
  }
  const [selected, setSelected] = useState<string>(`${tabPathname}?location=${parseInt(location?.toString()!)}`) 
  const [locationId, setLocationId] = useState(parseInt(location?.toString()!))
  const router = useRouter();
  function handleOnChange(event: SyntheticEvent, newValue: string) {
    setSelected(newValue)
  }
  useEffect(() => {
    if (!checkSamePathName(selected, pathname) && checkTabPathname(pathname))
      console.log("push ", selected)
    router.push(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    if (locationId) {
      if (checkSamePathName(selected, pathname) && checkTabPathname(pathname)) {
        console.log("replace ", selected)
        router.replace(selected)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId])
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
          <Tab value={`/reports?location=${locationId}`}
            label="reports">
          </Tab>
          <Tab value={
            `/reports/count-assets?location=${locationId}`}
            label="new count">
          </Tab>
          <Tab value={
            `/reports/count-assets/search?location=${locationId}`}
            label="search">
          </Tab>
        </Tabs>
        <Paper elevation={10}>
          <TableContainer className="w-full lg:max-h-[55vh] max-h-[75vh]">
            <LocationUrlContext
              value={{
                locationUrl: locationId,
                setLocationId: setLocationId,
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

export function useReportContext() {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error("useReportContext must be use within Context provider")
  }
  return context
}