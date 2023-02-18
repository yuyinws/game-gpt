import type { NextApiRequest, NextApiResponse } from 'next'
import { $fetch } from 'ofetch'
import { GAME_URL, STEAM_API_KEY, USER_URL } from '@/utils/constant'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { openid } = req.query

    const userInfoReq = $fetch(USER_URL, {
      params: {
        key: STEAM_API_KEY,
        steamids: openid,
      },
    })

    const gamesReq = await $fetch(GAME_URL, {

      params: {
        key: STEAM_API_KEY,
        steamid: openid,
        format: 'json',
      },
    })

    const [userRes, gameRes] = await Promise.all([userInfoReq, gamesReq])

    return res.json({
      state: 'ok',
      user: userRes.response.players[0],
      games: {
        appList: gameRes.response.games.map((i:any) => i.appid),
        count: gameRes.response.game_count
      },
    })
  } catch (error) {
    return res.json({
      state: 'fail',
    })
  }
  // const a = await id2Name('400')
  // console.log("🚀 ~ file: steam.ts:9 ~ a", a)
  // return res.json(a)

  // return res.json(req.name)
}
