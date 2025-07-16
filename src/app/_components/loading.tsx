import Skeleton from "@mui/material/Skeleton";

export function LoadingSkeleton() {

  return (
    <>
      <Skeleton className='w-screen h-screen lg:w-4/6 lg:h-3/4 absolute lg:top-22' />
    </>
  )
}

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { blue } from "@mui/material/colors";

export const LoadingTableSkeleton = () => {
  const rows = Array.from({ length: 5 }); // 5 loading rows

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody
          sx={{
            minWidth: 650,
            border: 'solid',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            borderWidth: 1,
            borderColor: blue[400]
          }}
        >
          {rows.map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
