import { SteamUserInfo } from '@/types'
import { removeCookie } from '@/utils/tools'
import { Button, Avatar, Popover, Text, useTheme } from '@nextui-org/react'
import SunIcon from '../Icon/SunIcon'
import { useState } from 'react'
import style from './Header.module.css'
import MoonIcon from '../Icon/MoonIcon'
import GithubIcon from '../Icon/GithubIcon'
import { useTheme as useNextTheme } from 'next-themes'

export default function Header({
  userInfo,
  getSteamUserInfo,
}: {
  userInfo: SteamUserInfo | null
  getSteamUserInfo: () => void
}) {
  const [disabled, setDisable] = useState(false)
  const { setTheme } = useNextTheme()
  const { isDark } = useTheme()
  async function login() {
    try {
      setDisable(true)
      const response = await fetch('/api/auth/steam')
      const { redirectUrl } = await response.json()
      window.location.replace(redirectUrl)
    } catch (error) {
    } finally {
      setDisable(false)
    }
  }

  function logout() {
    localStorage.removeItem('steam-user-info')
    removeCookie('steam-open-id')
    getSteamUserInfo()
  }

  return (
    <>
      <div className={`${style['header']}`}>
        <div className="flex gap-5">
          <div
            className="w-[24px] h-[24px] cursor-pointer"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? (
              <SunIcon filled fill="var(--nextui-colors-accents6)" />
            ) : (
              <MoonIcon filled fill="var(--nextui-colors-accents6)" />
            )}
          </div>
          <a
            href="https://github.com/yuyinws/game-gpt"
            className="w-[24px] h-[24px]"
          >
            <GithubIcon fill="var(--nextui-colors-accents6)" />
          </a>
        </div>

        <Text className={style['title']}>GameGPT</Text>
        {userInfo ? (
          <Popover isBordered>
            <Popover.Trigger>
              <Avatar
                size="sm"
                color="gradient"
                bordered
                className="cursor-pointer"
                src={userInfo.user.avatarfull}
              />
            </Popover.Trigger>
            <Popover.Content>
              <div className="min-w-[50px] py-[10px] px-[10px]">
                <Text size="$xs">已登录: {userInfo.user.personaname}</Text>
                <Text size="$xs">游戏数: {userInfo.games.count}</Text>
                <Button size="xs" color="error" onPress={logout}>
                  注销
                </Button>
              </div>
            </Popover.Content>
          </Popover>
        ) : (
          <Button
            disabled={disabled}
            onPress={login}
            bordered
            color="gradient"
            size="sm"
            auto
          >
            登录
          </Button>
        )}
      </div>
    </>
  )
}
