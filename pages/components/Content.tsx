import { getRandomElement } from '@/utils/tools'
import { Button, Card, Loading, Text } from '@nextui-org/react'
import { GameInfo, GameNameRes, SteamUserInfo } from '../../types'
import { $fetch } from 'ofetch'
import { useState } from 'react'
import { DEFAULT_APPLIST } from '@/utils/constant'

const allGames: GameInfo[] = []

export default function Content({
  userInfo,
}: {
  userInfo: SteamUserInfo | null
}) {
  const [history, setHistory] = useState<string[]>([])
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function recommend() {
    try {
      setLoading(true)
      let gameIds = []
      if (userInfo?.games.appList) {
        gameIds = getRandomElement(userInfo?.games.appList, 10)
      } else {
        gameIds = getRandomElement(DEFAULT_APPLIST, 10)
      }
      const { state, gameInfos } = await $fetch<GameNameRes>('/api/id2name', {
        method: 'post',
        body: {
          gameIds,
        },
      })

      if (state === 'ok') {
        setHistory((old) => {
          old.unshift(content)
          return old
        })
        const nameString = gameInfos.map((i) => i.name).join(', ')
        allGames.unshift(...gameInfos)
        const prompt = `
          Please answer my question in Simplified Chinese, I have following games ${nameString}. Please recommend one of the best ones to me and explain the reasons. Put the game name in quotes in answer.
          `
        generate(prompt)
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  async function generate(prompt: string) {
    try {
      setContent('')
      const response = await fetch('/api/generator', {
        method: 'post',
        body: JSON.stringify({
          prompt,
        }),
      })

      if (!response.ok) {
        setLoading(false)
        throw new Error(response.statusText)
      }

      // This data is a ReadableStream
      const data = response.body
      if (!data) {
        setLoading(false)
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

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log('🚀 ~ file: Content.tsx:62 ~ generate ~ error', error)
    }
  }

  function toGamePage(content: string) {
    const reg = /(?<=\")(.+?)(?=\")/g
    const gameName = content.match(reg)
    if (gameName) {
      const find = allGames.find((game) => {
        return game.name === gameName[0]
      })

      if (find) {
        const href = `https://store.steampowered.com/app/${find.id}`
        window.open(href, '_blank')
      }
    }
  }

  return (
    <>
      <div className="p-[60px]">
        <div className="flex items-center flex-col gap-5">
          {history.length < 10 ? (
            <div className="flex flex-col gap-3">
              <Button onPress={recommend} color="gradient" disabled={loading}>
                {loading ? (
                  <Loading type="points" color="currentColor" size="sm" />
                ) : (
                  '推荐游戏'
                )}
              </Button>
              {userInfo ? (
                ''
              ) : (
                <Text size="$xs">
                  提示: 登录你的Steam账号以获取更精确的游戏推荐
                </Text>
              )}
            </div>
          ) : (
            ''
          )}
          {[content, ...history].map((item, index) => {
            if (item) {
              return (
                <Card
                  isPressable
                  isHoverable
                  variant="bordered"
                  key={index}
                  onPress={() => {
                    toGamePage(item)
                  }}
                  className="min-w-[200px] max-w-[400px]"
                >
                  <Card.Body>{item}</Card.Body>
                </Card>
              )
            }
          })}
        </div>
      </div>
    </>
  )
}
