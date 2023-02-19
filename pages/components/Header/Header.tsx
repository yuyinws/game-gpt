import { SteamUserInfo } from '@/types'
import { removeCookie } from '@/utils/tools'
import { Button, Avatar, Popover, Text, useTheme } from '@nextui-org/react'
import { SunIcon } from '../Icon/SunIcon'
import { useState } from 'react'
import style from './Header.module.css'
import { MoonIcon } from '../Icon/MoonIcon'
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

        {/* <a href="" className="w-[24px] h-[24px]">
          <svg
            className={style['fill']}
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a> */}
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
