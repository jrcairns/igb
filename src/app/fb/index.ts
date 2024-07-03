import { FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { InstagramBusinessAccount, InstagramMedia } from "./types";

type Get<T = {}> = {
    fields?: string;
} & T;

type GetInstagramBusinessAccountWithMediaResponse = {
    data: {
        instagram_business_account: {
            id: string;
            name: string;
            username: string;
            media: {
                data: {
                    id: string;
                    media_url: string;
                }[]
            }
        }
    }[]
}

export class FacebookApi extends FacebookAdsApi {
    constructor(accessToken: string) {
        super(accessToken);
    }

    async getInstagramBusinessAccounts({
        fields = 'id,name,username,profile_picture_url'
    }: Get = {}) {
        const { data }: {
            data: {
                instagram_business_account: InstagramBusinessAccount;
            }[]
        } = await this.call('GET', ['me/accounts'], {
            fields: [`instagram_business_account{${fields}}`]
        });

        return data.map(account => ({ ...account.instagram_business_account }));
    }

    async getMediaByInstagramBusinessAccountId({
        instagramAccountId,
        fields = 'id,media_url'
    }: Get<{ instagramAccountId: string; }>) {
        const { media }: {
            media: {
                data: InstagramMedia[]
            }
        } = await this.call('GET', [instagramAccountId], {
            fields: [`media{${fields}}`]
        });

        return media.data;
    }

    async getDefaultInstagramBusinessAccountWithMedia({
        fields = 'id,name,username,profile_picture_url,media{id,media_url}'
    }: Get = {}) {
        const response: GetInstagramBusinessAccountWithMediaResponse = await this.call('GET', ['me/accounts'], {
            fields: [`instagram_business_account{${fields}}`]
        });

        const defaultAccount = {
            ...response.data[0]?.instagram_business_account,
            media: [...(response.data[0]?.instagram_business_account.media.data || [])]
        };

        return defaultAccount;
    }
}