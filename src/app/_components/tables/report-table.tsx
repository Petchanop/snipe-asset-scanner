'use client'
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function ReportInput(props: {
  ref: string,
  location: string,
  setTableName: (v: string) => void,
  setLocation: (v: string) => void
}) {
  const { location } = props
  return (
    <>
      <div className="lg:pl-10 space-y-2 space-x-2">
        <div className="flex flex-row items-center-safe">
          <Typography className="lg:w-30 w-20">Date</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Select Date"
              disableFuture
              format="DD/MM/YYYY"
              className="lg:w-1/3 w-1/2"
              defaultValue={null}
              disabled
            />
          </LocalizationProvider>
          <Button className={`hover:bg-blue-200 w-20`} >
            Scan
          </Button>
        </div>
        <div className="flex flex-row items-center-safe">
          <Typography className="lg:w-30 w-20">Location</Typography>
          <Select
            id="display location"
            className="lg:w-1/3 w-1/2"
            label="location"
            defaultValue={location}
            renderValue={(location) => {
              return location
            }}
            disabled
          >
          </Select>
          <Button className={`hover:bg-blue-200 w-20`}>
            Finish Count
          </Button>
        </div>
      </div>
    </>
  )
}