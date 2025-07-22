'use client'

import { TLocation } from "@/_types/snipe-it.type"
import { Button } from "@mui/material"
import LocationTable from "@/_components/tables/location-table"
import { useState, createContext, Dispatch, SetStateAction, useContext, useEffect } from "react"
import CreatePlanComponent from "@/_components/planComponent"
import dayjs, { Dayjs } from "dayjs"
import { AssetCount } from "@/_types/types"
import { getAllAssetCount } from "@/_libs/report.utils"

type TDateValueContext = {
  dateValue: Dayjs;
  setDateValue: Dispatch<SetStateAction<Dayjs | null>>
}

const DateValueContext = createContext<TDateValueContext | null>(null)

export function useDateContext() {
  const context = useContext(DateValueContext)
  if (!context) {
    throw new Error("useDateValueContext must be use within Context provider")
  }
  return context
}

export default function ReportComponent(props: {
  locations: TLocation[],
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  parentProp: TLocation | null,
  childProp: TLocation | null,
}) {
  const { locations, parentLocation, childrenLocation, parentProp, childProp } = props
  const [show, setShow] = useState(true)
  const [reports, setReports] = useState<AssetCount[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  useEffect(() => {
    if (!dateValue) {
      //eslint-disable-next-line react-hooks/exhaustive-deps
      setDateValue(dayjs())
    }
  }, [dateValue])

  useEffect(() => {
    const fetchReports = async () => {
      if (show) {
        const reports = await getAllAssetCount()
        setReports(reports)
      }
    }
    fetchReports()
  }, [show])
  return (
    <>
      <div className="flex flex-col space-x-4">
        <div className="flex flex-row">
          <Button onClick={() => setShow(true)}
            variant="outlined" className={`${show ? "bg-blue-200" : ""}`}>
            {"ประวัติรายงานตรวจนับ"}
          </Button>
          <Button onClick={() => setShow(false)}
            variant="outlined" className={`${!show ? "bg-blue-200" : ""}`}>
            {"สร้าง รายงานตรวจนับ"}
          </Button>
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
                  reports={reports}
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
