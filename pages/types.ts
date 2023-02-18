export interface SteamUserInfo {
  user: {
    avatarfull: string
    personaname: string
  },
  games: {
    count: number,
    appList: string[]
  }
}

type State = 'ok' | 'fail'

export type GameInfo = {
  id: string
  name: string
}

export interface GameNameRes {
  state: State,
  gameInfos: GameInfo[]
}
