export enum CommandsEnum {
    configurar,
    verConfigurações
}

export interface TwitchApiUrlProps {
    isLive: boolean
    message: string
    streamData: StreamDataProps
}

export interface StreamDataProps {
    id: string
    user_id: string
    user_login: string
    user_name: string
    game_id: string
    game_name: string
    type: string
    title: string
    viewer_count: number
    started_at: Date
    language: string
    thumbnail_url: string
    tag_ids: any[]
    tags: string[]
    is_mature: string
}
