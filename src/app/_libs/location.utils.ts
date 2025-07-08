import { TLocation } from "@/_types/snipe-it.type";

export function getParentLocation(data: TLocation[]) : TLocation[] {
    return data.filter((loc) =>
        "children" in loc ? (loc.children as TLocation[]).length > 0 : null
    )
}

export function getChildrenLocation(data: TLocation[]) : TLocation[] {
    return data.filter((loc) => loc.parent != null )
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
