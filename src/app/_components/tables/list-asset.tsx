import {
  AssetStatusEnum,
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
  const [assetStatus, setAssetStatus] = useState(assetStatusOptions.find((option) => option.id == status)?.id == AssetStatusEnum.MALFUNCTIONING)
  const tabType = !assignIncorrect ? INLOCATION : OUTLOCATION
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
    const updateIncorrectLocation = async () => {
      data.assignIncorrect = incorrect
      await UpdateAssetCountLine(data.id as string, {
        is_not_asset_loc: incorrect,
      })
    }
    
    updateIncorrectLocation()
  }, [incorrect])
  
  useEffect(() => {
    const updateAssetStatus = async() => {
      data.status = assetStatus ? AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
      await UpdateAssetCountLine(data.id as string, {
        asset_count_line_status_id: assetStatus ? AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
      })
    }
    updateAssetStatus()
  }, [assetStatus])
  
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
              <Checkbox 
                checked={assetStatus}
                onChange={() => setAssetStatus(pre => !pre)}
                disabled={!isCheckTable}
              >
                {/* {
                  assetStatusOptions.map((choice) =>
                      <MenuItem value={choice.value} key={choice.label}>
                        {choice.label}
                      </MenuItem>
                  )
                } */}
              </Checkbox>
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