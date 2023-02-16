import { steamAuth } from '@/utils/steamAuth'
import type { NextApiRequest, NextApiResponse } from 'next'

// export default defineEventHandler(async (event) => {
//   const { callback } = steamAuth()

//   const openid = await callback(event.node.req)

//   await sendRedirect(event, `/?openid=${openid}`, 302)
// })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { callback } = steamAuth()

  const openid = await callback(req)

  res.redirect(302,`/?openid=${openid}`)
}
