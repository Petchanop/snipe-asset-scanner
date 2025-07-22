'use client';
import { useState, ChangeEvent, useEffect, useMemo, useRef } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { handleChangePage, handleChangeRowsPerPage } from "@/_components/tables/utility";
import { MapActionColor, MapColor, ReportState } from "@/_constants/constants";
import { locationTableData } from "@/_types/types";
import { tableHeaders } from "@/_constants/mockData";
import { TLocation } from "@/_types/snipe-it.type";
import { AssetCount, Location } from "@/_types/types";
import { useLocationUrlContext } from "@/_components/tableLayout";
import { useRouter } from "next/navigation";

function CreateLocationTableCell(props: {
  data: locationTableData
}) {
  const { data } = props
  const { date, documentNumber, state, name } = data;
  const { push } = useRouter()
  const reportState = processAction(state);

  function processAction(state: string):{ label:string, value: string} {
    switch (state) {
      case ReportState.NEW:
        return { label: "แก้ไข", value: "edit" }
      case ReportState.INPROGRESS:
        return{ label: "ตรวจนับ", value: "count" }
      case ReportState.COMPLETED:
        return { label: "เรียกดู", value: "view" }
      case ReportState.CANCEL:
        return { label: "เรียกดู", value: "view" }
    }
    return { label : "", value : "" }
  }
  const context = useLocationUrlContext()
  //change location to document name
  return (
    <>
      <TableCell>
        {documentNumber}
      </TableCell>
      <TableCell>
        {name}
      </TableCell>
      <TableCell>
        {date}
      </TableCell>
      <TableCell>
        <Typography sx={{
          color: MapColor[state]![700],
          fontWeight: 700, bgcolor: MapColor[state]![300],
        }}>
          {state}
        </Typography>
      </TableCell>
      <TableCell>
        <Button variant="text" onClick={() => {
          if (reportState.value == "count") {
            context.selected.current = `/reports/count-assets/${documentNumber}`
            push(`/reports/count-assets/${documentNumber}`)
          } else if (reportState.value == "edit") {
            context.selected.current = ""
            push(`/setup/${documentNumber}`)
          }
        }}>
          <Typography sx={{ color: MapActionColor[reportState.label]![500] }}>
            [{reportState.label}]
          </Typography>
        </Button>
      </TableCell>
    </>
  )
}

export function ChildrenSelectComponent(props: {
  parent: TLocation,
  locationByParent: TLocation[],
  childId: number,
  isCheckTable?: boolean,
  setChildId: (value: number) => void
}) {
  const { parent, locationByParent, childId, setChildId, isCheckTable } = props
  // const [childLocation, setChildLocation] = useState("")
  const childLocation = useRef("")
  const [childrenLocation, setChildrenLocation] = useState<TLocation[]>([])
  const context = useLocationUrlContext()
  const handleOnClick = (target: EventTarget & (HTMLInputElement | HTMLTextAreaElement)) => {
    const locationByName = childrenLocation.filter((loc) => loc.name == target.value)[0] as unknown as Location
    setChildId(locationByName.id)
    // setChildLocation(target.value)
    childLocation.current = target.value
    // context.selected.current = `${pathname}?location=${locationByName.id}`
    context.setLocationId(locationByName.id)
  }

  const childrenLocationChange = useMemo(() => {
    return locationByParent.filter((loc) =>
      //@ts-expect-error
      loc.parent_id === parent.id || loc.parent.id == parent.id
    )
  }, [parent, locationByParent])
  // locationByParent

  useEffect(() => {
    const setDefaultValue = () => {
      let defaultValue = childrenLocationChange.find((loc) => loc.id == childId)
      let locationId = childId as unknown as number
      if (!defaultValue) {
        defaultValue = childrenLocationChange[0]
        locationId = childrenLocationChange[0]?.id!
      }
      if (!locationId)
        locationId = parent.id as unknown as number
      context.setLocationId(locationId)
      // context.selected.current = `${pathname}?location=${locationId}`
      setChildId(locationId)
      // setChildLocation(defaultValue?.name! as string)
      childLocation.current = defaultValue?.name! as string
    }
    setChildrenLocation(childrenLocationChange)
    setDefaultValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenLocationChange])

  return (
    <>
      {
        childrenLocation.length ?
          <TextField
            select
            label="sub location"
            name={parent.name}
            value={childLocation.current}
            className="mt-3 p-4"
            onChange={(event) => handleOnClick(event.target)}
            disabled={isCheckTable}
          >
            {
              childrenLocation.map((loc) =>
                <MenuItem value={loc.name as unknown as string} key={loc.id}>
                  <div dangerouslySetInnerHTML={{ __html: loc.name! }} data-key={loc.id} data-name={loc.name}></div>
                </MenuItem>
              )
            }
          </TextField>
          : <></>
      }
    </>
  )
}

export function ParentSelectComponent(props: {
  parentLocation: TLocation[],
  parentProp: TLocation,
  isCheckTable?: boolean,
  setParent: (location: TLocation) => void,
}) {
  const { parentLocation, parentProp, setParent, isCheckTable } = props
  return (
    <TextField
      select
      label="location"
      value={parentProp.name}
      className="mt-3 p-4"
      disabled={isCheckTable}
      onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newParent = parentLocation.find((loc) => loc.name == event.target.value);
        setParent(newParent!)
      }}>
      {
        parentLocation ?
          parentLocation.map((loc) =>
            <MenuItem value={loc.name} key={loc.id}>{loc.name}</MenuItem>
          )
          : <></>
      }
    </TextField>
  )
}

export default function LocationTable(props: {
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  parentProp: TLocation | null,
  childProp: TLocation | null
  reports: AssetCount[]
}) {
  const { parentLocation, childrenLocation, parentProp, childProp, reports } = props
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  useEffect(() => {
    // const filterReportByChildId = () => {
    //   if (childId) {
    //     setReport(report.filter((report) => report.location_id == childId))
    //   }
    // }

    // filterReportByChildId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childProp?.id, parentProp])

  useEffect(() => {
    // const fetchReportByParent = async () => {
    //   const parentId = parentLocation.find((loc) => loc.name === (parent as TLocation).name) as TLocation
    //   let newReport = await getReportFromParentLocation(parentId.id!)
    //   if (newReport.length == 0) {
    //     if (typeof childId !== 'undefined')
    //       newReport = await getReportFromChildLocation(childId!)
    //   }
    //   console.log("report", newReport, childId)
    //   setReport(newReport.sort((a, b) => a.document_number - b.document_number));

    // }
    // fetchReportByParent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentProp, childProp?.id])
  return (
    <>
      {/* <ParentSelectComponent parentLocation={parentLocation} parentProp={parent!} setParent={setParent} />
      <ChildrenSelectComponent parent={parent!} locationByParent={childrenLocation} childId={childId!} setChildId={setChildId} /> */}
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableCell key={header.label}>
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflow: 'hidden' }}>
          {
            reports.length ?
              reports.map((mockData: AssetCount) => {
                let locationName = parentLocation.find((loc) =>
                  loc.id == mockData.location_id
                )
                if (!locationName)
                  locationName = childrenLocation.find((loc) => loc.id == childProp?.id || loc.id == parentProp?.id)
                const mapData: locationTableData = {
                  date: mockData.document_date.toLocaleDateString('th-BK'),
                  name: mockData.document_name as string,
                  documentNumber: mockData.document_number,
                  location: (locationName as TLocation)?.name!,
                  state: mockData.state,
                  action: ""
                }
                return (
                  <TableRow key={mapData.documentNumber} >
                    <CreateLocationTableCell data={mapData} />
                  </TableRow>
                )
              })
              : <TableRow sx={{
                height: '9rem',
                maxHeight: '9rem'
              }}>
                <TableCell colSpan={3} />
                <TableCell colSpan={2} rowSpan={5}>
                  No asset report
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              showFirstButton
              showLastButton
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={8}
              count={reports.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, page) => handleChangePage(event, page, setPage, reports.length, rowsPerPage)}
              onRowsPerPageChange={(event) =>
                handleChangeRowsPerPage(event as ChangeEvent<HTMLInputElement>, setRowsPerPage, setPage)
              }
            />
          </TableRow>
        </TableFooter>
      </Table >
    </>
  )
}