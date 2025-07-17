import {
  INLOCATION,
  assetStatusOptions,
  tableHeaders,
  tableHeadersAdditional
} from "@/_constants/constants";
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
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import {
  dataPerPage,
  handleChangePage,
  handleChangeRowsPerPage
} from "@/_components/tables/utility";
import { UpdateAssetCountLine } from "@/_libs/report.utils";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";


export function CreateAssetTableCell(
  props: {
    data: TAssetRow,
    assetTab: TAssetTab,
    action: JSX.Element,
    actionLabel: string,
    isCheckTable: boolean
  }) {
  const { data, assetTab, actionLabel, action, isCheckTable } = props
  const { assetCode, assetName, assignedTo, countCheck, assignIncorrect, status } = data;
  const [count, setCount] = useState(countCheck)
  const [incorrect, setIncorrect] = useState(assignIncorrect)
  const [assetStatus, setAssetStatus] = useState(assetStatusOptions.find((option) => option.id == status)?.value)
  const tabType = !assignIncorrect ? INLOCATION : OUTLOCATION

  useEffect(() => {
    const updateData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      data.countCheck = count,
      data.assignIncorrect = incorrect
      const id = assetStatusOptions.find((status) => status.value == assetStatus)?.id as number
      await UpdateAssetCountLine(data.id as string, {
        asset_check: data.countCheck,
        is_not_asset_loc: data.assignIncorrect,
        asset_count_line_status_id: id
      })
    }

    updateData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, incorrect, assetStatus])

  return (
    <>
      {
        tabType == assetTab ?
          <>
            <TableCell>
              {assetCode}
            </TableCell>
            <TableCell>
              {assetName}
            </TableCell>
            <TableCell>
              {assignedTo.first_name} {assignedTo.last_name}
            </TableCell>
            {
              assetTab ?
                <TableCell>
                  <Checkbox checked={count}
                    disabled={!isCheckTable}
                    onChange={() => setCount(pre => !pre)} />
                </TableCell>
                : <></>
            }
            <TableCell className="place-content-center">
              <Checkbox
                checked={incorrect}
                disabled={!isCheckTable}
                onChange={() => setIncorrect(pre => !pre)} />
            </TableCell>
            {
              !assetTab ?
                <TableCell>
                  {action} {actionLabel}
                </TableCell>
                : <></>
            }
            <TableCell>
              <Select value={assetStatus}
                onChange={(event) => setAssetStatus(event.target.value)}
                disabled={!isCheckTable}
              >
                {
                  assetStatusOptions.map((choice) =>
                      <MenuItem value={choice.value} key={choice.label}>
                        {choice.label}
                      </MenuItem>
                  )
                }
              </Select>
            </TableCell>
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
  const headers = assetTab ? tableHeaders : tableHeadersAdditional
  return (
    <>
      <TableHead>
        <TableRow className="place-content-center">
          {headers.map((header) => (
            <TableCell key={header.label}>
              {header.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody sx={{ overflow: 'hidden' }} className="place-content-center">
        {
          data.length ?
            dataPerPage(data, page, rowsPerPage).map((mockData: TAssetRow) =>
              <TableRow key={mockData.assetCode}>
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
              height: '8rem',
              maxHeight: '8rem'
            }}>
              <TableCell colSpan={2} />
              <TableCell colSpan={2} rowSpan={4}>
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
        borderColor: blue[400]
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
                [5, 10, 25, { label: 'All', value: -1 }]
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