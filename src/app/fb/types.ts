export type InstagramBusinessAccount = {
    id: string;
    name: string;
    username: string;
}

export type InstagramMedia = {
    id: string;
    media_url: string;
}

export type InstagramBusinessAccountWithMedia = InstagramBusinessAccount & {
    media: InstagramMedia[]
}