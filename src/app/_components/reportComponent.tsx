'use client'

import { TLocation } from "@/_types/snipe-it.type"
import { Button } from "@mui/material"
import LocationTable from "@/_components/tables/location-table"
import { useState } from "react"
import CreatePlanComponent from "@/_components/planComponent"
import { DateValueContext } from "@/_components/tables/new-count-table"
import dayjs, { Dayjs } from "dayjs"

export default function ReportComponent(props: {
    locations: TLocation[],
    parentLocation: TLocation[],
    childrenLocation: TLocation[],
    parentProp: TLocation | null,
    childProp: TLocation | null
}) {
    const { locations, parentLocation, childrenLocation, parentProp, childProp } = props
    const [show, setShow] = useState(true)
    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs())

    return (
        <>
            <div className="flex flex-col space-x-4">
                <div className="flex flex-row">
                    <Button onClick={() => setShow(true)} variant="outlined" className={`${show ? "bg-blue-200" : ""}`}>{"ประวัติรายงานตรวจนับ"}</Button>
                    <Button onClick={() => setShow(false)} variant="outlined" className={`${!show ? "bg-blue-200" : ""}`}>{"สร้าง รายงานตรวจนับ"}</Button>
                </div>
                <div className="flex flex-row">
                    {
                        show ?
                            <div className="flex flex-col w-full">
                                <LocationTable
                                    parentLocation={parentLocation}
                                    childrenLocation={childrenLocation}
                                    parentProp={parentProp!}
                                    childProp={childProp!}
                                />
                            </div>
                            : <DateValueContext
                                value={{
                                    dateValue: dateValue!,
                                    setDateValue: setDateValue
                                }}>
                                <CreatePlanComponent
                                    location={locations}
                                    parentLocation={parentLocation}
                                    childrenLocation={childrenLocation}
                                    parentProp={parentProp!}
                                    childProp={childProp!}
                                />
                            </DateValueContext>
                    }
                </div>
            </div>
        </>
    )
}
