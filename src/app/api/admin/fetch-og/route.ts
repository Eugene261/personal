import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

export async function POST(request: Request) {
    if (!(await verifyAuth())) return unauthorized();

    try {
        const { url } = await request.json();
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        console.log(`Fetching OG image for URL: ${url}`);
        let ogImageUrl = "";

        // 1. Try direct fetch first
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
                next: { revalidate: 0 }, // bypass next cache
                signal: AbortSignal.timeout(5000) // 5s timeout
            });

            if (response.ok) {
                const html = await response.text();
                // Match various meta tags
                const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                                html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                                html.match(/<meta[^>]*name=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                
                if (ogMatch) {
                    ogImageUrl = ogMatch[1];
                } else {
                    const twitterMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
                                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
                    if (twitterMatch) {
                        ogImageUrl = twitterMatch[1];
                    }
                }
            }
        } catch (directError) {
            console.warn("Direct fetch failed, trying Microlink fallback:", directError);
        }

        // 2. If direct fetch failed or found no image, use Microlink API (handles Cloudflare etc.)
        if (!ogImageUrl) {
            try {
                const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
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

        // 3. Absolute URL resolution if relative
        if (ogImageUrl && ogImageUrl.startsWith("/")) {
            try {
                const parsedUrl = new URL(url);
                ogImageUrl = `${parsedUrl.origin}${ogImageUrl}`;
            } catch (e) {
                // ignore
            }
        }

        // 4. Ultimate screenshot fallback
        if (!ogImageUrl) {
            ogImageUrl = `https://image.thum.io/get/width/1280/crop/800/${url}`;
        }

        return NextResponse.json({ imageUrl: ogImageUrl });
    } catch (error: any) {
        console.error("OG fetch error:", error);
        return NextResponse.json({ error: "Failed to resolve website image: " + error.message }, { status: 500 });
    }
}
