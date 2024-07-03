import { auth, clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function getFacebookAccessToken(request?: NextRequest) {
    const { userId } = request ? getAuth(request) : auth()

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const accessTokens = await clerkClient.users?.getUserOauthAccessToken(
        userId,
        'oauth_facebook'
    );

    return accessTokens?.data[0]?.token;
}