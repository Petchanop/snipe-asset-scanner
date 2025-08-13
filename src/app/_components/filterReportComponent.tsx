import { useState } from 'react';
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
import { Collapse } from '@mui/material';

export default function FilterReportComponent() {
  const filters = Object.keys(ReportState);
  filters.push("ALL")
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [selected, setSelected] = useState('All');

  return (
    <div className="relative m-2">
      {/* Toggle Button */}
      <Button
        onClick={() => setOpen(!open)}
        // className="fixed top-4 left-4
        variant='text'
        className="font-blue-300"
      // className="
      // flex items-center gap-2 bg-blue-300 text-white 
      // px-4 py-2 rounded shadow hover:bg-blue-500 transition"
      >
        <FilterListIcon />
        <span>Filters</span>
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64
          bg-white shadow-lg transform transition-transform 
          duration-300 z-40 ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Filter Options</h2>
          <button onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        <List className="p-2 space-y-2">
          <ListItemButton onClick={() => setOpenStatus((prev) => !prev)}>
            <Typography>Status</Typography>
            {openStatus ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStatus} timeout="auto" unmountOnExit>
            {filters.map((filter) => (
              <ListItem key={filter}>
                <ListItemButton
                  onClick={() => setSelected(filter)}
                  className={`w-full text-left px-4 py-2 rounded ${selected === filter
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  {filter}
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
      </div>
    </div>
  );
}