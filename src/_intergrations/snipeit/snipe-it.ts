import { TStatusResponse } from "@/_intergrations/next.api";
import { TAsset } from "@/_types/snipe-it.type";

export type AssetResponse = Exclude<TAsset, TStatusResponse>
export type TArrayResponse<T> = {
    total: number;
    rows:  T[];
}



