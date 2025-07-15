'use client'

import {
  createContext, Dispatch, SetStateAction, useContext, useEffect, useState
} from "react";
import { mockLocationTableData } from "@/_constants/mockData";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
// import MenuItem from "@mui/material/MenuItem";
import { AssetTable } from "@/_components/tables/list-asset";
import { TAssetRow, TAssetTab, TSnipeDocument } from "@/_types/types";
import { getAssetByLocationCount } from "@/_apis/report.api";
import dayjs, { Dayjs } from "dayjs";
import { ReportContext, useLocationUrlContext, useReportContext } from "@/_components/tableLayout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createAssetCountReport, createDocumentNumber,
  findAssetCount,
  getAssetCountLineByAssetCount, getAssetCountReport
} from "@/_libs/report.utils";
import { getUserById } from "@/_apis/snipe-it/snipe-it.api";
import { ReportState } from "@/_constants/constants";
import toast from "react-hot-toast";
import { TLocation } from "@/_types/snipe-it.type";
import { ChildrenSelectComponent, ParentSelectComponent } from "./location-table";

function CheckAdditionalAssetButton() {
  return (
    <>
      <div className="flex flex-row w-full lg:pl-8 lg:space-x-8" >
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3
          max-md:text-xs max-md:font-medium`
        }
        >Scan</Button>
      </div>
      <div className="flex flex-row w-full lg:pl-8 lg:space-x-8" >
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3 
          max-md:text-xs max-md:font-medium`
        }>Add Asset</Button>
      </div>
    </>
    // </div>
  )
}

function CheckAssetButton(props: {
  setIsCheckTable: (value: SetStateAction<boolean>) => void
}) {
  const { setIsCheckTable } = props
  const pathname = usePathname()
  const searchParam = useSearchParams()
  const location = searchParam.get('location')
  const { push } = useRouter()
  const reportContext = useReportContext()

  const handleFinishbutton = () => {
    setIsCheckTable(false)
    reportContext.setRefetchReport((pre) => !pre)
  }
  return (
    <div className="flex flex-row w-full lg:pl-8 lg:space-x-8 justify-start content-center items-center">
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3
        max-md:text-xs max-md:font-medium`
        }
          variant="text"
          onClick={() => {
            push(`${pathname}/${reportContext.DocumentNumber}/check?location=${location!.toString()}`)
          }}
        >Check</Button>
      </div>
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3 
        max-md:text-xs max-md:font-medium`
        }
          onClick={handleFinishbutton}
        >Finish</Button>
      </div>
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3 
        max-md:text-xs max-md:font-medium`
        }
          onClick={() => setIsCheckTable((pre) => !pre)}
        >Cancel</Button>
      </div>
    </div>
  )
}

function SelectCountInput(props: {
  locations: PNewCountTableProps[],
  selectedLocation: PNewCountTableProps,
  setSelectedLocation: (value: PNewCountTableProps) => void,
  setDocumentDate: (value: string) => void,
  isCheckTable: boolean,
  defaultLocation: TLocation
}) {
  const {
    setDocumentDate,
    isCheckTable,
  } = props
  const dateContext = useDateContext()
  const documentContext = useReportContext()

  const handleDateOnChange = (value: SetStateAction<dayjs.Dayjs | null>) => {
    if (value) {
      setDocumentDate(value.toString())
      dateContext.setDateValue(value)
    }
  }

  return (
    <>
      {
        isCheckTable ?
          <Typography className="mt-2 mb-4">{documentContext.DocumentNumber}</Typography>
          : <></>
      }
      <div className="flex flex-row items-center">
        <Typography className="w-29 max-lg:w-25">Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select Date"
            value={dateContext.dateValue}
            disableFuture
            format="DD/MM/YYYY"
            className="lg:w-2/3 w-3/5"
            slotProps={{ textField: { size: 'small' } }}
            onChange={handleDateOnChange}
            disabled={isCheckTable}
          />
        </LocalizationProvider>
      </div>
    </>
  )
}

function SelectCountButton(props: {
  selectedLocation: PNewCountTableProps,
  setLocation: (value: PNewCountTableProps) => void,
  setIsCheckTable: (value: SetStateAction<boolean>) => void
}) {
  const {
    selectedLocation,
    setLocation,
    setIsCheckTable
  } = props
  const { replace } = useRouter()
  const documentContext = useReportContext()
  const dateContext = useDateContext()
  const locationContext = useLocationUrlContext()

  async function handleClickStart() {
    setIsCheckTable((pre) => !pre)
    const documentNumber = await createDocumentNumber(
      locationContext.locationId,
      dateContext.dateValue.format('DD/MM/YYYY')
    )
    const document = await findAssetCount(documentNumber)
    console.log("documentNumber ", documentNumber, document, documentContext.DocumentNumber)
    if (!document) {
      console.log("report create ", documentNumber)
      const reportPayload = {
        document_number: documentNumber,
        document_date: dateContext.dateValue.toDate(),
        rtd_location_id: selectedLocation.rtd_location_id as number,
        location_id: locationContext.locationId,
        state: ReportState.NEW
      }
      await createAssetCountReport(reportPayload)
    }
    documentContext.setDocumentNumber(documentNumber)
    replace(`${window.location.href}`)
    //create report if it empty
  }

  return (
    <div className="flex flex-col pt-2 max-md:w-2/5 justify-center space-y-2">
      <div className="flex flex-row">
        <Button className={
          `hover:bg-blue-200 max-md:w-2/5 
          max-md:text-xs max-md:font-medium`
        }
          onClick={() => {
            setLocation(selectedLocation);
          }}
        >
          Get Data
        </Button>
      </div>
      <div className="flex flex-row">
        <Button className={
          `hover:bg-blue-200 max-md:w-2/5
          max-md:text-xs max-md:font-medium
          `}
          onClick={handleClickStart}
        >
          Start
        </Button>
      </div>
    </div>
  )
}

export function NewCountInput(props: {
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  locations: PNewCountTableProps[],
  location: PNewCountTableProps,
  defaultLocation: TLocation;
  setLocation: Dispatch<SetStateAction<PNewCountTableProps>>,
  isCheckTable: boolean,
  setIsCheckTable: (value: SetStateAction<boolean>) => void
  assetTab: TAssetTab,
}) {
  const {
    parentLocation,
    childrenLocation,
    locations,
    location,
    setLocation,
    isCheckTable,
    setIsCheckTable,
    assetTab,
    defaultLocation
  } = props
  const [parent, setParent] = useState(parentLocation[0])
  const [childId, setChildId] = useState<number | null>(defaultLocation!.id as unknown as number)
  const [selectedLocation, setSelectedLocation] = useState(location)
  const [documentDate, setDocumentDate] = useState<string>((new Date()).toDateString())
  const documentContext = useReportContext()
  function findDocumentNumber(): TSnipeDocument[] {
    return mockLocationTableData
      .filter((data) => data.location == selectedLocation.name
        && data.date == documentDate)
  }
  useEffect(() => {
    if (selectedLocation && documentDate) {
      const docNumber = findDocumentNumber();
      if (docNumber.length)
        documentContext.setDocumentNumber((docNumber[0] as TSnipeDocument).documentNumber)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, documentDate])
  return (
    <div className="flex flex-row w-full py-2 pl-2 lg:pl-10 content-center">
      <div className="flex flex-col basis-lg space-y-2">
        <div className="flex flex-row">
          <SelectCountInput
            locations={locations}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setDocumentDate={setDocumentDate}
            isCheckTable={isCheckTable}
            defaultLocation={defaultLocation}
          />
        </div>
        <div className="flex flex-row items-center">
          <Typography className="w-25 max-lg:w-21">Location</Typography>
          <ParentSelectComponent
            parentLocation={parentLocation}
            parentProp={parent!}
            setParent={setParent} />
          <ChildrenSelectComponent
            parent={parent!}
            locationByParent={childrenLocation}
            childId={childId!}
            setChildId={setChildId} />
        </div>
      </div>
      <div className="flex flex-col basis-md pt-10">
        {
          isCheckTable ?
            assetTab ?
              <CheckAssetButton setIsCheckTable={setIsCheckTable} />
              : <CheckAdditionalAssetButton />
            : <SelectCountButton
              selectedLocation={selectedLocation}
              setLocation={setLocation}
              setIsCheckTable={setIsCheckTable}
            />
        }
      </div>
    </div>
  )
}

export type PNewCountTableProps =
  { name: string, id: number, rtd_location_id?: number }

type TDateValueContext = {
  dateValue: Dayjs;
  setDateValue: Dispatch<SetStateAction<Dayjs | null>>
}

const DateValueContext = createContext<TDateValueContext | null>(null)

export default function NewCountTable(props: {
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  locations: PNewCountTableProps[],
  defaultLocation: TLocation;
  locationId: number;
}) {
  const { parentLocation, childrenLocation, locations, defaultLocation, locationId } = props
  const [location, setLocation] = useState<PNewCountTableProps>(defaultLocation as unknown as PNewCountTableProps)
  const [isCheckTable, setIsCheckTable] = useState<boolean>(false)
  const [refechtReport, setRefetchReport] = useState<boolean>(false)
  const [assetTab, setAssetTab] = useState<TAssetTab>("INLOCATION");
  const [data, setData] = useState<TAssetRow[]>([])
  const [dataLength, setDataLength] = useState(0)
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs())
  const [documentNumber, setDocumentNumber] = useState<string>("")

  useEffect(() => {
    const getPageLength = async () => {
      const pageLength = await getAssetByLocationCount(locationId)
      setDataLength(pageLength)
    }
    getPageLength()
  }, [locationId])

  useEffect(() => {
    const fetchReport = async () => {
      const report = await getAssetCountReport(dateValue?.toDate()!, locationId)
      if (!report) {
        setData([])
      } else {
        setDocumentNumber(report.document_number)
        const assetCountLineReport = await getAssetCountLineByAssetCount(report.id)
        const mapAssetData: TAssetRow[] = await Promise.all(
          assetCountLineReport.map(async (asset) => {
            const { data, error } = await getUserById(asset.assigned_to!)
            if (error) {
              toast('cannot fetch asset count line')
            }
            return {
              id: asset.id,
              assetCode: asset.asset_code,
              assetName: asset.asset_name,
              assignedTo: {
                id: data?.id,
                first_name: data?.first_name,
                last_name: data?.last_name
              },
              countCheck: asset.asset_check,
              assignIncorrect: asset.is_not_asset_loc
            } as unknown as TAssetRow
          }))
        setData(mapAssetData)
        setRefetchReport(false)
      }
    }

    fetchReport()
  }, [locationId, dateValue, refechtReport])
  return (
    <>
      <DateValueContext
        value={{
          dateValue: dateValue!,
          setDateValue: setDateValue
        }}>
        <ReportContext value={{
          DocumentNumber: documentNumber,
          setDocumentNumber: setDocumentNumber,
          setRefetchReport: setRefetchReport
        }}
        >
          <NewCountInput
            parentLocation={parentLocation}
            childrenLocation={childrenLocation}
            locations={locations}
            location={location}
            defaultLocation={defaultLocation}
            setLocation={setLocation}
            isCheckTable={isCheckTable}
            setIsCheckTable={setIsCheckTable}
            assetTab={assetTab}
          />
          <AssetTable
            data={data as TAssetRow[]}
            isCheckTable={isCheckTable}
            assetTab={assetTab}
            setAssetTab={setAssetTab}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            dataLength={dataLength}
          />
        </ReportContext>
      </DateValueContext>
    </>
  )
}

function useDateContext() {
  const context = useContext(DateValueContext)
  if (!context) {
    throw new Error("useLocatoinUrlContext must be use within Context provider")
  }
  return context
}