import { AssetStatusEnum, 
    assetStatusOptions, 
    INLOCATION, 
    tableHeaders, 
    tableHeadersAdditional 
} from "@/_constants/constants"
import { UpdateAssetCountLine } from "@/_libs/report.utils";
import { TAssetRow, TAssetTab } from "@/_types/types"
import Checkbox from "@mui/material/Checkbox";
import { grey } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useReportContext } from "@/_components/tableLayout";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Image from 'next/image'
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone'
import IconButton from "@mui/material/IconButton";
import { DialogActions } from "@mui/material";

type TRenderCellProps = {
  count: boolean,
  setCount: Dispatch<SetStateAction<boolean>>,
  incorrect: boolean,
  setIncorrect: Dispatch<SetStateAction<boolean>>,
  wrongLocation: boolean,
  setWrongLocation: Dispatch<SetStateAction<boolean>>,
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
  renderCellProps: TRenderCellProps
}) {
  const { data, cellCase, isCheckTable, header, renderCellProps } = props
  const { assetCode, assetName, assignedTo, image } = data;
  const {
    count, setCount,
    incorrect, setIncorrect,
    wrongLocation, setWrongLocation,
    assetStatus, setAssetStatus,
    remarkAsset, setRemarkAsset,
    open, setOpen,
    openModal, setOpenModal
  } = renderCellProps

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
        <div className="flex flex-row items-center justify-between pr-4 h-[1rem]">
          {header}
          <Checkbox checked={count}
            disabled={!isCheckTable}
            onChange={() => setCount(pre => !pre)}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />
        </div>
      )

    case "assignIncorrect":
      return (
        <div className="flex flex-row items-center justify-between pr-4 h-[1rem]">
          {header}
          <Checkbox
            checked={incorrect}
            disabled={!isCheckTable}
            onChange={() => setIncorrect(pre => !pre)}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />
        </div>
      )
    case "notInLocation":
      return (
        <div className="flex flex-row items-center justify-between pr-4 h-[1rem]">
          {header}
          <Checkbox
            checked={wrongLocation}
            disabled={!isCheckTable}
            onChange={() => setWrongLocation(pre => !pre)}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />
        </div>
      )

    case "status":
      return (
        <div className="flex flex-row items-center justify-between pr-4 h-[1rem]">
          {header}
          <Checkbox
            checked={assetStatus}
            onChange={() => setAssetStatus(pre => !pre)}
            disabled={!isCheckTable}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />
        </div>
      )

    case "prev_location":
      return (
        <div className="flex flex-row items-center justify-between pr-4 h-[1rem]">
          {header}
          <IconButton onClick={() => setOpenModal((prev) => !prev)}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
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
                // context.setUpdate((prev) => !prev)
                const updateRemark = async () => {
                  // if (reportContext.update) {
                  await UpdateAssetCountLine(data.id as string, { remarks: remarkAsset })
                  // }
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
    default:
      return (
        <div className="flex flex-col">
          {header}
          <div className="text-black mt-2 text-lg">
            {assetCode}
          </div>
          <Button onClick={() => setOpen((prev) => !prev)}>
            {
              image ?
                <Image
                  src={image}
                  alt={assetName}
                  width={400}
                  height={400}
                /> : "No image display"
            }
          </Button>
          <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClick={() => setOpen((prev) => !prev)}
          >
            <DialogTitle id="alert-dialog-title">
              {assetName}
            </DialogTitle>
            <DialogContent>
              {
                image ?
                  <Image
                    src={image}
                    alt={assetName}
                    width={400}
                    height={400}
                  /> : "No image display"
              }
            </DialogContent>
          </Dialog>
          <div className="text-black text-lg" key={assetCode}>
            {assetName}
          </div>
        </div>
      )
  }
}

function AssetCard(props: {
  data: TAssetRow,
  assetTab: TAssetTab,
  tabValue?: TAssetTab,
  isCheckTable: boolean
}) {
  const { data, assetTab, tabValue, isCheckTable } = props
  const headers = assetTab == INLOCATION ? tableHeaders : tableHeadersAdditional
  const { countCheck, assignIncorrect, notInLocation, status, remarks } = data;
  const [count, setCount] = useState(countCheck)
  const [incorrect, setIncorrect] = useState(assignIncorrect)
  const [wrongLocation, setWrongLocation] = useState(notInLocation)
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [remarkAsset, setRemarkAsset] = useState(remarks)
  const [assetStatus, setAssetStatus] = useState(assetStatusOptions
    .find((option) => option.id == status)?.id == AssetStatusEnum.MALFUNCTIONING)
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incorrect])

  useEffect(() => {
    const updateIncorrectLocation = async () => {
      data.notInLocation = wrongLocation
      await UpdateAssetCountLine(data.id as string, {
        is_not_asset_loc: wrongLocation,
      })
    }

    updateIncorrectLocation()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrongLocation])

  useEffect(() => {
    const updateAssetStatus = async () => {
      data.status = assetStatus ? AssetStatusEnum.MALFUNCTIONING : AssetStatusEnum.DEPLOYABLE
      await UpdateAssetCountLine(data.id as string, {
        asset_count_line_status_id: assetStatus ? 
          AssetStatusEnum.MALFUNCTIONING 
          : AssetStatusEnum.DEPLOYABLE
      })
    }
    updateAssetStatus()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetStatus])

  useEffect(() => {
    const updateRemark = async () => {
      if (reportContext.update) {
        await UpdateAssetCountLine(data.id as string, { remarks: remarkAsset })
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
    <Table stickyHeader size="small" sx={{
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
                  maxHeight: 200,
                  // height: 100,
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
  assetTab: TAssetTab
  setAssetTab: (value: SetStateAction<TAssetTab>) => void,
  tabValue?: TAssetTab,
}) {
  const { data, isCheckTable, assetTab, tabValue } = props
  const [itemPerPage, setItemPerPage] = useState(5)
  const [page, setPage] = useState<number>(1);
  const rowPerPageOptions = [5, 10, 20]

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
                    maxWidth: 600,
                    minWidth: 400
                  }}
                >
                  <AssetCard
                    data={asset}
                    assetTab={assetTab}
                    isCheckTable={isCheckTable}
                    tabValue={tabValue}
                  />
                </Paper>
              )
            })
            }
            <Pagination count={Math.floor(data.length / itemPerPage)}
              page={page}
              onChange={(_, page) => {
                setPage(page)
                console.log("page", page)
              }}
              siblingCount={0}
              showFirstButton showLastButton />
          </>
        )
          : <></>
      }
      <div className='flex flex-row items-center space-x-2'>
        <Typography>items per page</Typography>
        <Select
          labelId="rowPerPage"
          label="rows per page"
          value={itemPerPage}
          onChange={(event) => {
            setItemPerPage(event.target.value)
          }}
          size="medium"
        >
          {
            rowPerPageOptions.map((row) => {
              return (
                <MenuItem value={row} key={row}>{row}</MenuItem>
              )
            })
          }
        </Select>
      </div>
    </div>
  )
}