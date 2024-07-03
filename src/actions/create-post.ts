import { db } from "@/server/db";
import { posts as postsSchema } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function createPost(posts: any) {
    const user = await currentUser()

    await db.insert(postsSchema).values(posts.map(post => ({
        externalAccountId: user?.id,
        mediaId: post.id,
        caption: post.caption,
        mediaUrl: post.medial_url,
        permalink: post.permalink,
    })))
}