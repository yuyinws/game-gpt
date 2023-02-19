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

  async function recommend(type: 'library' | 'random' | 'time') {
    try {
      setLoading(true)
      let gameIds: string[] = []
      if (type === 'library') {
        gameIds = getRandomElement(userInfo!.games.appList, 10)
      } else if (type === 'random') {
        gameIds = getRandomElement(DEFAULT_APPLIST, 10)
      } else if (type === 'time') {
        gameIds = getRandomElement(userInfo!.games.appList.slice(0, 20), 5)
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

        if (type === 'library') allGames.unshift(...gameInfos)

        let prompt = ''

        if (type === 'library' || type === 'random') {
          prompt = `Please answer my question in Simplified Chinese, I have following games: ${nameString}. Please recommend one of the best ones to me and explain the reasons. Put the game name in quotes in answer.`
        } else if (type === 'time') {
          prompt = `Please answer my question in Simplified Chinese, These are my favorite games: ${nameString}. Please recommend a new game for me and explain the reasons according to them.`
        }

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
      <div className="px-[20px] py-[60px]">
        <div className="flex items-center flex-col gap-5">
          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              shadow
              onPress={() => recommend('random')}
              color="gradient"
              disabled={loading}
            >
              {loading ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                '随机推荐'
              )}
            </Button>
            <Button
              shadow
              onPress={() => recommend('library')}
              color="gradient"
              disabled={!userInfo || loading}
            >
              {loading ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                '从库存推荐'
              )}
            </Button>
            <Button
              shadow
              onPress={() => recommend('time')}
              color="gradient"
              disabled={!userInfo || loading}
            >
              {loading ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                '根据游玩时长推荐'
              )}
            </Button>
          </div>

          {userInfo ? (
            ''
          ) : (
            <Text size="$xs">
              提示: 登录你的Steam账号以获取更多的游戏推荐类型
            </Text>
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
