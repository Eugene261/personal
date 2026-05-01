import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase-admin";
import { verifyAuth, unauthorized } from "@/lib/auth";

export async function POST(request: Request) {
    if (!(await verifyAuth())) return unauthorized();

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const bucket = storage.bucket();
        const blob = bucket.file(`uploads/${filename}`);

        await blob.save(buffer, {
            contentType: file.type,
            public: true,
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 });
    }
}
