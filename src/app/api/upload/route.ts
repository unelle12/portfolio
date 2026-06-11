import { NextRequest, NextResponse } from "next/server";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

export async function POST(request: NextRequest) {
  try {
    const { pathname } = await request.json();

    if (!pathname) {
      return NextResponse.json({ error: "No pathname provided" }, { status: 400 });
    }

    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
      allowedContentTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "image/jpeg",
        "image/png",
        "image/gif",
      ],
    });

    return NextResponse.json({ clientToken });
  } catch (error) {
    console.error("Upload token error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload token" },
      { status: 500 }
    );
  }
}
