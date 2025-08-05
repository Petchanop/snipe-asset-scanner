'use client'

import { AssetStatusEnum } from '@/_constants/constants';
import { AssetCountWithLineAndLocation } from '@/_types/interfaces';
import { TLocation } from '@/_types/snipe-it.type';
import { AssetCountLine, User } from '@/_types/types';
import cititexLogo from '@/public/cititexlogo.png'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import DownloadIcon from '@mui/icons-material/Download';
import { blue } from '@mui/material/colors';

export default function AssetReport(
  props: {
    assetCountReport: AssetCountWithLineAndLocation,
    locations: TLocation[],
    assetCountLine: AssetCountLine[],
    user: User,
    listOfUser: User[]
  }) {
  const { assetCountReport, locations, assetCountLine, listOfUser } = props
  const { document_number, document_date } = assetCountReport
  let reportLocation = ""
  for (const location of locations) {
    reportLocation += location.name
    if (location != locations[locations.length - 1])
      reportLocation += '/'
  }

  function getUser(userId: number): string {
    const user = listOfUser.find((user) => user.id == userId)
    return user ? user?.first_name + ' ' + user?.last_name : ""
  }

  function getLocation(locationId: string, LocationList: TLocation[]): string {
    const location = LocationList.find((loc) => loc.loc_id == locationId) as TLocation
    return location ? location.name as unknown as string : ''
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex flex-row justify-between">
        <Image
          src={cititexLogo}
          alt="cititex logo"
          width={300}
          height={100}
        ></Image>
        <Button href={`/api/${document_number}`} sx={{
          maxHeight: '3rem'
        }}><DownloadIcon sx={{ color: blue[400] }}/></Button>
        
      </div>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        CITITEX Group
      </Typography>
      <Typography variant="h6" gutterBottom>
        Asset Count Report
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography><strong>Document No:</strong> {document_number} </Typography>
        <Typography><strong>Date Count:</strong> {document_date.toLocaleDateString('th-BK')} </Typography>
        <Typography><strong>Asset Check Name:</strong> {getUser(assetCountReport.created_by!)} </Typography>
        <Typography><strong>Location:</strong> {reportLocation} </Typography>
        <Typography><strong>Asset Count:</strong> {assetCountLine.length} </Typography>
      </Box>

      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Asset Code</TableCell>
            <TableCell>Asset Name</TableCell>
            <TableCell>Assign Name</TableCell>
            <TableCell>Count Check</TableCell>
            <TableCell>Assign Not Correct</TableCell>
            <TableCell>Asset Damaged</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assetCountLine.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.asset_code}</TableCell>
              <TableCell>{row.asset_name}</TableCell>
              <TableCell>{getUser(row.assigned_to!)}</TableCell>
              <TableCell>{row.asset_check ? "Yes" : "No"}</TableCell>
              <TableCell>{row.is_assigned_incorrectly ? "Yes" : "No"}</TableCell>
              <TableCell>{row.asset_count_line_status_id == AssetStatusEnum.MALFUNCTIONING ? "Yes" : "No"}</TableCell>
              <TableCell>{getLocation(row.asset_count_line_location_id!, locations)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}