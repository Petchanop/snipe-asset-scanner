'use client'

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton
} from '@mui/material';

export default function LoadingTable(){
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a 3-second loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Dummy data for demonstration after loading finishes
  const data = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Row ${i + 1}`,
    col1: `Value ${i + 1}-1`,
    col2: `Value ${i + 1}-2`,
    col3: `Value ${i + 1}-3`,
    col4: `Value ${i + 1}-4`,
  }));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {['ID', 'Name', 'Col1', 'Col2', 'Col3', 'Col4'].map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.col1}</TableCell>
                  <TableCell>{row.col2}</TableCell>
                  <TableCell>{row.col3}</TableCell>
                  <TableCell>{row.col4}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

