'use server'
import { getAssetCountLineByAssetCount, getAssetCountReport } from "@/_libs/report.utils";
import { readFileSync } from "fs"
import * as XLSX from 'xlsx'
import { NextRequest } from "next/server";
import { AssetCountWithLineAndLocation } from "@/_types/interfaces";
import path from "path";
import { fetchLocations } from "@/api/snipe-it/snipe-it.api";
import { GetAllUserPrisma } from "@/api/report.api";

export async function GET(
    request: NextRequest,
    { params }: { params: { reportId: string } }
) {
    try {
        const { reportId } = await params
        if (!reportId) throw new Error('Report id required')
        const assetCountReport = await getAssetCountReport(parseInt(reportId), true) as AssetCountWithLineAndLocation
        const workbook = XLSX.utils.book_new()
        const filePath = path.join(process.cwd(), 'src/app/api/[reportId]/Asset_Report.xlsx')
        const buff = readFileSync(filePath)
        const readWorkBook = XLSX.read(buff)
        const sheetName = readWorkBook.SheetNames[0]
        const sheetData = readWorkBook.Sheets[sheetName as string] as XLSX.WorkSheet
        const modifiedDataSheet = await CreateAssetCountReportFile(assetCountReport, sheetData)
        XLSX.utils.book_append_sheet(workbook, modifiedDataSheet, assetCountReport?.document_name as string)
        const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
        // return new Response( JSON.stringify(readWorkBook.Sheets[sheetName as string], null, 2), {
        //     status: 200,
        //     headers: {
        //         'Content-Disposition' : 'inline',
        //         'Content-type' : `application/json`
        //     }
        // })
        return new Response(excelBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${assetCountReport?.document_name}.xlsx"`,
                'Content-Type': 'application/vnd.ms-excel'
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
    assetCountReport: AssetCountWithLineAndLocation, dataSheet: XLSX.WorkSheet): Promise<XLSX.WorkSheet> {

    XLSX.utils.sheet_add_aoa(dataSheet, [[assetCountReport.document_number]], { origin: "B5" })
    XLSX.utils.sheet_add_aoa(dataSheet, [[assetCountReport.document_date.toLocaleDateString('th-BK')]], { origin: "B6" })
    let assetQuantity = 0
    let assetCodeCol = 12
    let i = 0
    const users = await GetAllUserPrisma()
    const locations = await fetchLocations();
    for (let j = 0; j < assetCountReport.AssetCountLocation.length; j++) {
        let location = assetCountReport.AssetCountLocation[j]
        let assetCountLine = await getAssetCountLineByAssetCount(assetCountReport.id, location!.id)
        let getLocation = locations.data?.rows.find((loc) => loc.id == location?.location_id)
        assetQuantity += assetCountLine.length
        for (const countLine of assetCountLine) {
            let getUser = users.find((user) => user.id == countLine.assigned_to)
            let countCheck = countLine.asset_check ? "Yes" : "No"
            let assingedInCorrect = countLine.is_assigned_incorrectly ? "Yes" : "No"
            XLSX.utils.sheet_add_aoa(dataSheet, [[i + 1]], { origin: `A${assetCodeCol}` })
            XLSX.utils.sheet_add_aoa(dataSheet, [[countLine.asset_code]], { origin: `B${assetCodeCol}` })
            XLSX.utils.sheet_add_aoa(dataSheet, [[countLine.asset_name]], { origin: `C${assetCodeCol}` })
            XLSX.utils.sheet_add_aoa(dataSheet, [[`${getUser?.first_name}  ${getUser?.last_name}`]], { origin: `D${assetCodeCol}` })
            XLSX.utils.sheet_add_aoa(dataSheet, [[countCheck]], { origin: `E${assetCodeCol}` })
            XLSX.utils.sheet_add_aoa(dataSheet, [[assingedInCorrect]], { origin: `F${assetCodeCol}` })
            XLSX.utils.sheet_add_aoa(dataSheet, [[countLine.asset_count_line_status_id]], { origin: `G${assetCodeCol}` })
            XLSX.utils.sheet_add_aoa(dataSheet, [[getLocation!.name]], { origin: `H${assetCodeCol}` })
            assetCodeCol += 1
            i++
        }
    }
    XLSX.utils.sheet_add_aoa(dataSheet, [[assetQuantity]], { origin: "B9" })
    // console.log(dataSheet)
    return dataSheet
}