'use client'
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
import { useEffect, useState } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{width : number | undefined, height: number | undefined}>({
    width :  undefined,
    height: undefined,
  });

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth as number,
          height: window.innerHeight as number,
        });
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial size

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}

export const LoadingTableSkeleton = () => {
  const media = useWindowSize()
  const rows = Array.from({ length: 5 }); // 5 loading rows
  const columns = Array.from({ length: media.width as number < 500 ? 1 : 5})

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
              {
                columns.map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
