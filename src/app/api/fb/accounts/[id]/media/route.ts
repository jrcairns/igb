import { FacebookApi } from "@/app/fb";
import { getFacebookAccessToken } from "@/app/fb/token";
import { NextRequest } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id

    const accessToken = await getFacebookAccessToken(request);

    if (!accessToken) {
        throw new Error("Unable to retrieve access token");
    }

    const api = new FacebookApi(accessToken)

    const media = await api.getMediaByInstagramBusinessAccountId({
        instagramAccountId: id
    })

    return Response.json(media)
}
