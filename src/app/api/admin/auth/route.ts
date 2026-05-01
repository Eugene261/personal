import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validatePassword, SESSION_COOKIE, SESSION_TOKEN } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (validatePassword(password)) {
            const cookieStore = await cookies();
            cookieStore.set({
                name: SESSION_COOKIE,
                value: SESSION_TOKEN,
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    return NextResponse.json({ success: true });
}
