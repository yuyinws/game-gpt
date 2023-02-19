import { serialize, CookieSerializeOptions,parse } from 'cookie'
import { NextApiResponse } from 'next'

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

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000)
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options))
}

export function getCookieByName(name: string) {
  return parse(document.cookie)[name] || null
}

export function removeCookie(name: string) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
