import { steamAuth } from '@/utils/steamAuth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '@/utils/tools'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { callback } = steamAuth()

  const openid = await callback(req)

  setCookie(res,'steam-open-id', openid,{ path: '/', maxAge: 2592000 })

  res.redirect(302,`/`)
}
