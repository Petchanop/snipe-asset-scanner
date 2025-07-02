import { TLocation } from "@/_types/snipe-it.type";

export function getParentLocation(data: TLocation[]) : TLocation[] {
    return data.filter((loc) =>
        "children" in loc ? (loc.children as TLocation[]).length > 0 : null
    )
}

export function getChildrenLocation(data: TLocation[]) : TLocation[] {
    return data.filter((loc) => loc.parent != null )
}
