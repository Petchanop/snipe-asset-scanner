'use client'

import Button from "@mui/material/Button"
import { DateLocationForm } from "./createPlanFormComponent"
import { TLocation } from "@/_types/snipe-it.type"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useDateContext } from "@/_components/tables/new-count-table";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChildrenSelectComponent, ParentSelectComponent } from "./tables/location-table";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"

const steps = ["เลือกวันที่", "เพิ่มสถานที่", "ยืนยัน"];

export function ObjectList(props: {
    items: Exclude<TLocation[], undefined>,
    setItems: Dispatch<SetStateAction<Exclude<TLocation[], undefined>>>
}) {
    const { items, setItems } = props
    const handleDelete = (id: number) => {
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
                <Typography color="text.secondary" align="center" sx={{ mt: 2 , mb: 4}}>
                    ไม่มีรายการในขณะนี้
                </Typography>
            )}
        </Box>
    );
}


function StepComponent(props: {
    step: number,
    parentLocation: TLocation[],
    childrenLocation: TLocation[],
    parentProp: TLocation | null,
    childProp: TLocation | null
}) {
    const { step, parentLocation, childrenLocation, parentProp, childProp } = props
    const [parent, setParent] = useState(parentProp)
    const [childId, setChildId] = useState<number | null>()
    const [ selected, setSelected ] = useState(false)
    const [documentLocation, setDocumentLocation] = useState<TLocation[]>([])
    const dateContext = useDateContext()
    const handleDateOnChange = (value: SetStateAction<dayjs.Dayjs | null>) => {
        if (value) {
            dateContext.setDateValue(value)
        }
    }

    useEffect(() => {
        console.log(documentLocation.find((loc) => loc.id == childId) == null)
        if (selected && childId && documentLocation.find((loc) => loc.id == childId) == null) {
            let location = childrenLocation.find((loc) => loc.id == childId) as TLocation
            if (!location) {
                location = parentLocation.find((loc) => loc.id == childId) as TLocation
            }
            setDocumentLocation([...documentLocation, location])
        }
        setSelected(false)
    }, [selected, childId])
    switch (step) {
        case 0:
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
        case 1:
            return (
                <>
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <ParentSelectComponent
                                parentLocation={parentLocation}
                                parentProp={parent!}
                                setParent={setParent} />
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
                        <div className="flex flex-row">
                            <ObjectList 
                                items={documentLocation}
                                setItems={setDocumentLocation}
                            />
                        </div>
                    </div>
                </>
            )
        case 2:
            return (
                <>
                    {"Document"}
                </>
            )
    }
}


export default function CreatePlanComponent(props: {
    location: TLocation[],
    parentLocation: TLocation[],
    childrenLocation: TLocation[],
    parentProp: TLocation | null,
    childProp: TLocation | null
}) {
    const { location, parentLocation, childrenLocation, parentProp, childProp } = props
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (activeStep < steps.length) setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prev) => prev - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
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
                            <Button variant="outlined">สร้างรายงานใหม่</Button>
                            <Button
                                variant="outlined">เริ่มทำการตรวจนับ</Button>
                            <div>รายชื่อรายการที่ได้ทำการสร้าง</div>
                        </>
                    ) : (
                        <>
                            <Typography sx={{ mb: 2 }}>
                                👉 ขั้นตอนที่ {activeStep + 1}: {steps[activeStep]}
                            </Typography>
                            <div className="flex flex-row items-center">
                                <Stepper activeStep={activeStep}>
                                    <StepComponent
                                        step={activeStep}
                                        parentLocation={parentLocation}
                                        childrenLocation={childrenLocation}
                                        parentProp={parentProp!}
                                        childProp={childProp!}
                                    />
                                </Stepper>
                            </div>

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    ย้อนกลับ
                                </Button>
                                <Button onClick={handleNext} variant="contained">
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