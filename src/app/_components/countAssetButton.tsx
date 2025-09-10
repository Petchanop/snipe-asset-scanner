'use client'

import Button from "@mui/material/Button"
import { useWindowSize } from "@/_components/loading"
import { PNewCountTableProps } from "@/_components/tables/new-count-table"
import { Dispatch, SetStateAction, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useReportContext } from "@/_contexts/context"
import { updateAssetCountReport } from "@/_repositories/assetCount"
import { ReportState } from "@/_constants/constants"
import toast from "react-hot-toast"
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import Box from "@mui/material/Box"
import { grey } from "@mui/material/colors"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import DialogActions from "@mui/material/DialogActions"
import { lighten } from "@mui/material/styles"

function ConfirmCompleteReportDialog(props: {
  isHidden: boolean,
  setIsHidden: Dispatch<SetStateAction<boolean>>,
}) {
  const { isHidden, setIsHidden } = props
  const reportContext = useReportContext()
  const { push } = useRouter()
  const handleFinishButton = async () => {
    await updateAssetCountReport(reportContext.DocumentNumber!, {
      state: ReportState.COMPLETED
    })
    toast.success(`จบการตรวจนับทรัพย์สิน`)
    push(`/reports`)
  }

  return (
    <>
      <Dialog open={isHidden}
        maxWidth="xl"
      >
        <DialogContent>
          <Typography>ต้องการจบการตรวจนับ รายงานหมายเลข {reportContext.DocumentNumber}</Typography>
          <Typography>ใช่หรือไม่ ?</Typography>
        </DialogContent>
        <DialogActions className="space-x-4">
          <Button onClick={() => setIsHidden((prev) => !prev)} color='error'>
            ยกเลิก
          </Button>
          <Button onClick={async () => {
            handleFinishButton()
            setIsHidden((prev) => !prev)
          }}
            variant='contained'
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export function CheckAssetGroupButtonprops(props: {
  setIsCheckTable: (value: SetStateAction<boolean>) => void,
  childId: number
}) {
  const { setIsCheckTable, childId } = props
  const [hidden, setHidden] = useState<boolean>(true);
  const reportContext = useReportContext()
  const pathname = usePathname()
  const { push } = useRouter()

  const handleSavebutton = () => {
    setIsCheckTable(false)
    reportContext.setUpdate(true)
  }

  const windowSize = useWindowSize()
  const dialPosition = windowSize.width as number < 500 ? 0 : 20
  const dialPoistionRight = windowSize.width as number < 500 ? 16 : 50
  const dialPoistionLeft = windowSize.width as number < 500 ? 16 : 100

  const actions = [
    {
      icon: <SearchIcon />, name: 'ค้นหา', onClick: () => {
        push(`${pathname}/check?location=${childId}`)
      },
      color: 'primary'
    },
    { icon: <CancelIcon />, name: 'ยกเลิก', onClick: () => setIsCheckTable((pre) => !pre), color: 'error' },
    { icon: <SaveIcon />, name: 'บันทึก', onClick: handleSavebutton, color: 'success' }
  ]

  const finishButton = { icon: <DoneIcon />, name: 'จบการตรวจนับ', onClick: () => setHidden((prev) => !prev), color: 'primary' }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 1,
          position: 'fixed',
          bottom: dialPosition,
          right: dialPoistionRight,
          borderStyle: 'inset solid',
          borderRadius: '4%',
          borderColor: grey[400],
          backgroundColor: grey[200],
          zIndex: 9999,
        }}
        className="flex flex-row w-86 h-14"
      >
        {
          actions.map((action) => (
            <Button
              key={action.name}
              onClick={action.onClick}
              variant="text"
              color={action.color as "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined}
              startIcon={action.icon}
              sx={(t) => ({
                position: 'relative',
                zIndex: 9998,
                "& .MuiButton-startIcon": { margin: 0 },
                "&:hover": {
                  backgroundColor: lighten((t.palette as any)[action.color].main, 0.5),
                },
                "&:active": {
                  backgroundColor: lighten((t.palette as any)[action.color].main, 0.5), // press = even darker
                },
              })}
              className="flex-col gap-1 py-4"
            >
              {action.name}
            </Button>
          ))
        }
      </Box>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 1,
          position: 'fixed',
          bottom: dialPosition,
          right: dialPoistionRight,
          borderStyle: 'inset solid',
          borderRadius: '4%',
          borderColor: grey[400],
          backgroundColor: grey[200],
          zIndex: 9999,
        }}
        className="flex-row h-14"
      >
        <Button
          key={finishButton.name}
          onClick={finishButton.onClick}
          variant="text"
          color={finishButton.color as "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined}
          startIcon={finishButton.icon}
          sx={(t) => ({
            position: 'relative',
            zIndex: 9998,
            "& .MuiButton-startIcon": { margin: 0 },
            "&:hover": {
              backgroundColor: lighten((t.palette as any)[finishButton.color].main, 0.5),
            },
            "&:active": {
              backgroundColor: lighten((t.palette as any)[finishButton.color].main, 0.5), // press = even darker
            },
          })}
          className="flex-col gap-1 py-4"
        >
          {finishButton.name}
        </Button>
      </Box> */}
      <ConfirmCompleteReportDialog
        isHidden={!hidden}
        setIsHidden={setHidden}
      />
    </>
  )
}


export function CountAssetButton(props: {
  selectedLocation: PNewCountTableProps,
  setLocation: (value: PNewCountTableProps) => void,
  setIsCheckTable: (value: SetStateAction<boolean>) => void
}) {
  const {
    setIsCheckTable
  } = props
  const params = useParams<{ reportId: string }>()
  const documentNumber = params.reportId ? parseInt(params.reportId) : 0
  const documentContext = useReportContext()

  async function handleClickStart() {
    setIsCheckTable((pre) => !pre)
    documentContext.setDocumentNumber(documentNumber)
  }

  const windowSize = useWindowSize()
  const dialPosition = windowSize.width as number < 500 ? 0 : 30
  const dialPoistionRight = windowSize.width as number < 500 ? 16 : 50

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: dialPosition,
        right: dialPoistionRight,
        borderStyle: 'inset',
        display: 'flex',
        alignItems: 'end',       // vertical center
        justifyContent: 'flex-end', // horizontal right
        zIndex: 9999
      }}
      className="w-86 h-14"
    >
      <Button
        variant="contained"
        onClick={handleClickStart}
        className={windowSize.width as number < 500 ? "w-full h-full" : ""}
      >
        เริ่มตรวจนับ
      </Button>
    </Box>
  )
}