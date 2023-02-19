import Head from 'next/head'
import Header from './components/Header/Header'
import Content from './components/Content'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { $fetch } from 'ofetch'
import { SteamUserInfo } from '../types'
import { getCookieByName } from '@/utils/tools'

export default function Home() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<null | SteamUserInfo>(null)

  async function getSteamUserInfo() {
    const steamUserInfo = window.localStorage.getItem('steam-user-info')
    const steamOpenId = getCookieByName('steam-open-id')
    if (steamOpenId && !steamUserInfo) {
      const response = await $fetch('/api/info/steam', {
        params: {
          openid: steamOpenId,
        },
      })

      if (response.state === 'ok') {
      }
      window.localStorage.setItem('steam-user-info', JSON.stringify(response))
      getSteamUserInfo()
    } else if (steamUserInfo) {
      setUserInfo(JSON.parse(steamUserInfo))
    } else {
      setUserInfo(null)
    }
  }

  useEffect(() => {
    getSteamUserInfo()
  }, [router])

  return (
    <>
      <Head>
        <title>GameGPT</title>
        <meta name="description" content="Get game play advice from ChatGPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg" href="/favicon.svg" />
      </Head>
      <main>
        <Header userInfo={userInfo} getSteamUserInfo={getSteamUserInfo} />
        <Content userInfo={userInfo} />
      </main>
    </>
  )
}
