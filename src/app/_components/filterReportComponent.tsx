import { useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

export default function FilterReportComponent() {
  const filters = ['All', 'Active', 'Pending', 'Archived'];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('All');

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        // className="fixed top-4 left-4
        className="
        z-50 flex items-center gap-2 bg-blue-600 text-white 
        px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        <FilterListIcon />
        <span>Filters</span>
      </button>

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

        <ul className="p-4 space-y-2">
          {filters.map((filter) => (
            <li key={filter}>
              <button
                onClick={() => setSelected(filter)}
                className={`w-full text-left px-4 py-2 rounded ${selected === filter
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'hover:bg-gray-100'
                  }`}
              >
                {filter}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}