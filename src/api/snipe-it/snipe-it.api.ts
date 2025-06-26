
export async function fetchSearchAsset(searchInput: string) {
    let assetData = await fetch(`${process.env.SNIPE_URL}/api/v1/hardware/bytag/${searchInput}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    let asset = await assetData.json();
    console.log(asset)
}