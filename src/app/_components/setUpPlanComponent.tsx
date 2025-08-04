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
import { updateAssetCountReport } from "@/_libs/report.utils";
import { useRouter } from "next/navigation";
import { ChildrenSelectComponent, ParentSelectComponent } from "@/_components/tables/location-table";
import AddIcon from "@mui/icons-material/Add"
import IconButton from "@mui/material/IconButton";
import { TLocation } from "@/_types/snipe-it.type";
import { ObjectList } from "@/_components/planComponent";
import { CreateAssetCountLocation, DeleteAssetCountLocationByAssetCountId } from "@/api/report.api";

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

    return (
        <>
            <div className="flex flex-col">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Select Date"
                        value={date}
                        format="DD/MM/YYYY"
                        className="lg:w-3/5 mt-3 p-4"
                        slotProps={{ textField: { size: 'medium' } }}
                        onChange={handleDateOnChange}
                    />
                </LocalizationProvider>
                <TextField required
                    id="document_name"
                    label="ตั้งชื่อรายงานตรวจนับ"
                    className="lg:w-3/5 mt-3 p-4"
                    onChange={handleDocumentNameChange}
                    value={reportForm.document_name}
                />
                <ParentSelectComponent
                    parentLocation={parentLocation}
                    parentProp={parent!}
                    setParent={setParent} />
                <div className="flex flex-row max-md:flex-col items-center space-x-2">
                    <ChildrenSelectComponent
                        parent={parent!}
                        locationByParent={childrenLocation}
                        childId={childId!}
                        setChildId={setChildId} />
                    <IconButton
                        color="primary"
                        onClick={() => setSelected(true)}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
                <div className="flex flex-row pl-4">
                    <ObjectList
                        items={documentLocation}
                        setItems={setDocumentLocation}
                    />
                </div>
                <div className="flex flex-row justify-center p-4 space-x-4">
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        className="w-[8rem] p-4"
                    >
                        ยืนยัน
                    </Button>
                    <Button
                        onClick={handleCancel}
                        variant="contained"
                        color="error"
                        className="w-[8rem] p-4"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() =>
                            push(`/reports/count-assets/${assetCountReport.document_number}`)}
                        className="w-[8rem] p-4"
                    >เริ่มทำการตรวจนับ</Button>
                </div>
            </div>
        </>
    )
}