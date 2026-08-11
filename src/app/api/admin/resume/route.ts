import { NextResponse } from "next/server";
import { getDocument, setDocument } from "@/lib/firebaseData";
import { verifyAuth, unauthorized } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const COLLECTION = "content";
const DOCUMENT = "resume";

import resumeDataLocal from "@/data/resume.json";

export async function GET() {
    try {
        const resumeData = await getDocument<any>(COLLECTION, DOCUMENT);
        const mergedProjects = {
            ...resumeDataLocal.projects,
            ...resumeData?.projects,
        };
        if (resumeDataLocal.projects?.["2"]?.included) {
            mergedProjects["2"] = {
                ...(resumeDataLocal.projects as any)["2"],
                ...(resumeData?.projects?.["2"] || {}),
                included: true,
            };
        }

        const merged = {
            ...resumeDataLocal,
            ...resumeData,
            basics: {
                ...resumeDataLocal.basics,
                ...resumeData?.basics,
            },
            projects: mergedProjects,
            experiences: {
                ...resumeDataLocal.experiences,
                ...resumeData?.experiences,
            },
            education: {
                ...resumeDataLocal.education,
                ...resumeData?.education,
            },
            skills: {
                ...resumeDataLocal.skills,
                ...resumeData?.skills,
            },
        };
        return NextResponse.json(merged);
    } catch (error) {
        return NextResponse.json(resumeDataLocal || {});
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
            const filePath = path.join(process.cwd(), "src", "data", "resume.json");
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
        } catch (fsErr) {
            console.error("[Local Sync Error] Failed to write resume.json:", fsErr);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save resume config" }, { status: 500 });
    }
}
