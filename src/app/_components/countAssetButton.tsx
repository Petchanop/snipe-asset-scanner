'use client'

import Button from "@mui/material/Button"
import { useWindowSize } from "@/_components/loading"
import { PNewCountTableProps } from "@/_components/tables/new-count-table"
import { SetStateAction } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useReportContext } from "@/_contexts/context"
import { updateAssetCountReport } from "@/_repositories/assetCount"
import { ReportState } from "@/_constants/constants"
import toast from "react-hot-toast"
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { ButtonGroup, colors } from "@mui/material"

export function CheckAssetGroupButtonprops(props: {
  setIsCheckTable: (value: SetStateAction<boolean>) => void,
  childId: number
}) {
  const { setIsCheckTable, childId } = props
  const reportContext = useReportContext()
  const pathname = usePathname()
  const { push } = useRouter()

  const handleSavebutton = () => {
    setIsCheckTable(false)
    reportContext.setUpdate(true)
  }

  const handleFinishButton = async () => {
    await updateAssetCountReport(reportContext.DocumentNumber!, {
      state: ReportState.COMPLETED
    })
    toast.success(`จบการตรวจนับทรัพย์สิน`)
  }
  const windowSize = useWindowSize()
  const dialPosition = windowSize.width as number < 500 ? 16 : 50

  const actions = [
    {
      icon: <SearchIcon />, name: 'ค้นหา', onClick: () => {
        push(`${pathname}/check?location=${childId}`)
      },
      color: 'primary'
    },
    { icon: <CancelIcon />, name: 'ยกเลิก', onClick: () => setIsCheckTable((pre) => !pre) , color: 'error'},
    { icon: <SaveIcon />, name: 'บันทึก', onClick: handleSavebutton, color: 'success' },
    { icon: <DoneIcon />, name: 'จบการตรวจนับ', onClick: handleFinishButton, color: 'primary' },
  ];
  return (
    <>
      <div className={`fixed bottom-5 right-10 z-50 space-x-2`}>
      {/* <ButtonGroup
        sx={{ position: 'fixed', bottom: dialPosition, right: dialPosition }}
      > */}
        {
          actions.map((action) => (
            <Button
              key={action.name}
              onClick={action.onClick}
              variant="contained"
              color={action.color as "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined}
            >
              {action.name}
            </Button>
          ))
        }
      {/* </ButtonGroup> */}
      </div>
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
  const dialPosition = windowSize.width as number < 500 ? 16 : 50

  // const handleClick = () => {
  //   console.log("Start Count Asset")
  // }
  return (
    <Button
      variant="contained"
      size="medium"
      sx={{ position: 'fixed', bottom: dialPosition, right: dialPosition }}
      onClick={handleClickStart}
    >
      เริ่มตรวจนับ
    </Button>
  )
}