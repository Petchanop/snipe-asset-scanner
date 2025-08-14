import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ReportState } from '@/_constants/constants';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { CFiltertype, TFilter } from '@/_types/types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';

export default function FilterReportComponent(props: {
  setFilter: Dispatch<SetStateAction<TFilter[]>>
}) {
  const { setFilter } = props
  const filters = Object.entries(ReportState);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs())
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs().add(1, "week"))
  const [openDate, setOpenDate] = useState(false);
  const [selected, setSelected] = useState('All');

  const handleDateOnChange = (value: dayjs.Dayjs | null, setDateValue: Dispatch<SetStateAction<dayjs.Dayjs | null>>) => {
    if (value) {
      setDateValue(value)
    }
  }

  useEffect(() => {
    const addDateToFilter = () => {
      if (!openStatus) {
        setFilter((prev) =>
          [...prev.filter(item => item.type !== CFiltertype.STATUS)])
      }
      if (!openDate) {
        setFilter((prev) =>
          [...prev.filter(item => item.type !== CFiltertype.DATE)])
      } else {
        const dateFilter = startDate?.format('MM-DD-YYYY') + ' ' + endDate?.format('MM-DD-YYYY')
        setFilter((prev) =>
          [...prev.filter(item => item.type !== CFiltertype.DATE), { type: CFiltertype.DATE, key: dateFilter }]
        )
      }
    }

    addDateToFilter()
  }, [startDate, endDate, openDate])
  return (
    <div className="relative m-2">
      {/* Toggle Button */}
      <Button
        onClick={() => setOpen(!open)}
        variant='text'
        className="font-blue-300"
      >
        <FilterListIcon />
        <Typography>Filters</Typography>
      </Button>
      {/* Sidebar */}
      <Dialog open={open}
      className="w-full"
        // className={`fixed top-0 left-0 h-full w-64
        //   bg-white shadow-lg transform transition-transform 
        //   duration-300 z-40 ${open ? 'translate-x-0' : '-translate-x-full'
        //   }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Typography className="text-lg font-semibold">Filter Options</Typography>
          <Button onClick={() => setOpen(false)}>
            <CloseIcon />
          </Button>
        </div>
        {/* <DialogTitle><Typography className="text-lg font-semibold">Filter Options</Typography></DialogTitle> */}
        <List className="p-2 space-y-2">
          <ListItemButton onClick={() => setOpenStatus((prev) => !prev)}>
            <Typography>Status</Typography>
            {openStatus ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStatus} timeout="auto" unmountOnExit>
            {filters.map((filterKey) => (
              <ListItem key={filterKey[1]}>
                <ListItemButton
                  onClick={() => {
                    setSelected(filterKey[1])
                    setFilter((prev) => [
                      ...prev.filter((filter) => filter.type !== CFiltertype.STATUS),
                      { type: "STATUS", key: filterKey[1] }
                    ])
                  }}
                  className={`w-full h-10 text-left px-4 py-2 rounded ${selected === filterKey[1]
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  {filterKey[1]}
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
          <ListItemButton onClick={() => setOpenDate((prev) => !prev)}>
            <Typography>Date</Typography>
            {openDate ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openDate} timeout="auto" unmountOnExit>
            <div className="space-y-2 mx-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Start Date"
                  value={startDate}
                  format="DD/MM/YYYY"
                  className="w-full"
                  slotProps={{ textField: { size: 'medium' } }}
                  onChange={(value) => handleDateOnChange(value, setStartDate)}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="End Date"
                  value={endDate}
                  format="DD/MM/YYYY"
                  className="w-full"
                  slotProps={{ textField: { size: 'medium' } }}
                  onChange={(value) => handleDateOnChange(value, setEndDate)}
                />
              </LocalizationProvider>
            </div>
          </Collapse>
        </List>
        {/* <Box display="flex" justifyContent="center" gap={2} sx={{ pt: 4 }}>
          <Button color='error'>Cancel</Button>
          <Button variant='contained' color='primary'>Submit</Button>
        </Box> */}
      </Dialog>
    </div >
  );
}