'use client'
import { useState, ChangeEvent, useEffect, useMemo } from "react";
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
import { dataPerPage, handleChangePage, handleChangeRowsPerPage } from "@/_components/tables/utility";
import { MapActionColor, MapColor, ReportState } from "@/_constants/constants";
import { locationTableData } from "@/_types/types";
import { tableHeaders } from "@/_constants/mockData";
import { TLocation } from "@/_types/snipe-it.type";
import { getReportFromParentLocation } from "@/_apis/report.api";
import { AssetCount, Location } from "@/_types/types";
import { useLocationUrlContext } from "@/_components/tableLayout";

function CreateLocationTableCell(props : {
  data: locationTableData
}) {
  const { data } = props
  const { date, documentNumber, location, state } = data;

  function processAction(state: string): string {
    switch (state) {
      case ReportState.NEW || ReportState.INPROGRESS:
        return "OPEN"
      case ReportState.CANCEL || ReportState.COMPLETED:
        return "VIEW"
    }
    return ""
  }
  return (
    <>
      <TableCell>
        {date}
      </TableCell>
      <TableCell>
        {documentNumber}
      </TableCell>
      <TableCell>
        {location}
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
        <Button variant="text">
          <Typography sx={{ color: MapActionColor[processAction(state)]![500] }}>
            [{processAction(state)}]
          </Typography>
        </Button>
      </TableCell>
    </>
  )
}

function ChildrenSelectComponent(props: {
  parent: TLocation,
  locationByParent: TLocation[],
  childId: number,
  setChildId: (value: number) => void
}) {
  const { parent, locationByParent, childId, setChildId } = props
  const [childLocation, setChildLocation] = useState("")
  const [childrenLocation, setChildrenLocation] = useState<TLocation[]>([])
  const context = useLocationUrlContext()

  const handleOnClick = (target: EventTarget & (HTMLInputElement | HTMLTextAreaElement)) => {
    const locationByName = childrenLocation.filter((loc) => loc.name == target.value)[0] as unknown as Location
    setChildId(locationByName.id)
    setChildLocation(target.value)
    context.selected.current = `/reports?location=${locationByName.id}`
    context.setLocationId(locationByName.id)
  }

  const childrenLocationChange = useMemo(() => {
    return locationByParent.filter((loc) =>
      // @ts-expect-error cause it not wrong type the object has => id in parent properties
      loc.parent.id === parent.id
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
      context.selected.current = `/reports?location=${locationId}`
      setChildId(locationId)
      setChildLocation(defaultValue?.name! as string)
    }
    setChildrenLocation(childrenLocationChange)
    setDefaultValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenLocationChange])

  return (
    <>
      {
        childLocation ?
          <TextField
            select
            label="sub location"
            name={parent.name}
            value={childLocation}
            className="mt-3 p-4"
            onChange={(event) => handleOnClick(event.target)}
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

function ParentSelectComponent(props: {
  parentLocation: TLocation[],
  parentProp: TLocation,
  setParent: (location: TLocation) => void,
}) {
  const { parentLocation, parentProp, setParent } = props
  return (
    <TextField
      select
      label="location"
      value={parentProp.name}
      className="mt-3 p-4"
      onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newParent = parentLocation.find((loc) => loc.name == event.target.value);
        setParent(newParent!)
      }}>
      {
        parentLocation.map((loc) =>
          <MenuItem value={loc.name} key={loc.id}>{loc.name}</MenuItem>
        )
      }
    </TextField>
  )
}

export default function LocationTable(props: {
  parentLocation: TLocation[],
  childrenLocation: TLocation[],
  parentProp: TLocation | null,
  childProp: TLocation | null
}) {
  const { parentLocation, childrenLocation, parentProp, childProp } = props
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [parent, setParent] = useState(parentProp)
  const [report, setReport] = useState([] as AssetCount[])
  const [childId, setChildId] = useState<number | null>(childProp?.id!)
  useEffect(() => {
    const filterReportByChildId = () => {
      if (childId) {
        setReport(report.filter((report) => report.location_id == childId))
      }
    }

    filterReportByChildId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId, parent])

  useEffect(() => {
    const fetchReportByParent = async () => {
      const parentId = parentLocation.find((loc) => loc.name === (parent as TLocation).name) as TLocation
      const newReport = await getReportFromParentLocation(parentId.id!)
      setReport(newReport)
    }
    fetchReportByParent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent])
  return (
    <>
      <ParentSelectComponent parentLocation={parentLocation} parentProp={parent!} setParent={setParent} />
      <ChildrenSelectComponent parent={parent!} locationByParent={childrenLocation} childId={childId!} setChildId={setChildId} />
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
            (dataPerPage(report, page, rowsPerPage)).map((mockData: AssetCount) => {
              let locationName = parentLocation.find((loc) => 
                loc.id == mockData.location_id
              ) 
              if (!locationName) 
                  locationName = childrenLocation.find((loc) => loc.id == mockData.location_id)
              const mapData :locationTableData = {
                date: mockData.document_date.toDateString(),
                documentNumber: mockData.document_number,
                location: (locationName as TLocation)!.name!,
                state: mockData.state,
                action: ""
              }
              return (
                <TableRow key={mapData.documentNumber} >
                  <CreateLocationTableCell data={mapData} />
                </TableRow>
              )
            })
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              showFirstButton
              showLastButton
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
              count={report.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, page) => handleChangePage(event, page, setPage)}
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