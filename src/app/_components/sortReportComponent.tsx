import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ImportExportIcon from '@mui/icons-material/ImportExport'

export default function SortReportComponent() {
  const [open, setOpen] = useState(false);

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
        <ImportExportIcon />
        <span>Sort</span>
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64
          bg-white shadow-lg transform transition-transform 
          duration-300 z-40 ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Sort Options</h2>
          <button onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        <List className="p-2 space-y-2">
           <ListItemButton>
            <Typography>Document no.</Typography>
          </ListItemButton>
          <ListItemButton>
            <Typography>Name</Typography>
          </ListItemButton>
        </List>
      </div>
    </div>
  );
}