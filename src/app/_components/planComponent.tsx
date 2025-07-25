'use client'

import Button from "@mui/material/Button"
import { TLocation } from "@/_types/snipe-it.type"
import { ChangeEvent, createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useDateContext } from "@/_components/reportComponent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChildrenSelectComponent, ParentSelectComponent } from "@/_components/tables/location-table";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"
import { createAssetCountReport } from "@/_libs/report.utils";
import { CreateDocumentStep, ReportState } from "@/_constants/constants";
import { CreateAssetCountLocation } from "@/_apis/report.api";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import { TReportForm } from "@/_types/types";

type TCreateReportContext = {
  report: TReportForm,
  setReport: Dispatch<SetStateAction<TReportForm>>
}

const CreateReportContext = createContext<TCreateReportContext | null>(null);

export function useCreateReportContext() {
  const context = useContext(CreateReportContext)
  if (!context) {
    throw new Error("useCreateReportContext must be use within Context provider")
  }
  return context
}

const steps = ["เลือกวันที่", "ตั้งชื่อรายงานตรวจนับ", "เพิ่มสถานที่", "ยืนยัน"];

export function ObjectList(props: {
  items: Exclude<TLocation[], undefined>,
  setItems: Dispatch<SetStateAction<Exclude<TLocation[], undefined>>>
}) {
  const { items, setItems } = props
  const handleDelete = async (id: number) => {
    setItems((prev) => prev.filter((item: TLocation) => item.id !== id));
  };
  return (
    <Box sx={{ maxWidth: 500, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        รายการชื่อสถานที่
      </Typography>

      <List className="mb-4">
        {items.map((item) => (
          <div key={item.id}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(item.id!)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.name}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      {items.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mt: 2, mb: 4 }}>
          ไม่มีรายการในขณะนี้
        </Typography>
      )}
    </Box>
  );
}

function StepComponent(props: {
  step: number,
  reportForm: any,
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  otherLocation?: TLocation[],
  parentProp: TLocation | null,
  childProp: TLocation | null,
  disableButton: boolean,
  setDisableButton: Dispatch<SetStateAction<boolean>>
}) {
  const { step, parentLocation, childrenLocation, parentProp, disableButton, setDisableButton } = props
  const CreateReportContext = useCreateReportContext()
  const [parent, setParent] = useState(parentProp)
  const [childId, setChildId] = useState<number | null>()
  const [selected, setSelected] = useState(false)
  const [documentLocation, setDocumentLocation] = useState<TLocation[]>(CreateReportContext.report.asset_count_location.map((id: number) => {
    return childrenLocation.find((loc) => loc.id === id) || parentLocation.find((loc) => loc.id === id) as TLocation
  }))
  const dateContext = useDateContext()
  const handleDateOnChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      dateContext.setDateValue(value)
      CreateReportContext.setReport((prev: TReportForm) => ({
        ...prev,
        document_date: value.toDate()
      }))
    }
  }

  const handleDocumentNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault()
    CreateReportContext.setReport((prev: TReportForm) => ({
      ...prev,
      document_name: event.target.value
    }))
    if (event.target.value.length == 0) {
      setDisableButton(true)
    } else {
      setDisableButton(false)
    }
  }

  useEffect(() => {
    if (selected && childId && documentLocation.find((loc: TLocation) => loc.id == childId) == null) {
      let location = childrenLocation.find((loc) => loc.id == childId) as TLocation
      if (!location) {
        location = parentLocation.find((loc) => loc.id == childId) as TLocation
      }
      setDocumentLocation([...documentLocation, location])
      CreateReportContext.setReport((prev: TReportForm) => ({
        ...prev,
        asset_count_location: [...prev.asset_count_location, location.id!]
      }))
    }
    setSelected(false)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, childId])

  useEffect(() => {
    if (documentLocation.length == 0 && step == CreateDocumentStep.ADDLOCATION)
      setDisableButton(true)
    else if (documentLocation.length && step == CreateDocumentStep.ADDLOCATION)
      setDisableButton(false)
  }, [documentLocation, setDisableButton, step])

  switch (step) {
    case CreateDocumentStep.CHOOSEDATE:
      return (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Select Date"
              value={dateContext.dateValue}
              format="DD/MM/YYYY"
              className="lg:w-2/3 mt-3 p-4"
              slotProps={{ textField: { size: 'medium' } }}
              onChange={handleDateOnChange}
            />
          </LocalizationProvider>
        </>
      )
    case CreateDocumentStep.REPORTNAME:
      if (CreateReportContext.report.document_name)
        setDisableButton(false)
      return (
        <>
          <TextField required
            error={disableButton}
            id="document_name"
            label="ตั้งชื่อรายงานตรวจนับ"
            className="w-full mt-3 p-4"
            onChange={handleDocumentNameChange}
            value={CreateReportContext.report.document_name}
          />
        </>
      )
    case CreateDocumentStep.ADDLOCATION:
      return (
        <>
          <div className="flex flex-col">
            <div className="flex lg:flex-row max-md:flex-col">
              <ParentSelectComponent
                parentLocation={parentLocation}
                parentProp={parent!}
                setParent={setParent} />
              <div className="flex flex-row items-center space-x-2">
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
            </div>
            <div className="flex flex-row">
              <ObjectList
                items={documentLocation}
                setItems={setDocumentLocation}
              />
            </div>
          </div>
        </>
      )
    case CreateDocumentStep.CONFIRM:
      return (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row">
              ชื่อเอกสาร {CreateReportContext.report.document_name}
            </div>
            <div className="flex flex-row">
              วันที่ {CreateReportContext.report.document_date?.toLocaleDateString('th-TH')}
            </div>
            สถานที่
            <List className="mb-4">
              {
                documentLocation.map((item) => (
                  <div key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
            </List>
          </div>
        </>
      )
  }
}

function ValidReportForm(reportForm: TReportForm): boolean {
  if (reportForm.asset_count_location.length != 0 && reportForm.document_name.length != 0) {
    return true
  }
  return false
}


export default function CreatePlanComponent(props: {
  location: TLocation[],
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  parentProp: TLocation | null,
  childProp: TLocation | null
}) {
  const { parentLocation, childrenLocation, parentProp, childProp } = props
  const [reportForm, setReportForm] = useState<TReportForm>({
    document_date: null,
    document_name: "",
    state: ReportState.NEW,
    asset_count_location: []
  })
  const [activeStep, setActiveStep] = useState(0);
  const [disableButton, setDisableButton] = useState(false)
  const { push } = useRouter()

  const handleNext = async () => {
    console.log("active step ", activeStep)
    if (activeStep < steps.length) {
      setActiveStep((prev) => prev + 1)
      if (!ValidReportForm(reportForm))
        setDisableButton(true) 
      if (activeStep === CreateDocumentStep.CONFIRM) {
        setDisableButton(false)
        if (reportForm !== null && typeof reportForm !== 'undefined') {
          console.log('create report form ', reportForm.document_name)
          const assetCountReport = await createAssetCountReport(reportForm as unknown as TReportForm)
          for (const location of (reportForm as unknown as TReportForm).asset_count_location) {
            await CreateAssetCountLocation(location, assetCountReport.id)
          }
          setReportForm((prev) => ({
            ...prev,
            id: assetCountReport.id,
            document_number: assetCountReport.document_number,
            document_date: assetCountReport.document_date,
            state: assetCountReport.state as ReportState,
            asset_count_location: (reportForm as unknown as TReportForm).asset_count_location
          }))
        }
      }
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      if (!ValidReportForm(reportForm))
        setDisableButton(false)
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleNewRequest = () => {
    setActiveStep(0)
    setReportForm({
      id: "",
      document_date: null,
      document_name: "",
      state: ReportState.NEW,
      asset_count_location: []
    })
  }

  useEffect(() => {
    setReportForm((prev) => ({
      ...prev,
      document_date: dayjs().toDate(),
    }))
  }, [])

  useEffect(() => {
    const CreateReport = async () => {
      
    }

    CreateReport()
  }, [activeStep])
  return (
    <div className="flex flex-col w-full py-2 pl-2 lg:pl-10 place-items-center space-y-2">
      <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mb: 2 }}>🎉 เสร็จสิ้นขั้นตอนทั้งหมด</Typography>
              <Button onClick={handleReset} variant="outlined">แก้ไขรายงาน</Button>
              <Button variant="outlined" onClick={handleNewRequest}>สร้างรายงานใหม่</Button>
              <Button variant="outlined"
                onClick={() =>
                  push(`/reports/count-assets/${reportForm.document_number}`)}
              >เริ่มทำการตรวจนับ</Button>
              <div>รายชื่อรายการที่ได้ทำการสร้าง</div>
            </>
          ) : (
            <>
              <Typography sx={{ mb: 2 }}>
                👉 ขั้นตอนที่ {activeStep + 1}: {steps[activeStep]}
              </Typography>
              <div className="flex flex-row items-center">
                <CreateReportContext value={
                  { report: reportForm!, setReport: setReportForm }
                }>
                  <Stepper activeStep={activeStep}>
                    <StepComponent
                      step={activeStep}
                      reportForm={reportForm}
                      parentLocation={parentLocation}
                      childrenLocation={childrenLocation}
                      parentProp={parentProp!}
                      childProp={childProp!}
                      disableButton={disableButton}
                      setDisableButton={setDisableButton}
                    />
                  </Stepper>
                </CreateReportContext>
              </div>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  ย้อนกลับ
                </Button>
                <Button onClick={handleNext} variant="contained" disabled={disableButton}>
                  {activeStep === steps.length - 1 ? "ยืนยัน" : "ถัดไป"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </div>
  )
}