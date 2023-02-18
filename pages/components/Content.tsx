import { getRandomElement } from '@/utils/tools'
import { Button, Card } from '@nextui-org/react'
import { GameInfo, GameNameRes, SteamUserInfo } from '../types'
import { $fetch } from 'ofetch'
import { useState } from 'react'

interface Recommend {
  gameInfos: GameInfo[]
  content: string
}

export default function Content({
  userInfo,
}: {
  userInfo: SteamUserInfo | null
}) {
  const [history, setHistory] = useState<string[]>([])
  const [content, setContent] = useState<string>('')

  async function recommend() {
    if (userInfo?.games.appList) {
      const gameIds = getRandomElement(userInfo?.games.appList, 3)
      const { state, gameInfos } = await $fetch<GameNameRes>('/api/id2name', {
        method: 'post',
        body: {
          gameIds,
        },
      })

      if (state === 'ok') {
        // setRecommendList([
        //   ...recommendList,
        //   {
        //     gameInfos,
        //     content: '',
        //   },
        // ])

        const nameString = gameInfos.map((i) => i.name).join(', ')

        const prompt = `我现在有以下这些游戏，请推荐我一款游玩并说明理由：${nameString} .`
        generate(prompt, gameInfos)
      }
    }
  }

  async function generate(prompt: string, gameInfos: GameInfo[]) {
    try {
      const response = await fetch('/api/generator', {
        method: 'post',
        body: JSON.stringify({
          prompt,
        }),
      })
      console.log('🚀 ~ file: Content.tsx:40 ~ generate ~ response', response)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      // This data is a ReadableStream
      const data = response.body
      if (!data) {
        return
      }

      const reader = data.getReader()
      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        setContent((old) => (old += chunkValue))
      }
    } catch (error) {
      console.log('🚀 ~ file: Content.tsx:62 ~ generate ~ error', error)
    }
  }

  return (
    <>
      <div className="flex justify-center my-5 w-full">
        <Button onPress={recommend}>推荐游戏</Button>
      </div>

      {/* <div className="w-[200px]">
        {recommendList.map((item, index) => {
          return <div key={index}>{item}</div>
        })}
      </div> */}
      <div className="flex items-center flex-col gap-5">
        {content ? (
          <Card className="min-w-[200px] max-w-[400px]">
            <Card.Body>{content}</Card.Body>
          </Card>
        ) : (
          ''
        )}

        {/* {[content].map((item, index) => {
          return (
            <Card key={index} className="min-w-[200px] max-w-[400px]">
              <Card.Body>{item}</Card.Body>
            </Card>
          )
        })} */}
      </div>
    </>
  )
}
