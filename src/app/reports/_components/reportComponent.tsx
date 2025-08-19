'use client'

import { TLocation } from "../../_types/snipe-it.type"
import { Button } from "@mui/material"
import LocationTable from "@/_components/tables/location-table"
import { useState, useEffect } from "react"
import CreatePlanComponent from "@/reports/_components/planComponent"
import dayjs, { Dayjs } from "dayjs"
import { AssetCount } from "../../_types/types"
import { getAllAssetCount } from "@/_libs/report.utils"
import { DateValueContext } from "@/_contexts/context"

export default function ReportComponent(props: {
  locations: TLocation[],
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  parentProp: TLocation | null,
  childProp: TLocation | null,
  user: any
}) {
  const { locations, parentLocation, childrenLocation, parentProp, childProp, user } = props
  const [show, setShow] = useState(true)
  const [reports, setReports] = useState<AssetCount[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  useEffect(() => {
    if (!dateValue) {
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
            variant="outlined" className={`${show ? "bg-blue-200" : ""}`}
            sx={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0
            }}
          >
            {"ประวัติรายงานตรวจนับ"}
          </Button>
          <Button onClick={() => setShow(false)}
            variant="outlined" className={`${!show ? "bg-blue-200" : ""}`}
            sx={{
              borderTopLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0
            }}
          >
            {"สร้าง รายงานตรวจนับ"}
          </Button>
        </div>
        <div className="flex flex-row">
          {
            show ?
              <div className="flex flex-col w-full">
                <LocationTable
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
                  user={user}
                />
              </DateValueContext>
          }
        </div>
      </div>
    </>
  )
}
