export const STEAM_BASE = 'https://api.steampowered.com'
export const USER_URL = `${STEAM_BASE}/ISteamUser/GetPlayerSummaries/v0002/`
export const STEAM_API_KEY = process.env.STEAM_API_KEY || ''
export const GAME_URL = `${STEAM_BASE}/IPlayerService/GetOwnedGames/v0001/`
export const INFO_URL = `${STEAM_BASE}/api/appdetails`

export const p = '我现在有以下这些游戏，请推荐我一款游玩并说明理由：Grand Theft Auto V, Counter-Strike: Global Offensive, Dota 2, The Witcher 3: Wild Hunt, Rocket League, Playerunknown\'s Battlegrounds, Hollow Knight,Divinity: Original Sin 2, Skyrim, Dark Souls III'
