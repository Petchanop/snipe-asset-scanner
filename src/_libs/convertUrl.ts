export function ConvertImageUrl(connectUrl: string, url : string) : string | null {
    const index = connectUrl?.indexOf("/api/v1")
    const baseUrl = connectUrl?.slice(0, index)
    if (url) {
        const uploadPathIndex = url.indexOf("/uploads")
        const baseUpload = uploadPathIndex != -1 ? url.slice(uploadPathIndex, url.length) : url
        return baseUrl + baseUpload
    }
    return null
}