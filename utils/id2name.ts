export function id2Name(id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(`https://store.steampowered.com/api/appdetails?appids=${id}`,).then((response:any) => {
      return response.json()
    }).then(data => {
      resolve(data[id]['data']['name'])
    }).catch(err => reject(err))
  })
}
