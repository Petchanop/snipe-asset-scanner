'use client'

import {
  createContext, Dispatch, SetStateAction, SyntheticEvent, useContext, useEffect, useState
} from "react";
import { mockLocationTableData } from "@/_constants/mockData";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import { AssetTable } from "@/_components/tables/list-asset";
import { INLOCATION, OUTLOCATION, TAssetRow, TAssetTab, TSnipeDocument, User } from "@/_types/types";
import { AddAssetCountLine } from "@/_apis/report.api";
import dayjs, { Dayjs } from "dayjs";
import { ReportContext, useLocationUrlContext, useReportContext } from "@/_components/tableLayout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createAssetCountReport, createDocumentNumber,
  findAssetCount,
  getAssetByLocationId,
  getAssetCountLineByAssetCount, getAssetCountReport,
} from "@/_libs/report.utils";
import { AssetResponse } from "@/_apis/snipe-it/snipe-it.api";
import { ReportState } from "@/_constants/constants";
import toast from "react-hot-toast";
import { TLocation } from "@/_types/snipe-it.type";
import { ChildrenSelectComponent, ParentSelectComponent } from "./location-table";
import { ExtendAssetResponse } from "./search-asset";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { LoadingTableSkeleton } from "../loading";

function CheckAssetButton(props: {
  setIsCheckTable: (value: SetStateAction<boolean>) => void
}) {
  const { setIsCheckTable } = props
  const reportContext = useReportContext()
  const pathname = usePathname()
  const searchParam = useSearchParams()
  const location = searchParam.get('location')
  const { push } = useRouter()

  const handleFinishbutton = () => {
    setIsCheckTable(false)
    reportContext.setUpdate(true)
  }
  return (
    <div className="flex flex-row w-full lg:pl-4 lg:space-x-4 justify-start content-center items-center">
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3
        max-md:text-xs max-md:font-medium`
        }
          variant="text"
          onClick={() => {
            push(`${pathname}/${reportContext.DocumentNumber}/check?location=${location!.toString()}`)
          }}
        >Search</Button>
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

  const handleDateOnChange = (value: SetStateAction<dayjs.Dayjs | null>) => {
    if (value) {
      setDocumentDate(value.toString())
      dateContext.setDateValue(value)
    }
  }

  return (
    <>
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
    if (!document) {
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
  }

  async function handleGetData() {
    setLocation(selectedLocation);
    const documentNumber = await createDocumentNumber(
      locationContext.locationId,
      dateContext.dateValue.format('DD/MM/YYYY')
    )
    const document = await findAssetCount(documentNumber)
    if (!document) {
      const reportPayload = {
        document_number: documentNumber,
        document_date: new Date(dateContext.dateValue.format('DD/MM/YYYY')),
        rtd_location_id: selectedLocation.rtd_location_id as number,
        location_id: locationContext.locationId,
        state: ReportState.NEW
      }
      await createAssetCountReport(reportPayload)
    }
    documentContext.setDocumentNumber(documentNumber)
    documentContext.setRefetchReport(true)
    // replace(`${window.location.href}`)
  }

  return (
    <div className="flex flex-col pt-2 max-md:w-2/5 justify-center space-y-2">
      <div className="flex flex-row">
        <Button className={
          `hover:bg-blue-200 max-md:w-2/5 
          max-md:text-xs max-md:font-medium`
        }
          onClick={handleGetData}
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
  parentProp: TLocation
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
    defaultLocation,
    parentProp
  } = props
  const [parent, setParent] = useState(parentProp)
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
        {
          isCheckTable ?
            <Typography className="mt-2 mb-4">{documentContext.DocumentNumber}</Typography>
            : <></>
        }
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
            isCheckTable={isCheckTable}
            setParent={setParent} />
          <ChildrenSelectComponent
            parent={parent!}
            locationByParent={childrenLocation}
            isCheckTable={isCheckTable}
            childId={childId!}
            setChildId={setChildId} />
        </div>
      </div>
      <div className="flex flex-col basis-md pt-10">
        {
          isCheckTable ?
            assetTab ?
              <CheckAssetButton setIsCheckTable={setIsCheckTable} />
              : <></>
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
  parentProp: TLocation;
  users: User[];
}) {
  const { parentLocation, childrenLocation, locations, defaultLocation, locationId, parentProp, users } = props
  const [location, setLocation] = useState<PNewCountTableProps>(defaultLocation as unknown as PNewCountTableProps)
  const [isCheckTable, setIsCheckTable] = useState<boolean>(false)
  const [refetchReport, setRefetchReport] = useState<boolean>(false)
  const [assetTab, setAssetTab] = useState<TAssetTab>("INLOCATION");
  const [data, setData] = useState<TAssetRow[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs())
  const [documentNumber, setDocumentNumber] = useState<string>("")
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setData([])
  }, [locationId])

  useEffect(() => {
    const fetchReport = async () => {
      setData([])
      setLoading(true)
      const report = await getAssetCountReport(dateValue?.toDate()!, locationId)
      if (!report) {
        setData([])
      } else {
        setDocumentNumber(report.document_number)
        let assetCountLineReport = await getAssetCountLineByAssetCount(report.id)
        if (assetCountLineReport.length == 0) {
          console.log("create asset count line for ", report)
          const { data, error } = await getAssetByLocationId(locationId)
          if (error || data) {
            toast.error(`${report.document_number} asset data not found.`)
          }
          assetCountLineReport = await Promise.all(data!.map(async (asset: AssetResponse) => {
            const extendTypeAsset: ExtendAssetResponse = {
              ...asset,
              asset_name_not_correct: false,
              is_not_asset_loc: asset.location?.id != report.location_id,
              asset_check: false,
              in_report: false,
              status: asset.status_label?.status_meta as string
            }
            return await AddAssetCountLine(extendTypeAsset, report)
          }))
        }
        const mapAssetData = await Promise.all(
          assetCountLineReport.map(async (asset) => {
            const data = users.find((user) => user.id as number == asset.assigned_to)
            return {
              id: asset.id,
              assetCode: asset.asset_code,
              assetName: asset.asset_name,
              assignedTo: {
                id: asset.assigned_to,
                first_name: data ? data!.first_name : null,
                last_name: data ? data!.last_name : null
              },
              countCheck: asset.asset_check ? asset.asset_check : false,
              assignIncorrect: asset.is_not_asset_loc ? asset.is_not_asset_loc : false,
              status: asset.asset_count_line_status_id
            } as unknown as TAssetRow
          }))

        setData(mapAssetData.sort((a, b) => Number(b.countCheck) - Number(a.countCheck)))
        setRefetchReport(false)
        setLoading(false)
      }
    }
    if (refetchReport)
      fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchReport])


  useEffect(() => {
    const updateAssetCountLine = () => {
      if (update) {
        setRefetchReport(true)
      }
    }

    updateAssetCountLine()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update])

  function handleSelectValue(event: SyntheticEvent, newValue: string) {
    setAssetTab(newValue as TAssetTab)
  }
  return (
    <>
      <DateValueContext
        value={{
          dateValue: dateValue!,
          setDateValue: setDateValue
        }}>
        <ReportContext value={{
          DocumentNumber: documentNumber,
          update: update,
          setDocumentNumber: setDocumentNumber,
          setRefetchReport: setRefetchReport,
          setUpdate: setUpdate
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
            parentProp={parentProp}
          />
          <Tabs
            value={assetTab}
            className="pl-2"
            onChange={handleSelectValue}
          >
            <Tab value={INLOCATION} label="assets in location"></Tab>
            <Tab value={OUTLOCATION} label="additional assets in location"></Tab>
          </Tabs>
          {
            loading ?
              <LoadingTableSkeleton />
              :
              <>
                <AssetTable
                  data={data.filter((loc) => loc.assignIncorrect == false) as TAssetRow[]}
                  isCheckTable={isCheckTable}
                  assetTab={assetTab}
                  setAssetTab={setAssetTab}
                  tabValue={INLOCATION}
                />
                <AssetTable
                  data={data.filter((loc) => loc.assignIncorrect == true) as TAssetRow[]}
                  isCheckTable={isCheckTable}
                  assetTab={assetTab}
                  setAssetTab={setAssetTab}
                  tabValue={OUTLOCATION}
                />
              </>
          }

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