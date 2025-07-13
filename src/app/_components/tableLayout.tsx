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
import {
  createContext, Dispatch, ReactNode,
  RefObject, SetStateAction,
  SyntheticEvent, useContext,
  useEffect, useRef, useState
} from "react";

type LocationStateContext = {
  selected: RefObject<string>;
  locationId: number;
  setLocationId: Dispatch<SetStateAction<number>>;
}

type ReportStateContext = {
  DocumentNumber: string;
  setDocumentNumber: Dispatch<SetStateAction<string>>;
  setRefetchReport: Dispatch<SetStateAction<boolean>>;
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
  let tabPathname = ""
  if (!checkTabPathname(pathname)) {
    tabPathname = `/reports/count-assets?location=${parseInt(location?.toString()!)}`
  } else {
    tabPathname = `${pathname}${params?.toString() ? `?${params?.toString()}` : ""}`
  }

  console.log("loading layout", tabPathname)
  const [locationId, setLocationId] = useState(parseInt(location?.toString()!))
  const selected = useRef(tabPathname)
  const router = useRouter();
  function handleOnChange(event: SyntheticEvent, newValue: string) {
    selected.current = newValue
    router.push(selected.current)
  }

  useEffect(() => {
    if (locationId) {
      if (checkSamePathName(selected.current, pathname) && checkTabPathname(pathname)) {
        console.log("replace ", selected)
        if (selected.current)
          router.replace(selected.current)
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
          value={selected.current}
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
          {/* <Tab value={
            `/reports/count-assets/search?location=${locationId}`}
            label="search">
          </Tab> */}
        </Tabs>
        <Paper elevation={10}>
          <TableContainer className="w-full lg:max-h-[55vh] max-h-[75vh]">
            <LocationUrlContext
              value={{
                locationId: locationId,
                setLocationId: setLocationId,
                selected: selected,
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