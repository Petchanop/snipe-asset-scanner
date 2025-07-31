'use server'
import { getAssetCountLineByAssetCount, getAssetCountReport } from "@/_libs/report.utils";
import * as Excel from 'exceljs'
import { NextRequest } from "next/server";
import { AssetCountWithLineAndLocation } from "@/_types/interfaces";
import path from "path";
import { fetchLocations } from "@/api/snipe-it/snipe-it.api";
import { GetAllUserPrisma } from "@/api/report.api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ reportId: string }> }
) {
    try {
        const { reportId } = await params
        if (!reportId) throw new Error('Report id required')
        const assetCountReport = await getAssetCountReport(parseInt(reportId), true) as AssetCountWithLineAndLocation
        const filePath = path.join(process.cwd(), 'src/app/api/[reportId]/Asset_Report_edit.xlsx')
        const newWorkBook = new Excel.Workbook();
        await newWorkBook.xlsx.readFile(filePath)
        const sheet = newWorkBook.getWorksheet(1)
        // console.log(sheet)
        if (!sheet)
            return
        await CreateAssetCountReportFile(assetCountReport, sheet)
        const newbuffer = await newWorkBook.xlsx.writeBuffer()
        const filename = encodeURIComponent(`${assetCountReport?.document_name}.xlsx`)
        return new Response(newbuffer, {
            status: 200,
            headers: {
                'Content-Disposition': "attachment; filename=" + filename,
                'Content-Type': 'application/vnd.ms-excel; charset=utf-8'
            }
        })
    } catch (e) {
        if (e instanceof Error) {
            return new Response(e.message, {
                status: 400
            })
        }
    }
}

async function CreateAssetCountReportFile(
    assetCountReport: AssetCountWithLineAndLocation, dataSheet: Excel.Worksheet): Promise<Excel.Worksheet> {

    dataSheet.getCell(`B5`).alignment = { horizontal: 'left', vertical: 'middle' }
    dataSheet.getCell(`B9`).alignment = { horizontal: 'left', vertical: 'middle' }
    dataSheet.getCell(`B5`).value = assetCountReport.document_number
    dataSheet.getCell(`B6`).value = assetCountReport.document_date.toLocaleDateString('th-BK')
    dataSheet.getColumn(1).width = 15
    dataSheet.getColumn(2).width = 30
    dataSheet.getColumn(3).width = 55
    dataSheet.getColumn(4).width = 30
    dataSheet.getColumn(8).width = 40
    let assetQuantity = 0
    let assetCodeCol = 12
    let i = 0
    const users = await GetAllUserPrisma()
    const locations = await fetchLocations();
    let locationData = ""

    for (let j = 0; j < assetCountReport.AssetCountLocation.length; j++) {
        const location = assetCountReport.AssetCountLocation[j]
        const assetCountLine = await getAssetCountLineByAssetCount(assetCountReport.id, location!.id)
        const getLocation = locations.data?.rows.find((loc) => loc.id == location?.location_id)
        locationData += getLocation?.name
        if (j < assetCountReport.AssetCountLocation.length - 1)
            locationData += '/'
        assetQuantity += assetCountLine.length
        for (const countLine of assetCountLine) {
            const getUser = users.find((user) => user.id == countLine.assigned_to)
            const countCheck = countLine.asset_check ? "Yes" : "No"
            const assingedInCorrect = countLine.is_assigned_incorrectly ? "Yes" : "No"
            dataSheet.getCell(`A${assetCodeCol}`).value = i + 1
            dataSheet.getCell(`B${assetCodeCol}`).value = countLine.asset_code
            dataSheet.getCell(`C${assetCodeCol}`).value = countLine.asset_name
            dataSheet.getCell(`D${assetCodeCol}`).value = `${getUser?.first_name}  ${getUser?.last_name}`
            dataSheet.getCell(`E${assetCodeCol}`).value = countCheck
            dataSheet.getCell(`F${assetCodeCol}`).value = assingedInCorrect
            dataSheet.getCell(`G${assetCodeCol}`).value = countLine.asset_count_line_status_id
            dataSheet.getCell(`H${assetCodeCol}`).value = getLocation!.name
            createBorder(dataSheet, assetCodeCol)
            assetCodeCol += 1
            i++
        }
    }
    dataSheet.getCell(`B8`).value = locationData
    dataSheet.getCell(`B9`).value = assetQuantity
    // dataSheet['!cols'] = [ { wch: 15}, { wch: 25}, { wch: 50}, { wch: 25}, { wch: 12}, { wch: 12}, { wch: 12}, { wch: 25}] 
    return dataSheet
}

function createBorder(sheet: Excel.Worksheet, assetCodeCol: number) {
    const char = 'A'
    const ascii = char.charCodeAt(0)
    const row = sheet.getRow(assetCodeCol)
    row.height = 30

    for (let i = 0; i < 8; i++) {
        const sumAscii = ascii + i
        const cell = String.fromCharCode(sumAscii) + `${assetCodeCol}`
        const cellObj = sheet.getCell(`${cell}`)
        cellObj.font = { name: 'Aptos Narrow', size: 11 }
        cellObj.alignment = { horizontal: 'center', vertical: 'middle' }
        cellObj.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    }
}