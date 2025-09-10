'use client';
import {
  useState,
  ChangeEvent,
  useEffect,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";
import {
  dataPerPage,
  getComparator,
  handleChangePage,
  handleChangeRowsPerPage,
  Order
} from "@/_components/tables/utility";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import {
  MapColor,
  ReportState,
  rowsPerPageOptions,
  startRowsPerPage
} from "@/_constants/constants";
import { locationTableData } from "@/_types/types";
import { tableHeaders } from "@/_constants/mockData";
import { AssetCount } from "@/_types/types";
import { HiddenCellContext, useLocationUrlContext } from "@/_contexts/context";
import { TableSortLabel } from "@mui/material";
import { useWindowSize } from "../loading";
import IconButton from "@mui/material/IconButton";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { maxWindowSize } from "@/_constants/mockData";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FilterReportComponent from "@/reports/_components/filterReportComponent";
import SortReportComponent from "@/reports/_components/sortReportComponent";
import { filterReportBytype } from "@/_libs/assetCount";
import Button from '@mui/material/Button';
import ReportMenuButton, { ConfirmDeletetionDialog } from "@/_components/reportMenuButton";
import CloseIcon from '@mui/icons-material/Close';

function processAction(state: string): { label: string, value: string } {
  switch (state) {
    case ReportState.NEW:
      return { label: "แก้ไข", value: "edit" }
    case ReportState.INPROGRESS:
      return { label: "ตรวจนับ", value: "count" }
    case ReportState.COMPLETED:
      return { label: "เรียกดู", value: "view" }
    case ReportState.CANCEL:
      return { label: "เรียกดู", value: "view" }
  }
  return { label: "", value: "" }
}

function HiddenMenuDialog(props: {
  data: locationTableData,
  isHidden: boolean,
  setIsHidden: Dispatch<SetStateAction<boolean>>,
  reportState: { label: string, value: string }
}) {
  const { data, isHidden, setIsHidden } = props
  const { date, documentNumber, state, name, id } = data;
  const context = useLocationUrlContext()
  return (
    <>
      <Dialog open={isHidden}
        // onClick={() => setIsHidden((prev) => !prev)}
        maxWidth="xl"
        fullWidth={true}
      >
        <DialogContent>
          <div className="flex flex-row justify-end">
            <CloseIcon onClick={() => setIsHidden((prev) => !prev)} />
          </div>
          <Typography>Document no: {documentNumber}</Typography>
          <Typography>Name: {name}</Typography>
          <Typography>Date: {date}</Typography>
          <Typography
            sx={{ color: MapColor[state]![300] }}
          >State: {state}</Typography>
        </DialogContent>
        <DialogActions>
          <ReportMenuButton
            context={context}
            documentNumber={documentNumber}
            id={id}
          />
          {/* <Button variant="text" onClick={() => {
            if (reportState.value == "count") {
              context.selected.current = `/reports/count-assets/${documentNumber}`
              push(`/reports/count-assets/${documentNumber}`)
            } else if (reportState.value == "edit") {
              context.selected.current = ""
              push(`/setup/${documentNumber}`)
            } else if (reportState.value == "view") {
              push(`/reports/${documentNumber}`) 
            }
          }}> <Typography sx={{
            color: MapActionColor[reportState.label]!,
            fontWeight: 700
          }}>
              [{reportState.label}]
            </Typography>
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  )
}

function isCellHiddnen(value: number): boolean {
  return value < maxWindowSize;
}

import DeleteIcon from '@mui/icons-material/Delete';

function CreateLocationTableCell(props: {
  data: locationTableData
}) {
  const { data } = props
  const { date, documentNumber, state, name, id } = data;
  const reportState = processAction(state);
  const windowSize = useWindowSize()
  const [hidden, setHidden] = useState<boolean>(true);
  const [hiddenDelete, setHiddenDelete] = useState<boolean>(true);
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
      <TableCell hidden={isCellHiddnen(windowSize.width!)}>
        {date}
      </TableCell>
      <TableCell hidden={isCellHiddnen(windowSize.width!)}>
        <Typography sx={{
          color: MapColor[state]![700],
          fontWeight: 700, bgcolor: MapColor[state]![300],
        }}>
          {state}
        </Typography>
      </TableCell>
      <TableCell hidden={isCellHiddnen(windowSize.width!)} className="flex flex-row ">
        <ReportMenuButton
          context={context}
          documentNumber={documentNumber}
          id={id}
        />
        <Button color='error' onClick={() => {
          setHiddenDelete((prev) => !prev)
        }}>
          <DeleteIcon />
        </Button>
      </TableCell>
      {
        isCellHiddnen(windowSize.width!) && (
          <TableCell className="justify-items-center">
            <IconButton onClick={() => setHidden((prev) => !prev)}>
              <VisibilityRoundedIcon />
            </IconButton>
          </TableCell>
        )
      }
      <HiddenMenuDialog data={data}
        isHidden={!hidden}
        setIsHidden={setHidden}
        reportState={reportState} />
      <ConfirmDeletetionDialog
        documentName={name}
        isHidden={!hiddenDelete}
        setIsHidden={setHiddenDelete}
        documentNumber={documentNumber}
        id={id}
      />
    </>
  )
}

type TFilter = {
  type: string,
  key: string
}

export default function LocationTable(props: {
  reports: AssetCount[]
}) {
  const { reports } = props
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof AssetCount>('document_number')
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(startRowsPerPage);
  const [filter, setFilter] = useState<TFilter[]>([])
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<AssetCount[]>([])
  const windowSize = useWindowSize()
  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof AssetCount
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property: keyof AssetCount) => (event: MouseEvent<unknown>) => {
    handleRequestSort(event, property)
  }
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reports.length) : 0

  useEffect(() => {
    const filterReport = async () => {
      const tableData = reports
        .sort(getComparator<AssetCount, keyof AssetCount>(order, orderBy)
        )
      let result = tableData
      for (const screen of filter) {
        result = await filterReportBytype(result, screen)
      }
      setFilterData(result)
    }
    filterReport()
  }, [filter, order, orderBy, reports])
  return (
    <>
      <HiddenCellContext
        value={{
          isHidden,
          setIsHidden
        }}
      >
        <div className="flex flex-row justify-end md:pr-2">
          {
            windowSize.width as number < 500 && (
              <SortReportComponent
                order={order}
                orderBy={orderBy}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
              />
            )
          }
          <FilterReportComponent setFilter={setFilter} />
        </div>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {
                tableHeaders.map((header, index) => (
                  <TableCell key={header.label}
                    hidden={index < 2 ? isHidden : isCellHiddnen!(windowSize.width!) ? !isHidden : false}
                    className="bg-blue-300 font-medium justify-items-center"
                  >
                    <TableSortLabel
                      active={orderBy === header.value}
                      direction={orderBy === header.value ? order : 'asc'}
                      onClick={createSortHandler(header.value)}>
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))
              }
              <TableCell hidden={!isCellHiddnen(windowSize.width!)}
                className="items-center bg-blue-300 justify-items-center">
                <ChevronRightRoundedIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflow: 'hidden' }}>
            {
              filterData.length ?
                dataPerPage(filterData, page, rowsPerPage).map((mockData: AssetCount) => {
                  const mapData: locationTableData = {
                    id: mockData.id,
                    date: mockData.document_date.toLocaleDateString('th-BK'),
                    name: mockData.document_name as string,
                    documentNumber: mockData.document_number,
                    state: mockData.state,
                    action: ""
                  }
                  return (
                    <TableRow key={mapData.documentNumber} >
                      <CreateLocationTableCell data={mapData} />
                    </TableRow>
                  )
                })
                :
                <TableRow sx={{
                  height: '9rem',
                  maxHeight: '9rem'
                }}>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={1}>
                    No asset report
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
            }
            {
              emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows
                  }} >
                  <TableCell colSpan={6} />
                </TableRow>
              )
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                labelRowsPerPage={
                  <span
                    className="items-center">
                    {windowSize.width! < 500 ? "" : "row per page"}
                  </span>
                }
                showFirstButton
                showLastButton
                rowsPerPageOptions={rowsPerPageOptions}
                colSpan={8}
                count={filterData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, page) =>
                  handleChangePage(event, page, setPage, filterData.length, rowsPerPage)}
                onRowsPerPageChange={(event) =>
                  handleChangeRowsPerPage(event as ChangeEvent<HTMLInputElement>, setRowsPerPage, setPage)
                }
              />
            </TableRow>
          </TableFooter>
        </Table >
      </HiddenCellContext>
    </>
  )
}