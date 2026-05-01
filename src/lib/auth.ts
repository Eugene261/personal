import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE = "admin_session";
const SESSION_TOKEN = "authenticated";

export async function verifyAuth(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    return session?.value === SESSION_TOKEN;
}

export function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function validatePassword(password: string): boolean {
    return password === ADMIN_PASSWORD;
}

export { SESSION_COOKIE, SESSION_TOKEN };
