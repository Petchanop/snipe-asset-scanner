'use client'

import {
  createContext, Dispatch, SetStateAction, SyntheticEvent, useContext, useEffect, useState
} from "react";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import { AssetTable } from "@/_components/tables/list-asset";
import { AssetCount, INLOCATION, OUTLOCATION, TAssetRow, TAssetTab, User } from "@/_types/types";
import { AddAssetCountLine, GetAssetCountLocationByAssetCountReport } from "@/api/report.api";
import dayjs, { Dayjs } from "dayjs";
import { ReportContext, useReportContext } from "@/_components/tableLayout";
import { usePathname, useRouter, useParams } from "next/navigation";
import {
  CheckAllDataCount,
  getAssetByLocationId,
  getAssetCountLineByAssetCount,
  updateAssetCountReport,
} from "@/_libs/report.utils";
import { AssetResponse, getAssetById } from "@/api/snipe-it/snipe-it.api";
import toast from "react-hot-toast";
import { TLocation } from "@/_types/snipe-it.type";
import { ChildrenSelectComponent, ParentSelectComponent } from "@/_components/tables/location-table";
import { ExtendAssetResponse } from "@/_components/tables/search-asset";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { LoadingTableSkeleton } from "@/_components/loading";
import { ReportState } from "@/_constants/constants";

function CheckAssetButton(props: {
  setIsCheckTable: (value: SetStateAction<boolean>) => void,
  childId: number
}) {
  const { setIsCheckTable, childId } = props
  const reportContext = useReportContext()
  const pathname = usePathname()
  const { push } = useRouter()

  const handleSavebutton = () => {
    setIsCheckTable(false)
    reportContext.setUpdate(true)
  }

  const handleFinishButton = async () => {
    await updateAssetCountReport(reportContext.DocumentNumber!, {
      state: ReportState.COMPLETED
    })
  }
  return (
    <div className="flex flex-row w-full lg:pl-4 lg:space-x-4 justify-start content-center items-center">
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3
        max-md:text-sm max-md:font-medium`
        }
          variant="text"
          onClick={() => {
            push(`${pathname}/check?location=${childId}`)
          }}
        >ค้นหา</Button>
      </div>
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3 
        max-md:text-sm max-md:font-medium`
        }
          onClick={handleSavebutton}
        >บันทึก</Button>
      </div>
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3 
        max-md:text-sm max-md:font-medium`
        }
          onClick={() => setIsCheckTable((pre) => !pre)}
        >ยกเลิก</Button>
      </div>
      <div className="flex flex-col">
        <Button className={
          `hover:bg-blue-200 max-md:w-1/3 
        max-md:text-sm max-md:font-medium`
        }
          onClick={handleFinishButton}
        >จบการตรวจนับ</Button>
      </div>
    </div>
  )
}

function SelectCountInput(props: {
  isCheckTable: boolean,
}) {
  const {
    isCheckTable,
  } = props
  const dateContext = useDateContext()

  const handleDateOnChange = (value: SetStateAction<dayjs.Dayjs | null>) => {
    if (value) {
      dateContext.setDateValue(value)
    }
  }

  return (
    <>
      <div className="flex md:flex-row flex-col md:items-center">
        <Typography className="w-22 max-lg:w-25">Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select Date"
            value={dateContext.dateValue}
            format="DD/MM/YYYY"
            className="lg:w-2/3 w-4/5 max-md:mt-4 max-md:p-4"
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
  const params = useParams<{ reportId: string }>()
  const documentNumber = params.reportId ? parseInt(params.reportId) : 0
  const documentContext = useReportContext()

  async function handleClickStart() {
    setIsCheckTable((pre) => !pre)


    documentContext.setDocumentNumber(documentNumber)
    replace(`${window.location.href}`)
  }

  async function handleGetData() {
    setLocation(selectedLocation);
    documentContext.setDocumentNumber(documentNumber)
    documentContext.setRefetchReport(true)
  }

  return (
    <div className="flex flex-row md:flex-col pt-2 max-md:w-4/5 md:justify-center md:space-y-2 max-md:space-x-2 max-md:pl-4">
      <div className="flex flex-row">
        <Button className={
          `hover:bg-blue-200 max-md:w-full
          max-md:text-sm max-md:font-medium`
        }
          onClick={handleGetData}
        >
          เรียกดูข้อมูล
        </Button>
      </div>
      <div className="flex flex-row">
        <Button className={
          `hover:bg-blue-200 max-md:w-full
          max-md:text-sm max-md:font-medium
          `}
          onClick={handleClickStart}
        >
          เริ่มตรวจนับ
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
  const documentContext = useReportContext()

  useEffect(() => {
    setLocation(locations?.find((loc) => childId ? loc.id == childId : loc.id == parent.id)!);
  }, [childId, locations, setLocation, parent.id])
  return (
    <div className="flex md:flex-row flex-col w-full py-2 pl-2 lg:pl-10 content-center">
      <div className="flex flex-col md:basis-lg space-y-2">
        {
          isCheckTable ?
            <Typography className="mt-2 mb-4">รายงานหมายเลข {documentContext.DocumentNumber}</Typography>
            : <></>
        }
        <div className="flex md:flex-row flex-col md:items-center">
          <SelectCountInput
            isCheckTable={isCheckTable}
          />
        </div>
        <div className="flex md:flex-row flex-col md:items-center">
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
      <div className="flex flex-row md:flex-col md:basis-md md:pt-10">
        {
          isCheckTable ?
            assetTab ?
              <CheckAssetButton setIsCheckTable={setIsCheckTable} childId={childId!} />
              : <></>
            : <SelectCountButton
              selectedLocation={location}
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

export const DateValueContext = createContext<TDateValueContext | null>(null)

export default function NewCountTable(props: {
  allLocation: TLocation[],
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  locations: PNewCountTableProps[],
  defaultLocation: TLocation;
  locationId: number;
  parentProp: TLocation;
  users: User[];
  report: AssetCount | null;
}) {
  const {
    allLocation,
    parentLocation,
    childrenLocation,
    locations,
    defaultLocation,
    locationId,
    parentProp,
    users,
    report } = props
  const [location, setLocation] = useState<PNewCountTableProps>(defaultLocation as unknown as PNewCountTableProps)
  const [isCheckTable, setIsCheckTable] = useState<boolean>(false)
  const [refetchReport, setRefetchReport] = useState<boolean>(false)
  const [assetTab, setAssetTab] = useState<TAssetTab>("INLOCATION");
  const [data, setData] = useState<TAssetRow[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  const [documentNumber, setDocumentNumber] = useState<number>()
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!dateValue) {
      setDateValue(dayjs(report?.document_date))
    }
  }, [dateValue, report])
  useEffect(() => {
    setData([])
  }, [locationId])

  useEffect(() => {
    const fetchReport = async () => {
      setData([])
      setLoading(true)
      if (!report) {
        setData([])
      } else {
        setDocumentNumber(report.document_number)
        const locationIds = await GetAssetCountLocationByAssetCountReport(report.id)
        const assetLocationId = locationIds.find((loc) => loc.location_id == location.id)
        let assetCountLineReport = await getAssetCountLineByAssetCount(report.id, assetLocationId?.id as string)
        if (assetCountLineReport.length == 0) {
          const { data, error } = await getAssetByLocationId(location.id)
          if (error || data) {
            toast.error(`${report.document_number} asset data not found.`)
          }
          assetCountLineReport = await Promise.all(data!.map(async (asset: AssetResponse) => {
            const extendTypeAsset: ExtendAssetResponse = {
              ...asset,
              asset_name_not_correct: false,
              is_not_asset_loc: asset.location?.id != location.id,
              is_assigned_incorrectly: false,
              asset_check: false,
              in_report: false,
              location_id: assetLocationId?.id as string,
              status: asset.status_label?.status_meta as string,
              prev_location: allLocation.find((loc) => loc.id == asset.location) as TLocation
            }
            return await AddAssetCountLine(extendTypeAsset, report)
          }))
        }
        const mapAssetData = await Promise.all(
          assetCountLineReport.map(async (asset) => {
            const data = users.find((user) => user.id as number == asset.assigned_to)
            let prev_loc = allLocation.find((loc) => loc.id == asset.previous_loc_id) as TLocation
            if (!asset.previous_loc_id && asset.is_not_asset_loc) {
              const assetData = await getAssetById(asset.asset_id)
              prev_loc = assetData.data?.location as unknown as TLocation
            }
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
              notInLocation: asset.is_not_asset_loc ? asset.is_not_asset_loc : false,
              assignIncorrect: asset.is_assigned_incorrectly,
              status: asset.asset_count_line_status_id,
              prev_location: prev_loc?.name
            } as unknown as TAssetRow
          }))

        if (await CheckAllDataCount(report.id) == true) {
          await updateAssetCountReport(report.document_number, {
            ...report,
            state: ReportState.COMPLETED
          })
        } else {
          await updateAssetCountReport(report.document_number, {
            ...report,
            state: ReportState.INPROGRESS
          })
        }

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
                  data={data.filter((loc) => loc.notInLocation == false) as TAssetRow[]}
                  isCheckTable={isCheckTable}
                  assetTab={assetTab}
                  setAssetTab={setAssetTab}
                  tabValue={INLOCATION}
                />
                <AssetTable
                  data={data.filter((loc) => loc.notInLocation == true) as TAssetRow[]}
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

export function useDateContext() {
  const context = useContext(DateValueContext)
  if (!context) {
    throw new Error("useLocatoinUrlContext must be use within Context provider")
  }
  return context
}