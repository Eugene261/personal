import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

export async function POST(request: Request) {
    if (!(await verifyAuth())) return unauthorized();

    let url = "";
    try {
        const body = await request.json().catch(() => ({}));
        url = body?.url || "";
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Normalize URL to always start with http/https
        let targetUrl = url.trim();
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = `https://${targetUrl}`;
        }

        console.log(`Fetching OG image for URL: ${targetUrl}`);
        let ogImageUrl = "";

        // 1. Try direct fetch first
        try {
            const response = await fetch(targetUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(6000) // 6s timeout
            });

            if (response.ok) {
                const html = await response.text();
                
                // Parse all meta tags robustly (ignores attribute order, whitespace, quotes)
                const metaRegex = /<meta\s+([^>]*)/gi;
                let match;
                const metaTags: Record<string, string> = {};

                while ((match = metaRegex.exec(html)) !== null) {
                    const attrsStr = match[1];
                    const propertyMatch = attrsStr.match(/property=["']([^"']+)["']/i) || attrsStr.match(/name=["']([^"']+)["']/i);
                    const contentMatch = attrsStr.match(/content=["']([^"']+)["']/i);
                    if (propertyMatch && contentMatch) {
                        metaTags[propertyMatch[1].toLowerCase()] = contentMatch[1];
                    }
                }

                ogImageUrl = metaTags["og:image"] || metaTags["twitter:image"] || "";
            }
        } catch (directError) {
            console.warn("Direct fetch failed, trying Microlink fallback:", directError);
        }

        // 2. Try Microlink API fallback (useful for sites behind Cloudflare/antibot)
        if (!ogImageUrl) {
            try {
                const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}`;
                const microRes = await fetch(microlinkUrl, {
                    signal: AbortSignal.timeout(5000)
                });
                if (microRes.ok) {
                    const data = await microRes.json();
                    if (data.status === "success" && data.data?.image?.url) {
                        ogImageUrl = data.data.image.url;
                    } else if (data.status === "success" && data.data?.screenshot?.url) {
                        ogImageUrl = data.data.screenshot.url;
                    }
                }
            } catch (microError) {
                console.warn("Microlink API fallback failed:", microError);
            }
        }

        // 3. Resolve relative image URLs to absolute ones
        if (ogImageUrl && !/^https?:\/\//i.test(ogImageUrl)) {
            try {
                if (ogImageUrl.startsWith("//")) {
                    // Protocol-relative URL
                    ogImageUrl = `https:${ogImageUrl}`;
                } else {
                    const parsedUrl = new URL(targetUrl);
                    if (ogImageUrl.startsWith("/")) {
                        ogImageUrl = `${parsedUrl.origin}${ogImageUrl}`;
                    } else {
                        const pathname = parsedUrl.pathname;
                        const basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
                        ogImageUrl = `${parsedUrl.origin}${basePath}${ogImageUrl}`;
                    }
                }
            } catch (e) {
                console.warn("Failed to resolve relative OG URL:", e);
            }
        }

        // 4. Guaranteed screenshot fallback (thum.io) if no image could be resolved
        if (!ogImageUrl) {
            console.log(`Using ultimate thum.io screenshot fallback for: ${targetUrl}`);
            ogImageUrl = `https://image.thum.io/get/width/1280/crop/800/${targetUrl}`;
        }

        return NextResponse.json({ imageUrl: ogImageUrl });
    } catch (error: any) {
        console.error("Critical OG fetch error:", error);
        // Fallback to screenshot even if the whole handler throws an exception
        try {
            if (!url) throw new Error("URL is empty");
            const target = url.trim();
            const normalizedTarget = /^https?:\/\//i.test(target) ? target : `https://${target}`;
            const fallbackUrl = `https://image.thum.io/get/width/1280/crop/800/${normalizedTarget}`;
            return NextResponse.json({ imageUrl: fallbackUrl });
        } catch {
            return NextResponse.json({ error: "Failed to resolve website image" }, { status: 500 });
        }
    }
}
