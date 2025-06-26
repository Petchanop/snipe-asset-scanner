'use client'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

export default function ScannerComponent() {
    const [scanData, setScanData] = useState<IDetectedBarcode[]>()
    return (
        <>
            <Scanner onScan={(result) => setScanData(result)} sound />
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