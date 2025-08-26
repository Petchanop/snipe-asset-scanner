'use client'
import { ReportState } from "@/_constants/constants";
import { AssetCount, AssetCountLocation, TReportForm } from "@/_types/types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import { updateAssetCountReport } from "@/_repositories/assetCount";
import { useRouter } from "next/navigation";
import { ChildrenSelectComponent, 
  ParentSelectComponent 
} from "@/_components/tables/selectLocationBox";
import { TLocation } from "@/_types/snipe-it.type";
import { ObjectList } from "@/reports/_components/planComponent";
import { CreateAssetCountLocation, 
  DeleteAssetCountLocationByAssetCountId 
} from "@/_repositories/assetCountLocation";
import { EditReportSkeleton } from "@/_components/loading";
import Gone410 from "@/_components/locationNotFound";

export default function SetupPlanComponent(
  props: {
    assetCountReport: AssetCount & { AssetCountLocation: AssetCountLocation[] },
    assetCountLocation: AssetCountLocation[],
    parentLocation: TLocation[],
    childrenLocation: TLocation[],
    otherLocation: TLocation[],
    parentProp: TLocation | null
  }
) {
  const {
    assetCountReport,
    assetCountLocation,
    parentLocation,
    childrenLocation,
    otherLocation,
    parentProp
  } = props
  const { document_date, document_name, state } = assetCountReport
  const { back } = useRouter()
  const [date, setDate] = useState(dayjs(document_date))
  const [parent, setParent] = useState(parentProp)
  const [childId, setChildId] = useState<number | null>()
  const [selected, setSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [documentLocation, setDocumentLocation] = useState<TLocation[]>(
    assetCountReport.AssetCountLocation?.map((countLocation) => {
      return childrenLocation
        .find((loc) => loc.id === countLocation.location_id) ||
        parentLocation.find((loc) => loc.id === countLocation.location_id) ||
        otherLocation.find((loc) => loc.id === countLocation.location_id) as TLocation
    }))


  const [reportForm, setReportForm] = useState<TReportForm>({
    document_date: document_date,
    document_name: document_name as string,
    state: state as ReportState,
    asset_count_location: assetCountLocation.map((loc) => {
      return loc.location_id
    }),
    created_by: assetCountReport.created_by as number
  })

  const { push } = useRouter()

  const handleDateOnChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setDate(value)
      setReportForm((prev: TReportForm) => ({
        ...prev,
        document_date: value.toDate()
      }))
    }
  }

  const handleDocumentNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault()
    setReportForm((prev: TReportForm) => ({
      ...prev,
      document_name: event.target.value
    }))
  }

  const handleSubmit = async () => {
    await updateAssetCountReport(assetCountReport.document_number, reportForm)
    const assetCountLocation = assetCountReport.AssetCountLocation
    const newLocation = documentLocation
    for (let i = 0; i < newLocation.length; i++) {
      const findLocation = assetCountLocation.find((loc) => loc.location_id == newLocation[i]?.id)
      if (findLocation == null) {
        if (i < newLocation.length && newLocation[i] != undefined) {
          await CreateAssetCountLocation(newLocation[i]?.id!, assetCountReport.id)
        }
      }
    }
    for (let i = 0; i < assetCountLocation.length; i++) {
      const findLocation = newLocation.find((loc) => loc.id == assetCountLocation[i]?.location_id)
      if (findLocation == null) {
        await DeleteAssetCountLocationByAssetCountId(
          assetCountLocation[i]!.id,
          assetCountReport.id,
          assetCountLocation[i]!.location_id
        )
      }
    }
    setReportForm((prev: TReportForm) => ({
      ...prev,
      asset_count_location: documentLocation.map((loc: TLocation) => {
        return loc?.id! as number
      })
    }))
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  const handleCancel = () => {
    back()
  }

  useEffect(() => {
    if (selected && childId && documentLocation.find((loc: TLocation) => loc.id == childId) == null) {
      let location = childrenLocation.find((loc) => loc.id == childId) as TLocation
      if (!location) {
        location = parentLocation.find((loc) => loc.id == childId) as TLocation
      }
      setDocumentLocation([...documentLocation, location])
      setReportForm((prev: TReportForm) => ({
        ...prev,
        asset_count_location: [...prev.asset_count_location, location.id!]
      }))
    }
    setSelected(false)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, childId])

  if (documentLocation.length > 0 && documentLocation.some((loc)=> loc == undefined)) {
    return <Gone410 reportId={assetCountReport.document_number}/> 
  }

  return (
    <>
      {
        loading ?
          <EditReportSkeleton />
          : <div className="flex flex-col lg:items-center py-4 space-y-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Select Date"
                value={date}
                format="DD/MM/YYYY"
                className="lg:w-3/5 mt-3 p-4 w-full"
                slotProps={{ textField: { size: 'medium' } }}
                onChange={handleDateOnChange}
              />
            </LocalizationProvider>
            <TextField required
              id="document_name"
              label="ตั้งชื่อรายงานตรวจนับ"
              className="lg:w-3/5 mt-3 p-4 w-full"
              onChange={handleDocumentNameChange}
              value={reportForm.document_name}
            />
            <ParentSelectComponent
              parentLocation={parentLocation}
              parentProp={parent!}
              setParent={setParent}
              className={"lg:w-3/5  mt-3 p-4 w-full"}
            />
            <ChildrenSelectComponent
              parent={parent!}
              locationByParent={childrenLocation}
              childId={childId!}
              setChildId={setChildId}
              className={"lg:w-3/5  mt-3 p-4 w-full"}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelected(true)}
              className="mx-4 w-[9rem] h-[2.5rem]"
            >
              ADD LOCATION
            </Button>
            {/* </div> */}
            <div className="flex flex-row pl-4">
              <ObjectList
                items={documentLocation}
                setItems={setDocumentLocation}
              />
            </div>
            <div className="flex flex-row items-center lg:space-x-4 space-x-2 mx-2">
              <Button
                onClick={handleCancel}
                variant="contained"
                color="error"
                className="w-[7.5rem] h-[2.5rem]"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                className="w-[7.5rem] h-[2.5rem]"
                color='success'
              >
                ยืนยัน
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  push(`/reports/count-assets/${assetCountReport.document_number}`)}
                className="w-[7.5rem] h-[2.5rem]"
              >เริ่มตรวจนับ</Button>
            </div>
          </div>
      }
    </>
  )
}