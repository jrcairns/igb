import { FacebookApi } from "@/app/fb";
import { getFacebookAccessToken } from "@/app/fb/token";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    const accessToken = await getFacebookAccessToken(request);

    if (!accessToken) {
        throw new Error("Unable to retrieve access token");
    }

    const api = new FacebookApi(accessToken)

    const accounts = await api.getInstagramBusinessAccounts()

    return Response.json(accounts)
}
