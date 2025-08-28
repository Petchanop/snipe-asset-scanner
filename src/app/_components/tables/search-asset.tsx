'use client'
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow"
import {
  AssetStatusEnum, assetStatusOptions,
  rowsPerPageOptions, startRowsPerPage,
  tableHeadersAdditional
} from "@/_constants/constants";
import { ChangeEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import { blue } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { fetchSearchAsset } from "@/_intergrations/snipeit/assets";
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { AssetCount, AssetCountLine, TAssetRow, AssetCountLocation, User, userNameId } from "@/_types/types";
import ScannerComponent from "@/_components/scanner";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { dataPerPage, handleChangePage, handleChangeRowsPerPage } from "@/_components/tables/utility";
import { UpdateAssetCountLine } from "@/_repositories/assetCountLine";
import { UpdateAssetCountLineForSearchAssetPage } from "@/_libs/searchAsset";
import ListAssetMobile from "./list-asset-mobile";
import { useWindowSize } from "@/_components/loading";
import { usePathname, useRouter } from "next/navigation";
import { ReportContext } from "@/_contexts/context";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment"
import { decode } from "html-entities";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useSession } from "next-auth/react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

function CreateSearchAssetTableCell(props: {
  assetData: TAssetRow,
  users: userNameId[]
}) {
  const { assetData, users } = props
  const { id, assetCode, assetName, assignedTo,
    countCheck, assignIncorrect, notInLocation,
    status, prev_location, ownedBy, remarks
  } = assetData;
   const ownedAsset = users.find((user) => user.id == ownedBy)
  const [count, setCount] = useState(countCheck)
  const [incorrect, setIncorrect] = useState(assignIncorrect)
  const [wrongLocation, setWrongLocation] = useState(notInLocation)
  const [remarkAsset, setRemarkAsset] = useState(remarks ? remarks : prev_location)
  const [owner, setOwner] = useState<userNameId | undefined | null>(ownedAsset == undefined ? null : ownedAsset)
  const [assetStatus, setAssetStatus] = useState(
    assetStatusOptions.find((option) => option.id == status)?.id == AssetStatusEnum.MALFUNCTIONING)
  const assignedToName = assignedTo.first_name != undefined ? assignedTo?.first_name + " " + assignedTo?.last_name : ""
  const { data: session } = useSession()
  const user = session?.user

  const autoCompleteProps = {
    options: users,
    getOptionLabel: (option: userNameId) => option.name,
    isOptionEqualToValue: (option: userNameId, value: userNameId) => option.id === value.id
  }

  useEffect(() => {
    const updateRemark = async () => {
      await UpdateAssetCountLine(id as string,
        { remarks: remarkAsset, checked_by: parseInt(user!.id) }
      )}
    updateRemark()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remarkAsset])
  return (
    <>
      <TableCell>
        {decode(assetCode)}
      </TableCell>
      <TableCell>
        {decode(assetName)}
      </TableCell>
      <TableCell>
        {assignedToName}
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox checked={count}
          onChange={async (event) => {
            UpdateAssetCountLine(id!, { asset_check: event.target.checked })
            setCount((prev) => !prev)
          }}
        />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          checked={wrongLocation}
          onChange={async (event) => {
            UpdateAssetCountLine(id!, { is_not_asset_loc: event.target.checked })
            setWrongLocation((prev) => !prev)
          }} />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          checked={assetStatus}
          onChange={async (event) => {
            setAssetStatus((prev) => !prev)
            UpdateAssetCountLine(id!,
              {
                asset_count_line_status_id: event?.target.checked ?
                  AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
              })
          }}
        ></Checkbox>
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox checked={incorrect}
          onChange={async (event) => {
            UpdateAssetCountLine(id!, { is_assigned_incorrectly: event.target.checked })
            setIncorrect((prev) => !prev)
          }}
        />
      </TableCell>
      <TableCell>
        <Autocomplete
          {...autoCompleteProps}
          disabled={!incorrect}
          id="employee name autocomplete"
          className="w-[16rem] z-20 shadow-md focus:outline-none bg-white"
          value={owner}
          onChange={async (event: any, newValue: userNameId | null) => {
            setOwner(newValue!)
            if (newValue != null) {
              await UpdateAssetCountLine(id as string,
                { owned_by: newValue.id, checked_by: parseInt(user!.id) }
              )
            } else {
              if (ownedBy) {
                await UpdateAssetCountLine(id as string,
                  { owned_by: null, checked_by: parseInt(user!.id) }
                )
              }
            }
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props
            return (
              <Box
                key={optionProps.id + key}
                component="li"
                sx={{ padding: 4 }}
                {...optionProps}
              >
                {option.name}
              </Box>
            )
          }}
          renderInput={(params) => (
            <TextField {...params} label="employee name" />
          )}
        />
      </TableCell>
      <TableCell align="center">
        <TextareaAutosize
          id="remark"
          onChange={(event) => setRemarkAsset(event.target.value)}
          value={remarkAsset}
          className="w-full"
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
  assetInReport: AssetCountLine[],
  users: userNameId[]
}) {
  const { data, users } = props
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(startRowsPerPage);
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
            dataPerPage(data, page, rowsPerPage).map((asset: TAssetRow) => {
              return (
                <TableRow key={`${asset.assetCode}${asset.assetName}`} >
                  <CreateSearchAssetTableCell assetData={asset} users={users}/>
                </TableRow>
              )
            })
            : <></>
        }
      </TableBody >
      <TableFooter>
        <TableRow>
          <TablePagination
            showFirstButton
            showLastButton
            rowsPerPageOptions={rowsPerPageOptions}
            colSpan={10}
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

export default function SearchAsset(
  props: {
    assetCountReport: AssetCount
    assetInReport: AssetCountLine[]
    locationId: AssetCountLocation
    users: User[]
    user: any
  }
) {
  const { assetCountReport, assetInReport, locationId, users, user } = props
  const [searchInput, setSearchInput] = useState<string>("")
  const [scanData, setScanData] = useState<IDetectedBarcode[]>([])
  const [fetchData, setFetchData] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<TAssetRow[]>([])
  const [documentNumber, setDocumentNumber] = useState<number | undefined>(
    assetCountReport.document_number ? assetCountReport.document_number : 0)
  const [update, setUpdate] = useState(false)
  //eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  //eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const [IsSearch, setIsSearch] = useState<boolean>(false)
  //eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const [refetchReport, setRefetchReport] = useState<boolean>(false)
  const [isPause, setIsPause] = useState<boolean>(false)
  const [show, setShow] = useState(true)
  const { push } = useRouter()
  const pathname = usePathname()
  const searchData: string[] = []
  const usersProp: userNameId[] = users.map((user) => {
    return {
      id: user.id,
      name: user.first_name + " " + user.last_name
    }
  })
  async function callFetchAssetSearch() {
    if (searchInput && fetchData) {
      const { data, error } = await fetchSearchAsset(searchInput);
      if (error) {
        toast.error(`${searchInput} not found.`)
      } else {
        if (!searchResult.find((res) => res.assetCode == data.asset_tag)) {
          const asset = await UpdateAssetCountLineForSearchAssetPage(assetInReport, data, assetCountReport, users, locationId, user)
          toast.success(`${searchInput} was found.`)
          setSearchResult([asset, ...searchResult])
        }
        toast.success(`${searchInput} has been checked.`)
      }
      setSearchInput("")
    }
    setFetchData(false)
  }

  useEffect(() => {
    callFetchAssetSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData])

  useEffect(() => {
    const fetchAssetFromScanData = async (result: string) => {
      if (searchResult.filter((asset) => asset.assetCode == result).length > 0)
        return
      const { data, error } = await fetchSearchAsset(result);
      if (error) {
        toast.error(`${result} not found.`)
      } else {
        const asset = await UpdateAssetCountLineForSearchAssetPage(assetInReport, data, assetCountReport, users, locationId, user)
        toast.success(`${result} was found.`)
        toast.success(`${result} has been checked.`)
        setSearchResult((prev) => [asset, ...prev.filter((item) => item.assetCode != result)])
      }
    }
    if (scanData.length > 0) {
      setIsPause(true)
      for (const data of scanData) {
        if (searchData.filter((item) => item == data.rawValue).length == 0)
          searchData.unshift(data.rawValue)
        fetchAssetFromScanData(data.rawValue)
      }
      setIsPause(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanData])

  const media = useWindowSize()
  return (
    <>
      <Toaster
        containerStyle={{
          position: 'relative',
          top: '20%',
        }}
        toastOptions={{
          error: {
            duration: 2500,
            style: {
              background: '#ea7259',
              color: '#fff'
            }
          },
          success: {
            duration: 2500,
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
      <ReportContext value={{
        DocumentNumber: documentNumber,
        update: update,
        setDocumentNumber: setDocumentNumber,
        setRefetchReport: setRefetchReport,
        setUpdate: setUpdate,
        setSearch: setIsSearch
      }}>
        <Button onClick={() =>
          push(`${pathname.replace('/\check', '')}?location=${locationId.location_id}`)}
        ><ArrowBackIcon /> Back</Button>
        <div className="space-y-2 justify-items-center">
          <div className="flex flex-row
            lg:w-3/4 w-full 
            py-2 pl-2 lg:pl-10 
            lg:space-x-4 space-x-2 content-center"
          >
            <TextField
              id="search-asset"
              label="Search asset"
              variant="outlined"
              size="small"
              className="w-full"
              onChange={(event) => setSearchInput(event.target.value)}
              // disabled={show}
              value={searchInput}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={
                        () => setShow((pre) => !pre)
                      } size="small" className="p-0">
                        <PhotoCameraIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <IconButton color="primary"
              onClick={() => setFetchData(true)} className="bg-blue-200">
              <SearchIcon />
            </IconButton>
          </div>
          {
            show ?
              <ScannerComponent
                scanData={scanData!}
                setScanData={setScanData}
                isPause={isPause}
              />
              : <></>
          }
          {
            loading ? <></>
              : media.width as number < 500 ?
                <ListAssetMobile
                  data={searchResult}
                  isCheckTable={true}
                  users={usersProp}
                /> :
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
                    users={usersProp}
                  />
                </Table>
          }
        </div>
      </ReportContext>

    </>
  )
}