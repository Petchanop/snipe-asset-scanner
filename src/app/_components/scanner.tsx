'use client'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { Dispatch, SetStateAction } from 'react';

export default function ScannerComponent(
  props: {
    scanData: IDetectedBarcode[],
    setScanData: Dispatch<SetStateAction<IDetectedBarcode[]>>
  }
) {
  const { scanData, setScanData } = props

  return (
    <>
      <Scanner 
      allowMultiple={true}
      onScan={(result) => setScanData(result)} sound
      components={{
        zoom:true
      }}  
      />
      {
        scanData ?
          scanData.map((data) =>
            <Alert key={`${data.format}-${data.rawValue}`} icon={<CheckIcon fontSize="inherit" />} severity="success">
              {data.rawValue}
            </Alert>
          )
          : <></>
      }
    </>
  )
}