import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Write submission to Firestore contacts collection
        await db.collection("contacts").add({
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to save contact message:", error);
        return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
    }
}
