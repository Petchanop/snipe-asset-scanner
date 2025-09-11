'use client'
import { LocationStateContext } from '@/_contexts/context';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import Divider from '@mui/material/Divider';
import { blue } from '@mui/material/colors';
import { DeleteAssetCountReport } from '@/_repositories/assetCount';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export function ConfirmDeletetionDialog(props: {
  documentName: string,
  documentNumber: number,
  isHidden: boolean,
  setIsHidden: Dispatch<SetStateAction<boolean>>,
  id: string
}) {
  const { isHidden, setIsHidden, documentNumber, documentName ,id } = props
  const { push } = useRouter()
   const handleDeleteReport = async () => {
    await DeleteAssetCountReport(id)
  }
  return (
    <>
      <Dialog open={isHidden}
        maxWidth="xl"
      >
        <DialogContent>
          <Typography>ต้องการลบ</Typography>
          <Typography>รายงานตรวจนับ {documentName}</Typography>
          <Typography>หมายเลข {documentNumber}</Typography>
          <Typography>ใช่หรือไม่ ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsHidden((prev) => !prev)} color='error'>
            ยกเลิก
          </Button>
          <Button onClick={async () => {
            await handleDeleteReport()
            setIsHidden((prev) => !prev)
           push('/') 
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

export default function ReportMenuButton(props: {
  context: LocationStateContext,
  documentNumber: number,
  id: string
}) {
  const { context, documentNumber } = props
  const { push } = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [hidden, setHidden] = useState<boolean>(true);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="py-2">
      <Button
        id="basic-button"
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleClick}
        sx={{
          backgroundColor: blue[300]
        }}
        size='small'
      >
        <Typography>
          Options
        </Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={() => {
          context.selected.current = `/reports/count-assets/${documentNumber}`
          push(`/reports/count-assets/${documentNumber}`)
        }}
          className="space-x-2"
        >
          <PlayArrowIcon />
          <Typography>
            ตรวจนับ
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          context.selected.current = ""
          push(`/setup/${documentNumber}`)
        }}
          className="space-x-2"
        >
          <EditIcon />
          <Typography>
            แก้ไข
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          push(`/reports/${documentNumber}`)
        }}
          className="space-x-2"
        >
          <VisibilityIcon />
          <Typography>
            ดูรายงาน
          </Typography>
        </MenuItem>
        {/* <Divider sx={{ my: 0.5 }} /> */}
        {/* <MenuItem onClick={() => {
          setHidden((prev) => !prev)
        }}
          className="space-x-2"
        >
          <DeleteIcon />
          <Typography className="text-red-500">
            ลบ
          </Typography>
        </MenuItem> */}
      </Menu>
      {/* <ConfirmDeletetionDialog 
        isHidden={!hidden}
        setIsHidden={setHidden} 
        documentNumber={documentNumber} 
        id={id}
      /> */}
    </div>
  );
}
