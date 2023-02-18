export function getRandomElement (arr:string[],max: number): string[] {
  if (arr.length <= max) {
    return arr
  } else {
    const arrs:Set<string> = new Set()

    while(arrs.size < max) {
      const index = Math.floor(Math.random() * arr.length)
      arrs.add(arr[index])
    }

    return [...arrs]
  }
}
