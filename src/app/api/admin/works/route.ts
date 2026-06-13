import { NextResponse } from "next/server";
import { getCollection, setDocument } from "@/lib/firebaseData";
import { verifyAuth, unauthorized } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const COLLECTION = "works";

export async function GET() {
    try {
        const works = await getCollection(COLLECTION);
        // By default, if collection is empty, we return an empty array
        return NextResponse.json(works);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await verifyAuth())) return unauthorized();

    try {
        const data = await request.json();
        // Assume 'id' is passed, or generate one if creating new item
        const id = data.id || Date.now().toString();

        const success = await setDocument(COLLECTION, id, { ...data, id });
        if (!success) {
            return NextResponse.json({ error: "Failed to write to database" }, { status: 500 });
        }

        // Sync to local JSON file to prevent resets during server restart / HMR fallback
        try {
            const allWorks = await getCollection(COLLECTION);
            if (allWorks && allWorks.length > 0) {
                const sortedWorks = [...allWorks].sort((a: any, b: any) => {
                    if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                    }
                    const yearDiff = parseInt(b.year || "0") - parseInt(a.year || "0");
                    if (yearDiff !== 0) return yearDiff;
                    return parseInt(b.id || "0") - parseInt(a.id || "0");
                });
                const filePath = path.join(process.cwd(), "src", "data", "works.json");
                fs.writeFileSync(filePath, JSON.stringify(sortedWorks, null, 4), "utf8");
            }
        } catch (fsErr) {
            console.error("[Local Sync Error] Failed to write works.json:", fsErr);
        }

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save work" }, { status: 500 });
    }
}
