import { SteamUserInfo } from '@/types'
import { Button, Avatar, Popover, Text } from '@nextui-org/react'
import { useState } from 'react'
import style from './Header.module.css'

export default function Header({
  userInfo,
}: {
  userInfo: SteamUserInfo | null
}) {
  const [disabled, setDisable] = useState(false)
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

  return (
    <>
      <div className="flex items-center h-[45px] shadow w-full justify-between px-4">
        <img src="/github.svg" width="24" height="24" alt="" />
        <div className={style['title']}>GameGPT</div>
        {userInfo ? (
          <Popover>
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
              <Text css={{ p: '$10' }}>
                This is the content of the popover.
              </Text>
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
