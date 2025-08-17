import { Dispatch, SetStateAction, useState, MouseEvent, MouseEventHandler } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ImportExportIcon from '@mui/icons-material/ImportExport'
import { Order } from '@/_components/tables/utility';
import { AssetCount } from '@/_types/types';

export default function SortReportComponent(
  props: {
    order: Order,
    orderBy: keyof AssetCount,
    setOrder: Dispatch<SetStateAction<Order>>,
    setOrderBy: Dispatch<SetStateAction<keyof AssetCount>>,
  }) {
  const { order, orderBy, setOrder, setOrderBy} = props
  const [open, setOpen] = useState(false);

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof AssetCount
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property: keyof AssetCount) => (event: MouseEvent<unknown>) => {
    handleRequestSort(event, property)
  }

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
          <ListItemButton onClick={createSortHandler("document_number")}>
            <Typography>Document no.</Typography>
          </ListItemButton>
          <ListItemButton onClick={createSortHandler("document_name")}>
            <Typography>Name</Typography>
          </ListItemButton>
          <ListItemButton onClick={createSortHandler("document_date")}>
            <Typography>Date</Typography>
          </ListItemButton>
           <ListItemButton onClick={createSortHandler("state")}>
            <Typography>Date</Typography>
          </ListItemButton>
        </List>
      </div>
    </div>
  );
}