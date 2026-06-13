import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { verifyAuth, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    if (!(await verifyAuth())) return unauthorized();

    try {
        const snapshot = await db.collection("contacts").orderBy("createdAt", "desc").get();
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!(await verifyAuth())) return unauthorized();

    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
        }

        await db.collection("contacts").doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
}
