'use server'
export async function ConvertImageUrl(url : string) : Promise<string | null> {
    const connectUrl = process.env.SNIPE_URL 
    const index = connectUrl?.indexOf("/api/v1")
    const baseUrl = connectUrl?.slice(0, index)
    if (url) {
        const uploadPathIndex = url.indexOf("/uploads")
        const baseUpload = uploadPathIndex != -1 ? url.slice(uploadPathIndex, url.length) : url
        return baseUrl + baseUpload
    }
    return null
}