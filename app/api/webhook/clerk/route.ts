import { getErrorMessage } from "@/lib/utils";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from 'next/headers'
import { Webhook } from "svix";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

async function validateRequest(request: Request) {
    const payloadString = await request.text();
    const headerPayload = headers();

    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id")!,
        "svix-timestamp": headerPayload.get("svix-timestamp")!,
        "svix-signature": headerPayload.get("svix-signature")!,
    };
    const wh = new Webhook(webhookSecret);
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}


export async function POST(req: Request) {
    try {

        const payload = await validateRequest(req);

        switch (payload.type) {
            case "user.created": {
                const { id } = payload.data
                await db.insert(users).values({ clerkId: id })
                return NextResponse.json({ message: "Successfully created the user" })

            }
            case "user.updated": {
                //TODO: Update user in the database
                return NextResponse.json({ message: "Successfully updated the user" })

            }
            case "user.deleted": {
                const { id } = payload.data
                await db.delete(users).where(eq(users.clerkId, id!));
                return NextResponse.json({ message: "Successfully deleted the user" })
            }
        }


    } catch (error) {

        return NextResponse.error()
    }
}