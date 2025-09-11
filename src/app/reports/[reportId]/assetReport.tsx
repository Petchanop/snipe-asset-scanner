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
import { decode } from 'html-entities'
import { useWindowSize } from '@/_components/loading';

export type TReportData = {
  assetNotCheck : number,
  assetAdditional: number,
  assetAssignedIncorrect: number,
  assetMalFunction: number
}

export default function AssetReport(
  props: {
    assetCountReport: AssetCountWithLineAndLocation,
    locations: TLocation[],
    assetCountLine: AssetCountLine[],
    user: User,
    listOfUser: User[],
    reportData: TReportData
  }) {
  const { assetCountReport, locations, assetCountLine, listOfUser, reportData } = props
  const { document_name, document_number, document_date } = assetCountReport
  const windowSize = useWindowSize()
  let reportLocation = ""
  for (const location of locations) {
    reportLocation += decode(location.name)
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

  const sortAssetCountLine = assetCountLine.sort((a, b) =>
    getLocation(b?.asset_count_line_location_id!, locations).localeCompare(getLocation(a?.asset_count_line_location_id!, locations)))
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
          maxHeight: '5rem'
        }}
          variant={windowSize.width as number > 500 ? "contained" : "text"}
        >
          {
            windowSize.width as number > 500 ?
              <Typography sx={{ fontSize: '1.5rem' }}>
                Download
              </Typography>
              : <DownloadIcon sx={{ fontSize: '2.5rem', color: blue[400] }} />
          }
        </Button>

      </div>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        CITITEX Group
      </Typography>
      <Typography variant="h6" gutterBottom>
        Asset Count Report
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography><strong>Document name:</strong> {document_name}</Typography>
        <Typography><strong>Document No:</strong> {document_number} </Typography>
        <Typography><strong>Date Count:</strong> {document_date.toLocaleDateString('th-BK')} </Typography>
        <Typography><strong>Asset Check Name:</strong> {getUser(assetCountReport.created_by!)} </Typography>
        <Typography><strong>Location:</strong> {reportLocation} </Typography>
        <Typography><strong>ทรัพย์สินในระบบทั้งหมด:</strong> {assetCountLine.length} </Typography>
        <Typography><strong>ทรัพย์สินที่ไม่พบ:</strong> {reportData.assetNotCheck} </Typography>
        <Typography><strong>ทรัพย์สินที่พบเพิ่มเติม:</strong> {reportData.assetAdditional} </Typography>
        <Typography><strong>ทรัพย์สินที่ผู้ครอบครองไม่ถูกต้อง:</strong> {reportData.assetAssignedIncorrect} </Typography>
        <Typography><strong>ทรัพย์สินชำรุด:</strong> {reportData.assetMalFunction} </Typography>
      </Box>

      <Table stickyHeader sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Asset Code</TableCell>
            <TableCell>Asset Name</TableCell>
            <TableCell>ผู้ถือครอง</TableCell>
            <TableCell align='center'>ตรวจพบ</TableCell>
            <TableCell align='center'>ผู้ครอบครองไม่ถูกต้อง</TableCell>
            <TableCell align='center'>ชำรุด</TableCell>
            <TableCell>สถานที่</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortAssetCountLine.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.asset_code}</TableCell>
              <TableCell>{decode(row.asset_name)}</TableCell>
              <TableCell>{getUser(row.assigned_to!)}</TableCell>
              <TableCell align='center'>
                <Typography sx={{ fontSize: 20 }}>
                  {row.asset_check ? "\u2713" : ""}
                </Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography sx={{ fontSize: 20 }}>
                  {row.is_assigned_incorrectly ? "\u2713" : ""}
                </Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography sx={{ fontSize: 20 }}>
                  {row.asset_count_line_status_id == AssetStatusEnum.MALFUNCTIONING ? "\u2713" : ""}
                </Typography>
              </TableCell>
              <TableCell>{getLocation(row.asset_count_line_location_id!, locations)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}