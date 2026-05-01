import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Portfolio";

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-col w-full py-12 px-12 items-center justify-center">
          <h2 tw="text-5xl font-bold tracking-tight text-center">{title}</h2>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

