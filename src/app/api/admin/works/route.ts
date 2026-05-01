import { NextResponse } from "next/server";
import { getCollection, setDocument } from "@/lib/firebaseData";
import { verifyAuth, unauthorized } from "@/lib/auth";

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

        await setDocument(COLLECTION, id, { ...data, id });
        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save work" }, { status: 500 });
    }
}
