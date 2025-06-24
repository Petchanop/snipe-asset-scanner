import { mockLocation } from "@/_components/tables/mockData";
import NewCountTable from "@/_components/tables/new-count-table";

export default function AssetsTablePage() {

    //fetch data here
    //use mock data before implement api call
    //fetch location from snipe api
    return (
        <NewCountTable locations={mockLocation} />
    )
}