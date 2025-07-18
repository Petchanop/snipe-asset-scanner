import type { paths } from "../../../snipe-it.schema";

export type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false
export type MissingKey<T, K extends PropertyKey> = K extends keyof T ? false : true
export type Notfound = paths["/hardware/bytag/{asset_tag}"]["get"]["responses"]["401"]["content"]["text/plain"]
export type TAsset = paths["/hardware/bytag/{asset_tag}"]["get"]["responses"]["200"]["content"]["application/json"]
export type TUser = paths["/users/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
export type TUserList = paths["/users"]["get"]["responses"]["200"]["content"]["application/json"]
export type TLocations = paths["/locations"]["get"]["responses"]["200"]["content"]["application/json"]
export type TLocation = paths["/locations/{id}"]["get"]["responses"]["200"]["content"]["application/json"]