import { TLocation } from "@/_types/snipe-it.type";
import { createGateway } from "@/_apis/next.api";

export function getParentLocation(data: TLocation[]) : TLocation[] {
    return data.filter((loc) =>
        "children" in loc ? (loc.children as TLocation[]).length > 0 : null
    )
}

export async function getLocationById(id: number) : Promise<Location | null> {
    const client = await createGateway();
    const { data, error } = await client.GET(`/locations/{id}`, {
        params: {
            path: { id: id }
        }
    })
    if (error) {
        return null;
    }
    return data as unknown as Location;
}

export function getChildrenLocation(data: TLocation[]) : TLocation[] {
    return data.filter((loc) => loc.parent != null )
}

export function getOtherLocation(data: TLocation[]) : TLocation[] {
    return data.filter((loc) => loc.parent == null && !(loc.children as unknown as string[]).length )
}

export function getParentFromChildId(childLocation: TLocation[], id: number): TLocation{
    return childLocation.find((loc) => loc.id == id)?.parent!
}

export function checkSamePathName(navigateTo: string, path: string) : boolean {
    const stripSearchParams = navigateTo.split('?')
    return stripSearchParams.find((splitPath) => splitPath === path) ? true : false
}

export function checkTabPathname(pathname: string) : boolean {
    return !pathname.includes('check')
}
