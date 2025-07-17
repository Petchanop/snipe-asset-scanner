'use client'
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import { tableHeaders } from "@/_constants/constants";
import { ChangeEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import { blue } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { AssetResponse, fetchSearchAsset } from "@/_apis/snipe-it/snipe-it.api";
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { AssetCount, AssetCountLine, TAssetRow } from "@/_types/types";
import ScannerComponent from "@/_components/scanner";
import Typography from "@mui/material/Typography";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { AddAssetCountLine } from "@/_apis/report.api";
import dayjs from "dayjs";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { dataPerPage, handleChangePage, handleChangeRowsPerPage } from "./utility";
import { UpdateAssetCountLine } from "@/_libs/report.utils";
import { useRouter } from "next/navigation";

export type ExtendAssetResponse = AssetResponse & {
  asset_name_not_correct: boolean;
  is_not_asset_loc: boolean;
  asset_check: boolean;
  in_report: boolean;
}

function CreateSearchAssetTableCell(props: {
  data: TAssetRow,
  // actionLabel: string,
  // assetCountReport: AssetCount
}) {
  const { data } = props
  const { id, assetCode, assetName, assignedTo, countCheck, assignIncorrect } = data;
  const [count, setCount] = useState(countCheck)
  const [incorrect, setIncorrect] = useState(assignIncorrect)

  useEffect(() => {
    UpdateAssetCountLine(id!, { asset_check: count })
  }, [count, id])

  useEffect(() => {
    UpdateAssetCountLine(id!, { is_not_asset_loc: incorrect })
  }, [incorrect, id])
  return (
    <>
      <TableCell>
        {assetCode}
      </TableCell>
      <TableCell>
        {assetName}
      </TableCell>
      <TableCell>
        {assignedTo?.first_name} {assignedTo?.last_name}
      </TableCell>
      <TableCell className="relative place-content-center justify-center items-center justify-content-center">
        <Checkbox checked={count}
          onChange={async () => {
            setCount((pre) => !pre)
          }}
        />
      </TableCell>
      <TableCell className="p-0">
        <Checkbox checked={incorrect}
          onChange={async () => {
            setIncorrect((pre) => !pre)
          }}
        />
      </TableCell>
    </>
  )
}

function SearchAssetTable(props: {
  data: TAssetRow[],
  isCheckTable: boolean,
  assetTab: boolean,
  assetCountReport: AssetCount,
  assetInReport: AssetCountLine[]
}) {
  const { data } = props
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const headers = tableHeaders
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
            dataPerPage(data, page, rowsPerPage).map((asset: TAssetRow) => {
              return (
                <TableRow key={`${asset.assetCode}${dayjs().get('second')}`} >
                  <CreateSearchAssetTableCell data={asset} />
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
            onPageChange={(event, page) => handleChangePage(event, page, setPage, data.length, rowsPerPage)}
            onRowsPerPageChange={(event) =>
              handleChangeRowsPerPage(event as ChangeEvent<HTMLInputElement>, setRowsPerPage, setPage)
            }
          />
        </TableRow>
      </TableFooter>
    </>
  )
}

export function SearchComponent() {
  const [searchInput, setSearchInput] = useState<string>("")
  const [scanData, setScanData] = useState<IDetectedBarcode[]>()
  const [fetchData, setFetchData] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<AssetResponse[]>([])
  const [show, setShow] = useState(false)

  async function callFetchAssetSearch() {
    if (searchInput && fetchData) {
      const { data, error } = await fetchSearchAsset(searchInput);
      if (error) {
        toast.error(`${searchInput} not found.`)
      } else {
        const IsInLocation = searchResult.find((result) => result.asset_tag == data.asset_tag)
        if (!IsInLocation) {
          toast.success(`${searchInput} was found.`)
          setSearchResult([data, ...searchResult])
        } else {
          toast.error(`${searchInput} is already on the list.`)
        }
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
          toast.error(`${result.rawValue} not found.`)
        } else {
          toast.success(`${result.rawValue} was found.`)
          const IsInLocation = searchResult.find((result) => result.asset_tag == data.asset_tag)
          if (!IsInLocation) {
            setSearchResult([data, ...searchResult])
          } else {
            toast.error(`${result.rawValue} is already on the list.`)
          }
        }
        setScanData([])
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
          error: {
            duration: 1500,
            style: {
              background: '#ea7259',
              color: '#fff'
            }
          },
          success: {
            duration: 1500,
            style: {
              background: '#45b42fff',
              color: '#fff',
            }
          }
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? 'custom-enter 2s ease-in-out'
                : 'custom-exit 2s ease-in',
            }}
          />
        )}
      </Toaster>
      <div className="space-y-2">
        <div className="flex flex-row w-full py-2 pl-2 space-x-2 content-center">
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
      </div>
    </>
  )
}

export default function SearchAsset(
  props: {
    assetCountReport: AssetCount
    assetInReport: AssetCountLine[]
  }
) {
  const { assetCountReport, assetInReport } = props
  const [searchInput, setSearchInput] = useState<string>("")
  const [scanData, setScanData] = useState<IDetectedBarcode[]>()
  const [fetchData, setFetchData] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<TAssetRow[]>([])
  const [show, setShow] = useState(false)
  const { back } = useRouter()

  async function callFetchAssetSearch() {
    if (searchInput && fetchData) {
      const { data, error } = await fetchSearchAsset(searchInput);
      if (error) {
        toast.error(`${searchInput} not found.`)
      } else {
        const IsInLocation = assetInReport.find((result) => result.asset_code == data.asset_tag)
        if (!IsInLocation) {
          toast.success(`${searchInput} was found.`)
          const extendTypeAsset: ExtendAssetResponse = {
            ...data,
            asset_name_not_correct: false,
            is_not_asset_loc: data.location?.id != assetCountReport.location_id,
            asset_check: false,
            in_report: assetInReport.find((report) => report.asset_code === data.asset_tag) ? true : false,
          }
          const assetCountLine = await AddAssetCountLine(extendTypeAsset, assetCountReport)
          const asset = {
            id: assetCountLine.id,
            assetCode: assetCountLine.asset_code,
            assetName: assetCountLine.asset_name,
            assignedTo: {
              id: data?.id,
              first_name: data.assigned_to!.first_name,
              last_name: data.assigned_to!.last_name
            },
            countCheck: assetCountLine.asset_check ? assetCountLine.asset_check : false,
            assignIncorrect: assetCountLine.is_not_asset_loc ? assetCountLine.is_not_asset_loc : false
          } as unknown as TAssetRow
          setSearchResult([asset, ...searchResult])
        } else {
          toast.error(`${searchInput} is already on the list.`)
        }
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
          toast.error(`${result.rawValue} not found.`)
        } else {
          toast.success(`${result.rawValue} was found.`)
          const IsInLocation = searchResult.find((result) => result.assetCode == data.asset_tag)
          if (!IsInLocation) {
            const extendTypeAsset: ExtendAssetResponse = {
              ...data,
              asset_name_not_correct: false,
              is_not_asset_loc: data.location?.id != assetCountReport.location_id,
              asset_check: false,
              in_report: assetInReport.find((report) => report.asset_code === data.asset_tag) ? true : false,
            }
            const assetCountLine = await AddAssetCountLine(extendTypeAsset, assetCountReport)
            const asset = {
              id: assetCountLine.id,
              assetCode: assetCountLine.asset_code,
              assetName: assetCountLine.asset_name,
              assignedTo: {
                id: data?.id,
                first_name: data.assigned_to!.first_name,
                last_name: data.assigned_to!.last_name
              },
              countCheck: assetCountLine.asset_check ? assetCountLine.asset_check : false,
              assignIncorrect: assetCountLine.is_not_asset_loc ? assetCountLine.is_not_asset_loc : false
            } as unknown as TAssetRow
            setSearchResult([asset, ...searchResult])
          } else {
            toast.error(`${result.rawValue} is already on the list.`)
          }
        }
        setScanData([])
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
          error: {
            duration: 1500,
            style: {
              background: '#ea7259',
              color: '#fff'
            }
          },
          success: {
            duration: 1500,
            style: {
              background: '#45b42fff',
              color: '#fff',
            }
          }
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? 'custom-enter 2s ease-in-out'
                : 'custom-exit 2s ease-in',
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
          <Button onClick={() => back()}>Back</Button>

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