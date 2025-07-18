import { fetchLocations } from "@/_apis/snipe-it/snipe-it.api";
import CreatePlanComponent from "@/_components/planComponent";
import { getChildrenLocation, getOtherLocation, getParentLocation } from "@/_libs/location.utils";
import { TLocation } from "@/_types/snipe-it.type";

export default async function PlanPage() {
    const locations = await fetchLocations();
    let parentLocation = getParentLocation(locations.data!.rows)
    const childrenLocation = getChildrenLocation(locations.data!.rows)
    const otherLocation = getOtherLocation(locations.data!.rows)
    return (
        <>
            <CreatePlanComponent location={locations.data!.rows}/>
        </>
    )
}