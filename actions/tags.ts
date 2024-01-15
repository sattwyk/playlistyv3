'use server'

import { tags, userTags, selectTagSchema } from "@/db/schema"
import { db } from "@/db"
import { getErrorMessage } from "@/utils"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export async function getUserTags() {
    console.log('getUserTags: Function called');
    try {
        const user = auth();
        console.log('getUserTags: User authenticated');
        const clerkId = user.userId;

        if (!clerkId) {
            console.log('getUserTags: No clerkId found, redirecting to sign-in');
            return redirect("/sign-in");
        }

        console.log(`getUserTags: Fetching tags for clerkId: ${clerkId}`);
        const user_tags = await db.select({
            tagId: tags.tagId,
            title: tags.title,
            color: tags.color
        })
            .from(userTags)
            .leftJoin(tags, eq(userTags.tagId, tags.tagId))
            .where(eq(userTags.clerkId, clerkId)).all();

        console.log(`getUserTags: Retrieved ${user_tags.length} tags for clerkId: ${clerkId}`);
        const safeUserTags = user_tags.map((tag) => selectTagSchema.parse(tag));

        console.log('getUserTags: Tags parsed successfully');
        return safeUserTags;

    } catch (error) {
        console.error(`getUserTags: Error occurred - ${getErrorMessage(error)}`);
        return null;
    }
}

