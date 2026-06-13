import { NextResponse } from "next/server";
import { getDocument, setDocument } from "@/lib/firebaseData";
import { verifyAuth, unauthorized } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const COLLECTION = "content";
const DOCUMENT = "services";

export async function GET() {
    try {
        const services = await getDocument(COLLECTION, DOCUMENT);
        return NextResponse.json(services || {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch services config" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await verifyAuth())) return unauthorized();

    try {
        const data = await request.json();
        const success = await setDocument(COLLECTION, DOCUMENT, data);
        if (!success) {
            return NextResponse.json({ error: "Failed to write to database" }, { status: 500 });
        }

        // Sync to local JSON file to prevent resets during server restart / HMR fallback
        try {
            const filePath = path.join(process.cwd(), "src", "data", "services.json");
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
        } catch (fsErr) {
            console.error("[Local Sync Error] Failed to write services.json:", fsErr);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save services config" }, { status: 500 });
    }
}
