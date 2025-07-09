import { INLOCATION, tableHeaders, tableHeadersAdditional } from "@/_constants/constants";
import { OUTLOCATION, TAssetRow, TAssetTab } from "@/_types/types";
import { JSX } from "@emotion/react/jsx-runtime";
import Checkbox from "@mui/material/Checkbox";
import { blue } from "@mui/material/colors";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow"
import Tabs from "@mui/material/Tabs";
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { handleChangePage, handleChangeRowsPerPage } from "@/_components/tables/utility";

export function createAssetTableCell(
  data: TAssetRow,
  assetTab: TAssetTab,
  action: JSX.Element,
  actionLabel: string,
  isCheckTable: boolean
) {
  const { assetCode, assetName, assignedTo, countCheck, assignIncorrect } = data;
  const tabType = !assignIncorrect ? INLOCATION : OUTLOCATION
  console.log(tabType, assignIncorrect)
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
                  {countCheck}
                  <Checkbox checked={countCheck} disabled={!isCheckTable} />
                </TableCell>
                : <></>
            }
            <TableCell className="place-content-center">
              {assignIncorrect}
              <Checkbox checked={assignIncorrect} disabled={!isCheckTable} />
            </TableCell>
            {
              !assetTab ?
                <TableCell>
                  {action} {actionLabel}
                  {/* <Checkbox disabled={!isCheckTable} />[Del] */}
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
}) {
  const { data, isCheckTable, assetTab } = props
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
            (data).map((mockData: TAssetRow) =>
              <TableRow key={mockData.assetCode}>
                {createAssetTableCell(
                  mockData, assetTab,
                  <Checkbox disabled={!isCheckTable} />,
                  "[Del]", isCheckTable)}
              </TableRow>
            )
            :
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
  setAssetTab: (value: SetStateAction<TAssetTab>) => void
  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  rowsPerPage: number,
  setRowsPerPage: Dispatch<SetStateAction<number>>
  dataLength: number,
}) {
  const {
    data,
    isCheckTable,
    assetTab,
    setAssetTab,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    dataLength
  } = props

  function handleSelectValue(event: SyntheticEvent, newValue: string) {
    setAssetTab(newValue as TAssetTab)
  }

  return (
    <>
      <Tabs
        value={assetTab}
        className="pl-2"
        onChange={handleSelectValue}
      >
        <Tab value={INLOCATION} label="assets in location"></Tab>
        <Tab value={OUTLOCATION} label="additional assets in location"></Tab>
      </Tabs>
      <Table stickyHeader size="small" sx={{
        minWidth: 650,
        border: 'solid',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderWidth: 1,
        borderColor: blue[400]
      }}>
        <ListAsset data={data}
          isCheckTable={isCheckTable}
          assetTab={assetTab} />
        <TableFooter>
          <TableRow>
            <TablePagination
              showFirstButton
              showLastButton
              rowsPerPageOptions={
                [5, 10, 25, { label: 'All', value: -1 }]
              }
              colSpan={4}
              count={dataLength}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, page) =>
                handleChangePage(event, page, setPage)
              }
              onRowsPerPageChange={(event) =>
                handleChangeRowsPerPage(
                  event as ChangeEvent<HTMLInputElement>,
                  setRowsPerPage,
                  setPage)
              }
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}