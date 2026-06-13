import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase-admin";
import { verifyAuth, unauthorized } from "@/lib/auth";
import fs from "fs";
import path from "path";

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

        // 1. Try Firebase Storage first
        try {
            const bucket = storage.bucket();
            const [exists] = await bucket.exists();
            if (exists) {
                const blob = bucket.file(`uploads/${filename}`);
                await blob.save(buffer, {
                    contentType: file.type,
                    public: true,
                });
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                return NextResponse.json({ url: publicUrl });
            }
        } catch (storageError) {
            console.warn("Firebase Storage failed or not configured. Falling back to local upload:", storageError);
        }

        // 2. Local fallback if Firebase Storage fails/is not configured
        const publicDir = path.join(process.cwd(), "public", "images");
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const filePath = path.join(publicDir, filename);
        fs.writeFileSync(filePath, buffer);

        const localUrl = `/images/${filename}`;
        return NextResponse.json({ url: localUrl });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 });
    }
}
