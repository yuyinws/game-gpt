import { steamAuth } from '@/utils/steamAuth'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { callback } = steamAuth()

  const openid = await callback(req)

  res.redirect(302,`/?openid=${openid}`)
}
