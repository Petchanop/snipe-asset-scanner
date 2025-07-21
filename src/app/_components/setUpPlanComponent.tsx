'use client'
import { ReportState } from "@/_constants/constants";
import { AssetCount, AssetCountLocation, TReportForm } from "@/_types/types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ChangeEvent, useState } from "react";
import { updateAssetCountReport } from "@/_libs/report.utils";
import { useRouter } from "next/navigation";

export default function SetupPlanComponent(
    props: { assetCountReport: AssetCount, assetCountLocation: AssetCountLocation[] }
) {
    const { assetCountReport, assetCountLocation } = props
    const { document_date, document_name, state } = assetCountReport
    const { back } = useRouter()
    const [date, setDate] = useState(dayjs(document_date))
    const [reportForm, setReportForm] = useState<TReportForm>({
        document_date: document_date,
        document_name: document_name as string,
        state: state as ReportState,
        asset_count_location: assetCountLocation.map((loc) => {
            return loc.location_id
        })
    })

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
        if (event.target.value) {
            setReportForm((prev: TReportForm) => ({
                ...prev,
                document_name: event.target.value
            }))
        }
    }

    const handleSubmit = async () => {
        await updateAssetCountReport(assetCountReport.document_number, reportForm)
    }

    const handleCancel = () => {
        back()
    }

    return (
        <>
            <div className="flex flex-col">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Select Date"
                        value={date}
                        format="DD/MM/YYYY"
                        className="lg:w-2/3 mt-3 p-4"
                        slotProps={{ textField: { size: 'medium' } }}
                        onChange={handleDateOnChange}
                    />
                </LocalizationProvider>
                <TextField required
                    id="document_name"
                    label="ตั้งชื่อรายงานตรวจนับ"
                    className="lg:w-2/3 mt-3 p-4"
                    onChange={handleDocumentNameChange}
                    value={reportForm.document_name}
                />
                <div className="flex flex-row justify-end p-4 space-x-4">
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
                </div>
            </div>
        </>
    )
}