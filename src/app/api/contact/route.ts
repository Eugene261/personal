import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        // 1. Write submission to Firestore contacts collection
        await db.collection("contacts").add({
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
            createdAt: new Date().toISOString(),
        });

        // 2. Send Email Notification if RESEND_API_KEY is configured
        const resendKey = process.env.RESEND_API_KEY;
        const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "eugeneopoku74@gmail.com";

        if (resendKey) {
            try {
                await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${resendKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: "Portfolio Contact <onboarding@resend.dev>",
                        to: notificationEmail,
                        subject: `New Message from ${trimmedName} on Portfolio`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                                <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-top: 0;">New Contact Submission</h2>
                                <p style="font-size: 14px; margin: 15px 0;"><strong>Name:</strong> ${trimmedName}</p>
                                <p style="font-size: 14px; margin: 15px 0;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}">${trimmedEmail}</a></p>
                                <p style="font-size: 14px; margin: 15px 0;"><strong>Message:</strong></p>
                                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #333; border-left: 4px solid #d1d5db; white-space: pre-wrap;">
                                    ${trimmedMessage.replace(/\n/g, "<br/>")}
                                </div>
                                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
                                <p style="font-size: 11px; color: #666; text-align: center; margin: 0;">Sent automatically from your portfolio platform.</p>
                            </div>
                        `
                    })
                });
                console.log("[Email Notification] Sent successfully.");
            } catch (emailErr) {
                console.error("[Email Notification Error] Failed to send:", emailErr);
            }
        } else {
            console.log("[Email Notification] Skipped (RESEND_API_KEY is not configured).");
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to save contact message:", error);
        return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
    }
}
