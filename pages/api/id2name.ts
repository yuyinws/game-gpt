import { id2Name } from '@/utils/id2name'
import type { NextApiRequest, NextApiResponse } from 'next'
import { GameInfo, GameNameRes } from '../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameNameRes>
) {

  try {
    const { gameIds } = req.body

    const gameInfos:GameInfo[] = await Promise.all(gameIds.map(async (item: string) => {
      const name = await id2Name(item)
      return {
        name,
        id: item
      }
    }))
  
    return res.json({
      state: 'ok',
      gameInfos
    })
  } catch (error) {
    
  }


}
