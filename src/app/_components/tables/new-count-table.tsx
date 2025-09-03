'use client'

import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect, useState
} from "react";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AssetTable } from "@/_components/tables/list-asset";
import {
  AssetCount, AssetCountLocation,
  INLOCATION, OUTLOCATION,
  TAssetRow, TAssetTab, User,
  userNameId
} from "@/_types/types";
import { GetAssetCountLocationByAssetCountReport } from "@/_repositories/assetCountLocation";
import dayjs, { Dayjs } from "dayjs";
import {
  DateValueContext,
  ReportContext,
  useDateContext,
  useReportContext
} from "@/_contexts/context";
import { useRouter } from "next/navigation";
import { getAssetCountLineByAssetCount } from "@/_repositories/assetCountLine";
import { CheckAllDataCount } from "@/_libs/assetCount";
import { updateAssetCountReport } from "@/_repositories/assetCount";
import { getAssetById } from "@/_intergrations/snipeit/assets";
import { TLocation } from "@/_types/snipe-it.type";
import { ChildrenSelectComponent, ParentSelectComponent } from "@/_components/tables/selectLocationBox";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { LoadingTableSkeleton, useWindowSize } from "@/_components/loading";
import { ReportState } from "@/_constants/constants";
import ListAssetMobile from "@/_components/tables/list-asset-mobile";
import { mapAssetData } from "@/_components/tables/utility";
import toast, { Toaster } from "react-hot-toast";
import { CheckAssetGroupButtonprops, CountAssetButton } from "@/_components/countAssetButton";
import Box from "@mui/material/Box";
// import SpeedDial from "@mui/material/SpeedDial";
// import SpeedDialIcon from "@mui/material/SpeedDialIcon";
// import SpeedDialAction from "@mui/material/SpeedDialAction";
// import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
// import SearchIcon from '@mui/icons-material/Search';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Cancel';
// import DoneIcon from '@mui/icons-material/Done';
// import EditIcon from '@mui/icons-material/Edit'
/*
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
    toast.success(`จบการตรวจนับทรัพย์สิน`)
  }

  const actions = [
    {
      icon: <SearchIcon />, name: 'ค้นหา', onClick: () => {
        push(`${pathname}/check?location=${childId}`)
      }
    },
    { icon: <CancelIcon />, name: 'ยกเลิก', onClick: () => setIsCheckTable((pre) => !pre) },
    { icon: <SaveIcon />, name: 'บันทึก', onClick: handleSavebutton },
    { icon: <DoneIcon />, name: 'จบการตรวจนับ', onClick: handleFinishButton },
  ];

  const windowSize = useWindowSize()
  const dialPosition = windowSize.width as number < 500 ? 16 : 50
  return (
    <SpeedDial
      ariaLabel="Floating Action Button"
      sx={{ position: 'fixed', bottom: dialPosition, right: dialPosition }}
      FabProps={{ color: 'default' }}
      icon={<EditIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          onClick={action.onClick}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              display: 'inline-block',
              cursor: 'pointer',
              backgroundColor: '#e0f7fa',
              borderRadius: '4px',
              width: "7.5rem",
              height: "2rem",
              textAlign: "center",
              fontSize: "0.8rem"
            },
          }}
          slotProps={{
            tooltip: {
              open: true,
              title: action.name
            },
          }}
        />
      ))}
    </SpeedDial>
  )
}

function SelectCountButton(props: {
  selectedLocation: PNewCountTableProps,
  setLocation: (value: PNewCountTableProps) => void,
  setIsCheckTable: (value: SetStateAction<boolean>) => void
}) {
  const {
    setIsCheckTable
  } = props
  const params = useParams<{ reportId: string }>()
  const documentNumber = params.reportId ? parseInt(params.reportId) : 0
  const documentContext = useReportContext()

  async function handleClickStart() {
    setIsCheckTable((pre) => !pre)
    documentContext.setDocumentNumber(documentNumber)
  }

  const actions = [
    { icon: <PlayCircleFilledIcon />, name: 'เริ่มตรวจนับ', onClick: handleClickStart },
  ];
  const windowSize = useWindowSize()
  const dialPosition = windowSize.width as number < 500 ? 16 : 50
  return (
    <SpeedDial
      ariaLabel="Floating Action Button"
      sx={{ position: 'fixed', bottom: dialPosition, right: dialPosition }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          onClick={action.onClick}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              display: 'inline-block',
              cursor: 'pointer',
              backgroundColor: '#e0f7fa',
              borderRadius: '4px',
              width: "7.5rem",
              height: "2rem",
              textAlign: "center",
              fontSize: "0.8rem"
            },
          }}
          slotProps={{
            tooltip: {
              open: true,
              title: action.name
            },
          }}
        />
      ))}
    </SpeedDial>
  )
}
  */

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
    //eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [childId, parent?.id, locations])
  return (
    <>
      <div className="flex md:flex-row flex-col w-full py-2 pl-2 lg:pl-10 content-center">
        <div className="flex flex-col md:basis-lg space-y-2">
          {
            isCheckTable ?
              <Typography className="mt-2 mb-4">
                รายงานหมายเลข {documentContext.DocumentNumber}
              </Typography>
              : <></>
          }
          <div className="flex md:flex-row flex-col md:items-center">
            <SelectCountInput
              isCheckTable={isCheckTable}
            />
          </div>
          <div className="flex md:flex-row flex-col md:items-center w-full">
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
      </div>
      <Box
        className="flex flex-row md:flex-col md:pt-10 w-full"
      >
        {
          isCheckTable ?
            assetTab ?
              // <CheckAssetButton
              //   setIsCheckTable={setIsCheckTable}
              //   childId={childId!}
              // />
              <CheckAssetGroupButtonprops
                setIsCheckTable={setIsCheckTable}
                childId={childId!}
              />
              : <></>
            :
            // <SelectCountButton
            //   selectedLocation={location}
            //   setLocation={setLocation}
            //   setIsCheckTable={setIsCheckTable}
            // />
            <CountAssetButton
              selectedLocation={location}
              setLocation={setLocation}
              setIsCheckTable={setIsCheckTable}
            />
        }
      </Box>
    </>
  )
}

export type PNewCountTableProps =
  { name: string, id: number, rtd_location_id?: number }

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
  user: any;
  baseUrl: string;
  assetCountLocation: AssetCountLocation[];
}) {
  const {
    allLocation,
    parentLocation,
    childrenLocation,
    locations,
    defaultLocation,
    parentProp,
    users,
    user,
    baseUrl,
    report,
    assetCountLocation
  } = props
  const [location, setLocation] = useState<PNewCountTableProps>(defaultLocation as unknown as PNewCountTableProps)
  const [isCheckTable, setIsCheckTable] = useState<boolean>(false)
  const [refetchReport, setRefetchReport] = useState<boolean>(false)
  const [assetTab, setAssetTab] = useState<TAssetTab>("INLOCATION");
  const [data, setData] = useState<TAssetRow[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  const [documentNumber, setDocumentNumber] = useState<number>()
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  //eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const [IsSearch, setIsSearch] = useState<boolean>(false)
  const media = useWindowSize()
  const { push } = useRouter()

  const getSortMapData = async (assetLocationId: AssetCountLocation) => {
    const assetCountLineReport = await getAssetCountLineByAssetCount(report!.id, assetLocationId?.id as string)
    const AssetData = await Promise.all(
      assetCountLineReport.map(async (asset) => {
        const data = users.find((user) => user.id as number == asset.assigned_to)
        let prev_loc = allLocation.find((loc) => loc.id == asset.previous_loc_id) as TLocation
        if (!asset.previous_loc_id && asset.is_not_asset_loc) {
          const assetData = await getAssetById(asset.asset_id)
          prev_loc = assetData.data?.location as unknown as TLocation
        }
        return mapAssetData(asset, data as User, prev_loc, baseUrl) as TAssetRow
      }))
    return AssetData.sort((a, b) => Number(b.countCheck) - Number(a.countCheck))
  }

  useEffect(() => {
    if (!dateValue) {
      setDateValue(dayjs(report?.document_date))
    }
  }, [dateValue, report])

  useEffect(() => {
    setData([])
    const setChangeLocationProp = async () => {
      setLoading(true)
      const assetLocationId = assetCountLocation.find((loc) => loc.location_id == location.id)
      const sortMapData = await getSortMapData(assetLocationId!)
      setData(sortMapData)
      setLoading(false)
    }
    setChangeLocationProp()
  }, [location.id])

  useEffect(() => {
    const fetchReport = async () => {
      setData([])
      setLoading(true)
      if (!report) {
        setData([])
      } else {
        setDocumentNumber(report.document_number)
        const assetLocationId = assetCountLocation.find((loc) => loc.location_id == location.id)
        if (await CheckAllDataCount(report.id) == true) {
          await updateAssetCountReport(report.document_number, {
            ...report,
            state: ReportState.COMPLETED
          })
          toast.success(`All assets have been checked`)
        }
        const sortMapData = await getSortMapData(assetLocationId!)
        setData(sortMapData)
        setRefetchReport(false)
        setLoading(false)
      }
    }
    if (refetchReport)
      fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchReport])

  useEffect(() => {
    const updateAssetCountLine = async () => {
      if (update && report) {
        setLoading(true)
        const locationIds = await GetAssetCountLocationByAssetCountReport(report.id)
        const assetLocationId = locationIds.find((loc) => loc.location_id == location.id)
        const sortMapData = await getSortMapData(assetLocationId!)
        setData(sortMapData)
        setTimeout(() => {
          setLoading(false)
        }, 200)
        setUpdate(false)
      }
    }
    updateAssetCountLine()
  }, [update])

  function handleSelectValue(event: SyntheticEvent, newValue: string) {
    setAssetTab(newValue as TAssetTab)
  }

  useEffect(() => {
    if (!user)
      push(`/auth/login`)
  }, [user, push])

  const usersProp: userNameId[] = users.map((user) => {
    return {
      id: user.id,
      name: user.first_name + " " + user.last_name
    }
  })
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
          setUpdate: setUpdate,
          setSearch: setIsSearch
        }}
        >
          <Toaster
            containerStyle={{
              position: 'relative',
              top: '20%',
            }}
            toastOptions={{
              success: {
                duration: 2500,
                style: {
                  background: '#45b42fff',
                  color: '#fff',
                }
              }
            }}
          ></Toaster>
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
              : media.width as number < 500 ?
                <>
                  <ListAssetMobile
                    data={data.filter((loc) => loc.notInLocation == false) as unknown as TAssetRow[]}
                    isCheckTable={isCheckTable}
                    assetTab={assetTab}
                    setAssetTab={setAssetTab}
                    tabValue={INLOCATION}
                    users={usersProp}
                  />
                  <ListAssetMobile
                    data={data.filter((loc) => loc.notInLocation == true) as unknown as TAssetRow[]}
                    isCheckTable={isCheckTable}
                    assetTab={assetTab}
                    setAssetTab={setAssetTab}
                    tabValue={OUTLOCATION}
                    users={usersProp}
                  />
                </> :
                <>
                  <AssetTable
                    data={data.filter((loc) => loc.notInLocation == false) as unknown as TAssetRow[]}
                    isCheckTable={isCheckTable}
                    assetTab={assetTab}
                    setAssetTab={setAssetTab}
                    tabValue={INLOCATION}
                    users={usersProp}
                  />
                  <AssetTable
                    data={data.filter((loc) => loc.notInLocation == true) as unknown as TAssetRow[]}
                    isCheckTable={isCheckTable}
                    assetTab={assetTab}
                    setAssetTab={setAssetTab}
                    tabValue={OUTLOCATION}
                    users={usersProp}
                  />
                </>
          }
        </ReportContext>
      </DateValueContext>
    </>
  )
}

