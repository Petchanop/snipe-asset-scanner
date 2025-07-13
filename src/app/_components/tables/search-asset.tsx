'use client'
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import { tableHeadersAdditional } from "@/_constants/constants";
import { ChangeEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import { blue } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { AssetResponse, fetchSearchAsset } from "@/_apis/snipe-it/snipe-it.api";
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { AssetCount, AssetCountLine } from "@/_types/types";
import ScannerComponent from "@/_components/scanner";
import Typography from "@mui/material/Typography";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { AddAssetCountLine, DeleteAssetCountLine } from "@/_apis/report.api";
import dayjs from "dayjs";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { dataPerPage, handleChangePage, handleChangeRowsPerPage } from "./utility";

export type ExtendAssetResponse = AssetResponse & {
  asset_name_not_correct: boolean;
  is_not_asset_loc: boolean;
  asset_check: boolean;
  in_report: boolean;
}

function CreateSearchAssetTableCell(props: {
  data: ExtendAssetResponse,
  actionLabel: string,
  assetCountReport: AssetCount
}) {
  const { data, actionLabel, assetCountReport } = props
  const [checked, setChecked] = useState(data.is_not_asset_loc)
  const [disabled, setDisabled] = useState(data.in_report)
  return (
    <>
      <TableCell>
        {data.asset_tag}
      </TableCell>
      <TableCell>
        {data.name}
      </TableCell>
      <TableCell>
        {data.assigned_to?.first_name} {data.assigned_to?.last_name}
      </TableCell>
      <TableCell className="relative place-content-center justify-center items-center justify-content-center">
        <Checkbox checked={checked} onChange={() => {
          setChecked((pre) => !pre)
        }} />
      </TableCell>
      <TableCell className="p-0">
        <Button
          onClick={() => {
            if (!disabled) {
              const newData = data
              newData.is_not_asset_loc = checked
              AddAssetCountLine(newData, assetCountReport).then((result) => console.log(result))
              setDisabled(true)
            } else {
              DeleteAssetCountLine(assetCountReport.id!, data.asset_tag!)
              setDisabled(false)
            }
          }}
          className={`${disabled ? "text-red-500 " : ""}`}
        >
          {!disabled ? actionLabel : "Remove"}
        </Button>
      </TableCell>
    </>
  )
}

function SearchAssetTable(props: {
  data: AssetResponse[],
  isCheckTable: boolean,
  assetTab: boolean,
  assetCountReport: AssetCount,
  assetInReport: AssetCountLine[]
}) {
  const { data, assetCountReport, assetInReport } = props
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const headers = tableHeadersAdditional
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
            dataPerPage(data, page, rowsPerPage).map((asset: AssetResponse) => {
              const extendTypeAsset: ExtendAssetResponse = {
                ...asset,
                asset_name_not_correct: false,
                is_not_asset_loc: asset.location?.id != assetCountReport.location_id,
                asset_check: false,
                in_report: assetInReport.find((report) => report.asset_code === asset.asset_tag) ? true : false,
              }
              return (
                <TableRow key={`${asset.asset_tag}${dayjs().get('second')}`} >
                  <CreateSearchAssetTableCell data={extendTypeAsset} actionLabel={"Add"} assetCountReport={assetCountReport} />
                </TableRow>
              )
            }
            )
            : <></>
        }
      </TableBody >
      <TableFooter>
        <TableRow>
          <TablePagination
            showFirstButton
            showLastButton
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={4}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, page) => handleChangePage(event, page, setPage)}
            onRowsPerPageChange={(event) =>
              handleChangeRowsPerPage(event as ChangeEvent<HTMLInputElement>, setRowsPerPage, setPage)
            }
          />
        </TableRow>
      </TableFooter>
    </>
  )
}

export default function SearchAsset(
  props: {
    assetCountReport: AssetCount
    assetInlocation: AssetResponse[]
    assetInReport: AssetCountLine[]
  }
) {
  const { assetCountReport, assetInlocation, assetInReport } = props
  const [searchInput, setSearchInput] = useState<string>("")
  const [scanData, setScanData] = useState<IDetectedBarcode[]>()
  const [fetchData, setFetchData] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<AssetResponse[]>(assetInlocation)
  const [show, setShow] = useState(false)

  async function callFetchAssetSearch() {
    if (searchInput && fetchData) {
      const { data, error } = await fetchSearchAsset(searchInput);
      if (error) {
        toast(`${searchInput} not found.`)
      } else {
        setSearchResult([...searchResult, data])
        setSearchInput("")
      }
    }
    setFetchData(false)
  }

  useEffect(() => {
    callFetchAssetSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData])

  useEffect(() => {
    const fetchAssetFromScanData = async () => {
      scanData?.map(async (result) => {
        const { data, error } = await fetchSearchAsset(encodeURIComponent(result.rawValue));
        if (error) {
          toast(`${result.rawValue} not found.`)
        } else {
          setSearchResult([...searchResult, data])
        }
      })
    }
    fetchAssetFromScanData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanData])

  return (
    <>
      <Toaster
        containerStyle={{
          position: 'relative'
        }}
        toastOptions={{
          duration: 1000,
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? 'custom-enter 1s ease-in-out'
                : 'custom-exit 1s ease-in',
            }}
          />
        )}
      </Toaster>
      <div className="space-y-2">
        <div className="flex flex-row w-full py-2 pl-2 lg:pl-10 space-x-2 content-center">
          <TextField
            id="search-asset"
            label="Search asset"
            variant="outlined"
            size="small"
            className="w-1/2"
            onChange={(event) => setSearchInput(event.target.value)}
            disabled={show}
            value={searchInput}
          />
          <Button onClick={() => setFetchData(true)}>Search</Button>
          <Typography className="content-center">OR</Typography>
          <Button onClick={() => setShow((pre) => !pre)}>Scan</Button>

        </div>
        {
          show ?
            <ScannerComponent
              scanData={scanData!}
              setScanData={setScanData}
            />
            : <></>
        }


        <Table stickyHeader size="small" sx={{
          minWidth: 650,
          border: 'solid',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          borderWidth: 1,
          borderColor: blue[400]
        }}>
          <SearchAssetTable
            data={searchResult}
            isCheckTable={true}
            assetTab={false}
            assetCountReport={assetCountReport}
            assetInReport={assetInReport}
          />
        </Table>
      </div>
    </>
  )
}