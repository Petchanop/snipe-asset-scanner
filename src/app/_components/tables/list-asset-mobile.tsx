import {
  AssetStatusEnum,
  assetStatusOptions,
  INLOCATION,
  rowsPerPageOptions,
  startRowsPerPage,
  tableHeaders,
  tableHeadersAdditional
} from "@/_constants/constants"
import { UpdateAssetCountLine } from "@/_repositories/assetCountLine";
import { TAssetRow, TAssetTab, userNameId } from "@/_types/types"
import Checkbox from "@mui/material/Checkbox";
import { grey } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useReportContext } from "@/_contexts/context";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone'
import IconButton from "@mui/material/IconButton";
import { DialogActions } from "@mui/material";
import ImageComponent from "@/_components/ImageComponent";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { decode } from 'html-entities'
import { useSession } from "next-auth/react";

type TRenderCellProps = {
  count: boolean | undefined,
  setCount: Dispatch<SetStateAction<boolean | undefined>>,
  incorrect: boolean | undefined,
  setIncorrect: Dispatch<SetStateAction<boolean | undefined>>,
  wrongLocation: boolean | undefined,
  setWrongLocation: Dispatch<SetStateAction<boolean | undefined>>,
  assetStatus: boolean,
  setAssetStatus: Dispatch<SetStateAction<boolean>>,
  remarkAsset: string,
  setRemarkAsset: Dispatch<SetStateAction<string | undefined>>,
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  openModal: boolean,
  setOpenModal: Dispatch<SetStateAction<boolean>>
}

function RenderCellValueByAssetKey(props: {
  data: TAssetRow,
  cellCase: string,
  isCheckTable: boolean,
  header: string,
  renderCellProps: TRenderCellProps,
  user: any,
  users: userNameId[]
}) {
  const { data, cellCase, isCheckTable, header, renderCellProps, user, users } = props
  const { assetCode, assetName, assignedTo, image, ownedBy } = data;
  const {
    count, setCount,
    incorrect, setIncorrect,
    wrongLocation, setWrongLocation,
    assetStatus, setAssetStatus,
    remarkAsset, setRemarkAsset,
    open, setOpen,
    openModal, setOpenModal
  } = renderCellProps
  const ownedAsset = users.find((user) => user.id == ownedBy)
  const [owner, setOwner] = useState<userNameId | undefined | null>(ownedAsset == undefined ? null : ownedAsset)
  const autoCompleteProps = {
    options: users,
    getOptionLabel: (option: userNameId) => option.name,
    isOptionEqualToValue: (option: userNameId, value: userNameId) => option.id === value.id
  }
  switch (cellCase) {
    case "assetName":
      return (
        <></>
      )
    case "assignedTo":
      return (
        <div className="flex flex-col h-[3.2rem]">
          {header}
          <div className="text-black mt-1 text-lg">
            {assignedTo.first_name} {assignedTo.last_name}
          </div>
        </div>
      )

    case "countCheck":
      return (
        <div className="flex flex-row items-center justify-between h-[1.25rem]">
          {header}
          <Checkbox checked={count}
            disabled={!isCheckTable}
            onChange={async (event) => {
              const updateData = async () => {
                await UpdateAssetCountLine(data.id as string, {
                  asset_check: event.target.checked,
                  checked_by: parseInt(user?.id)
                })
              }
              await updateData()
              setCount(pre => !pre)
            }}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 34 } }}
          />
        </div>
      )

    case "assignIncorrect":
      return (
        <div className="flex flex-row items-center justify-between h-[1.25rem]">
          {header}
          <Checkbox
            checked={incorrect}
            disabled={!isCheckTable}
            onChange={async (event) => {
              const updateAssignNotCorrect = async () => {
                await UpdateAssetCountLine(data.id as string, {
                  is_assigned_incorrectly: event.target.checked,
                  checked_by: parseInt(user?.id)
                })
              }

              await updateAssignNotCorrect()
              setIncorrect(pre => !pre)
            }}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 34 } }}
          />
        </div>
      )
    case "notInLocation":
      return (
        <div className="flex flex-row items-center justify-between h-[1.25rem]">
          {header}
          <Checkbox
            checked={wrongLocation}
            disabled={!isCheckTable}
            onChange={async (event) => {
              const updateIncorrectLocation = async () => {
                await UpdateAssetCountLine(data.id as string, {
                  is_not_asset_loc: event.target.checked,
                  checked_by: parseInt(user?.id)
                })
              }

              await updateIncorrectLocation()
              setWrongLocation(pre => !pre)
            }}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 34 } }}
          />
        </div>
      )

    case "status":
      return (
        <div className="flex flex-row items-center justify-between h-[1.25rem]">
          {header}
          <Checkbox
            checked={assetStatus}
            onChange={async (event) => {
              const updateAssetStatus = async () => {
                data.status = event.target.checked ? AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
                await UpdateAssetCountLine(data.id as string, {
                  asset_count_line_status_id: data.status,
                  checked_by: parseInt(user?.id)
                })
              }
              await updateAssetStatus()
              setAssetStatus(pre => !pre)
            }}
            disabled={!isCheckTable}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 34 } }}
          />
        </div>
      )

    case "prev_location":
      return (
        <div className="flex flex-row items-center justify-between h-[1.25rem]">
          {header}
          <IconButton onClick={() => setOpenModal((prev) => !prev)}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 34 } }}
          >
            <EditNoteTwoToneIcon />
          </IconButton>
          <Dialog
            open={openModal}
          >
            <DialogContent dividers>
              <TextareaAutosize
                id="remark"
                onChange={(event) => setRemarkAsset(event.target.value)}
                value={remarkAsset}
                style={{ width: 250, height: 300 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() =>
                setOpenModal((prev) => !prev)
              }
                color='warning'
              >ยกเลิก</Button>
              <Button onClick={() => {
                const updateRemark = async () => {
                  await UpdateAssetCountLine(data.id as string,
                    { remarks: remarkAsset, checked_by: parseInt(user?.id) })
                }
                updateRemark()
                setOpenModal((prev) => !prev)
              }}
                color='primary'
              >บันทึก</Button>
            </DialogActions>
          </Dialog>
        </div >
      )
    case "ownedBy":
      return (
        <div className="flex flex-col h-[3.2rem] mt-0 mb-6">
          {header}
          <Autocomplete
            {...autoCompleteProps}
            disabled={!incorrect || !isCheckTable}
            id="employee name autocomplete"
            className="w-[15rem] mt-2 shadow-md focus:outline-none bg-white"
            value={owner}
            onChange={async (event: any, newValue: userNameId | null) => {
              setOwner(newValue!)
              if (newValue != null) {
                await UpdateAssetCountLine(data.id as string,
                  { owned_by: newValue.id, checked_by: parseInt(user.id) }
                )
              } else {
                if (ownedBy) {
                  await UpdateAssetCountLine(data.id as string,
                    { owned_by: null, checked_by: parseInt(user.id) }
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
        </div>
      )
    default:
      return (
        <div className="flex flex-col">
          {header}
          <div className="text-black mt-2 text-lg">
            {assetCode}
          </div>
          <Button onClick={() => setOpen((prev) => !prev)}>
            <ImageComponent
              src={image}
              alt={assetName as string}
              width={400}
              height={400}
            />
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
              <ImageComponent
                src={image}
                alt={assetName as string}
                width={400}
                height={400}
              />
            </DialogContent>
          </Dialog>
          <div className="text-black text-lg" key={assetCode}>
            {decode(assetName)}
          </div>
        </div>
      )
  }
}

function AssetCard(props: {
  data: TAssetRow,
  assetTab?: TAssetTab,
  tabValue?: TAssetTab,
  isCheckTable: boolean,
  user: any,
  users: userNameId[]
}) {
  const { data, assetTab, tabValue, isCheckTable, user, users } = props
  const headers = assetTab == INLOCATION ? tableHeaders : tableHeadersAdditional
  const { countCheck, assignIncorrect, notInLocation, status, remarks, prev_location } = data;
  const [count, setCount] = useState(countCheck)
  const [incorrect, setIncorrect] = useState(assignIncorrect)
  const [wrongLocation, setWrongLocation] = useState(notInLocation)
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [remarkAsset, setRemarkAsset] = useState(remarks ? remarks : prev_location)
  const [assetStatus, setAssetStatus] = useState(assetStatusOptions
    .find((option) => option.id == status)?.id == AssetStatusEnum.MALFUNCTIONING)
  const reportContext = useReportContext()

  useEffect(() => {
    const updateRemark = async () => {
      if (reportContext.update) {
        await UpdateAssetCountLine(data.id as string, { remarks: remarkAsset, checked_by: parseInt(user?.id) })
      }
    }
    updateRemark()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportContext.update])

  const RenderCellValue = {
    context: reportContext,
    count: count,
    setCount: setCount,
    incorrect: incorrect,
    setIncorrect: setIncorrect,
    wrongLocation: wrongLocation,
    setWrongLocation: setWrongLocation,
    assetStatus: assetStatus,
    setAssetStatus: setAssetStatus,
    remarkAsset: remarkAsset as string,
    setRemarkAsset: setRemarkAsset,
    open: open,
    setOpen: setOpen,
    openModal: openModal,
    setOpenModal: setOpenModal
  }
  return (
    <Table stickyHeader sx={{
    }}
      className={tabValue == assetTab ? "p-8" : "hidden"}
    >
      <TableBody sx={{ overflow: 'hidden' }} className="place-content-center">
        {
          headers.map((header) => {
            return header.mobile && (
              <TableRow key={header.value} className=""
                sx={{
                  minHeight: 50,
                  maxHeight: 400,
                  justifyContent: 'center',
                  justifyItems: 'center'
                }}
              >
                <TableCell className="border-none"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: grey[500],
                    height: 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <RenderCellValueByAssetKey
                    data={data}
                    isCheckTable={isCheckTable}
                    cellCase={header.value}
                    header={header.label}
                    renderCellProps={RenderCellValue}
                    user={user}
                    users={users}
                  />
                </TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
  )
}

export default function ListAssetMobile(props: {
  data: TAssetRow[],
  isCheckTable: boolean,
  assetTab?: TAssetTab
  setAssetTab?: (value: SetStateAction<TAssetTab>) => void,
  tabValue?: TAssetTab,
  users: userNameId[]
}) {
  const { data, isCheckTable, assetTab, tabValue, users } = props
  const [itemPerPage, setItemPerPage] = useState(startRowsPerPage)
  const [page, setPage] = useState<number>(1);
  const { data: session } = useSession()

  function dataPerPage(data: any, page: number, rowsPerPage: number): any[] {
    return data.length ?
      data
        .slice((page - 1) * rowsPerPage, ((page - 1) * rowsPerPage) + rowsPerPage)
      : []
  }
  return (
    <div className={`
      flex flex-col 
      mt-4 mb-4 space-y-4 
      justify-center items-center 
      ${tabValue == assetTab ? "" : "hidden"}`
    }>
      {
        data.length ? (
          <>
            {dataPerPage(data, page, itemPerPage).map((asset) => {
              return (
                <Paper key={asset.assetCode} elevation={5}
                  sx={{
                    borderRadius: '2%',
                    maxWidth: 350,
                    minWidth: 350
                  }}
                >
                  <AssetCard
                    data={asset}
                    assetTab={assetTab}
                    isCheckTable={isCheckTable}
                    tabValue={tabValue}
                    user={session?.user}
                    users={users}
                  />
                </Paper>
              )
            })
            }
            <Pagination count={Math.ceil(data.length / itemPerPage)}
              page={page}
              onChange={(_, page) => {
                setPage(page)
              }}
              siblingCount={0}
              showFirstButton showLastButton />
          </>
        )
          : <></>
      }
      <Box className='flex flex-row justify-center space-x-2'
      sx={{ 
        height: 130, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline'
      }}
      >
        <Typography>items per page</Typography>
        <Select
          labelId="rowPerPage"
          label="rows per page"
          value={itemPerPage}
          onChange={(event) => {
            setItemPerPage(event.target.value)
          }}
          sx={{ height: 50}}
        >
          {
            rowsPerPageOptions.map((row) => {
              return (
                <MenuItem value={row} key={row}>{row}</MenuItem>
              )
            })
          }
        </Select>
      </Box>
    </div>
  )
}