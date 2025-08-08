import {
  AssetStatusEnum,
  INLOCATION,
  assetStatusOptions,
  tableHeaders,
  tableHeadersAdditional
} from "@/_constants/constants";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  MouseEvent,
} from "react";
import {
  dataPerPage,
  getComparator,
  handleChangePage,
  handleChangeRowsPerPage,
  Order
} from "@/_components/tables/utility";
import { OUTLOCATION, TAssetRow, TAssetTab } from "@/_types/types";
import { JSX } from "@emotion/react/jsx-runtime";
import Checkbox from "@mui/material/Checkbox";
import { blue } from "@mui/material/colors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow"
import { UpdateAssetCountLine } from "@/_libs/report.utils";
import TableSortLabel from "@mui/material/TableSortLabel";
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useReportContext } from "@/_components/tableLayout";
import ImageComponent from "@/_components/ImageComponent";
import { decode } from 'html-entities'
import { TextareaAutosize } from "@mui/material";

export function CreateAssetTableCell(
  props: {
    data: TAssetRow,
    assetTab: TAssetTab,
    action: JSX.Element,
    actionLabel: string,
    isCheckTable: boolean
  }) {
  const { data, assetTab, actionLabel, action, isCheckTable } = props
  const { assetCode, assetName, assignedTo, countCheck, assignIncorrect, notInLocation, status, image, remarks } = data;
  const [count, setCount] = useState(countCheck)
  const [incorrect, setIncorrect] = useState(assignIncorrect)
  const [wrongLocation, setWrongLocation] = useState(notInLocation)
  const [open, setOpen] = useState(false)
  const [remarkAsset, setRemarkAsset] = useState(remarks)
  const [assetStatus, setAssetStatus] = useState(assetStatusOptions.find((option) => option.id == status)?.id == AssetStatusEnum.MALFUNCTIONING)
  const tabType = !notInLocation ? INLOCATION : OUTLOCATION
  const reportContext = useReportContext()
  useEffect(() => {
    const updateData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      data.countCheck = count,
        await UpdateAssetCountLine(data.id as string, {
          asset_check: data.countCheck,
        })
    }

    updateData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  useEffect(() => {
    const updateAssignNotCorrect = async () => {
      data.assignIncorrect = incorrect
      await UpdateAssetCountLine(data.id as string, {
        is_assigned_incorrectly: incorrect,
      })
    }

    updateAssignNotCorrect()
  }, [incorrect, data])

  useEffect(() => {
    const updateIncorrectLocation = async () => {
      data.notInLocation = wrongLocation
      await UpdateAssetCountLine(data.id as string, {
        is_not_asset_loc: wrongLocation,
      })
    }

    updateIncorrectLocation()
  }, [wrongLocation, data])

  useEffect(() => {
    const updateAssetStatus = async () => {
      data.status = assetStatus ? AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
      await UpdateAssetCountLine(data.id as string, {
        asset_count_line_status_id: assetStatus ? AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
      })
    }
    updateAssetStatus()
  }, [assetStatus, data])

  useEffect(() => {
    const updateRemark = async () => {
      if (reportContext.update) {
        await UpdateAssetCountLine(data.id as string, { remarks: remarkAsset })
      }
    }
    updateRemark()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportContext.update, data.id])
  return (
    <>
      {
        tabType == assetTab ?
          <>
            <TableCell>
              {assetCode}
            </TableCell>
            <TableCell>
              <Button variant="text" onClick={() => setOpen((prev) => !prev)}>
                {decode(assetName)}
              </Button>
              <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClick={() => setOpen((prev) => !prev)}
              >
                <DialogTitle id="alert-dialog-title">
                  {decode(assetName)}
                </DialogTitle>
                <DialogContent>
                  {
                    image ?
                      <ImageComponent
                        src={image}
                        alt={assetName as string}
                        width={400}
                        height={400}
                      /> : "No image display"
                  }
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>
              {assignedTo.first_name} {assignedTo.last_name}
            </TableCell>
            {
              assetTab ?
                <TableCell className="" align="center" padding="checkbox">
                  <Checkbox checked={count}
                    disabled={!isCheckTable}
                    onChange={() => setCount(pre => !pre)} />
                </TableCell>
                : <></>
            }
            <TableCell className="" align="center" padding="checkbox">
              <Checkbox
                checked={incorrect}
                disabled={!isCheckTable}
                onChange={() => setIncorrect(pre => !pre)} />
            </TableCell>
            <TableCell className="" align="center" padding="checkbox">
              <Checkbox
                checked={wrongLocation}
                disabled={!isCheckTable}
                onChange={() => setWrongLocation(pre => !pre)} />
            </TableCell>
            {
              !assetTab ?
                <TableCell>
                  {action} {actionLabel}
                </TableCell>
                : <></>
            }
            <TableCell align="center" padding="checkbox">
              <Checkbox
                checked={assetStatus}
                onChange={() => setAssetStatus(pre => !pre)}
                disabled={!isCheckTable}
              >
              </Checkbox>
            </TableCell>
            {
              tabType == OUTLOCATION ?
                <TableCell align="center">
                  <TextareaAutosize
                    id="remark"
                    onChange={(event) => setRemarkAsset(event.target.value)}
                    value={remarkAsset}
                  />
                </TableCell>
                : <></>
            }
          </>
          : <></>
      }
    </>
  )
}

export default function ListAsset(props: {
  data: TAssetRow[], isCheckTable: boolean, assetTab: TAssetTab
  page: number, rowsPerPage: number
}) {
  const { data, isCheckTable, assetTab, page, rowsPerPage } = props
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof TAssetRow>('assetCode')
  const headers = assetTab == INLOCATION ? tableHeaders : tableHeadersAdditional

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof TAssetRow
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property: keyof TAssetRow) => (event: MouseEvent<unknown>) => {
    handleRequestSort(event, property)
  }

  const tableData = useMemo(() => data
    .sort(getComparator<TAssetRow, keyof TAssetRow>(order, orderBy)),
    [order, orderBy, data]
  )
  return (
    <>
      <TableHead>
        <TableRow className="place-content-center">
          {headers.map((header) => (
            <TableCell key={header.label}
              className="bg-blue-300 font-medium"
            >
              <TableSortLabel
                active={orderBy === header.value}
                direction={orderBy === header.value ? order : 'asc'}
                onClick={createSortHandler(header.value)}>
                {header.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody sx={{ overflow: 'hidden' }} className="place-content-center">
        {
          tableData.length ?
            dataPerPage(tableData, page, rowsPerPage).map((mockData: TAssetRow) =>
              <TableRow key={mockData.assetCode} className="divide-x-1 divide-solid divide-gray-300">
                <CreateAssetTableCell
                  data={mockData}
                  assetTab={assetTab}
                  action={<Checkbox disabled={!isCheckTable} />}
                  actionLabel={"[Del]"}
                  isCheckTable={isCheckTable}
                />
              </TableRow>
            ) :
            <TableRow sx={{
              height: '9rem',
              maxHeight: '9rem'
            }}>
              <TableCell colSpan={2} />
              <TableCell
                className="justify-center"
                colSpan={3}
                rowSpan={8}>
                No asset report
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
        }
      </TableBody>
    </>
  )
}

export function AssetTable(props: {
  data: TAssetRow[],
  isCheckTable: boolean,
  assetTab: TAssetTab,
  setAssetTab: (value: SetStateAction<TAssetTab>) => void,
  tabValue?: TAssetTab
}) {
  const {
    data,
    isCheckTable,
    assetTab,
    tabValue
  } = props
  const [tablePage, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  return (
    <>
      <Table stickyHeader size="small" sx={{
        minWidth: 650,
        border: 'solid',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderWidth: 1,
        borderColor: blue[400],
      }}
        className={tabValue == assetTab ? "" : "hidden"}
      >
        <ListAsset data={data}
          isCheckTable={isCheckTable}
          assetTab={assetTab}
          page={tablePage}
          rowsPerPage={rowsPerPage}
        />
        <TableFooter>
          <TableRow>
            <TablePagination
              showFirstButton
              showLastButton
              rowsPerPageOptions={
                [5, 10, 25]
              }
              colSpan={5}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={tablePage}
              onPageChange={(event, page) => {
                handleChangePage(event, page, setPage, data.length, rowsPerPage)
              }}
              onRowsPerPageChange={(event) => {
                handleChangeRowsPerPage(
                  event as ChangeEvent<HTMLInputElement>,
                  setRowsPerPage,
                  setPage)
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}