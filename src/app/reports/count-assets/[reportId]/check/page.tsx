import SearchAsset from "@/_components/tables/search-asset"
import { getAssetCountLineByAssetCount } from "@/_repositories/assetCountLine"
import { GetAllUserPrisma } from "@/_repositories/user"
import { notFound } from "next/navigation"
import { getSession } from "auth"
import { getAssetCountByDocumentNumber } from "@/_repositories/assetCount"

export default async function CheckAssetPage(
  { params, searchParams }: {
    params: Promise<{ reportId: string }>,
    searchParams: Promise<{ location?: number }>
  },
) {
  const { reportId } = await params
  const { location } = await searchParams
  const resolveLocationId = await location
  const documentNumber = await reportId
  const session = await getSession()
  //fetch data here
  //use mock data before implement api cal
  //fetch location from snipe api
  const assetCountReport = await getAssetCountByDocumentNumber(documentNumber)
  if (!assetCountReport)
    return notFound()
  const locationId = assetCountReport.AssetCountLocation.find((loc) => loc.location_id == resolveLocationId)
  const assetInReport = await getAssetCountLineByAssetCount(assetCountReport!.id!, locationId?.id as string)
  const users = await GetAllUserPrisma()
  return (
    <div className="p-4">
      {locationId && (
        <SearchAsset
          assetCountReport={assetCountReport!}
          assetInReport={assetInReport}
          locationId={locationId}
          users={users}
          user={session.user}
        />
      )}
    </div>
  )
}