import { type NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';

function extractGoogleDriveId(url: string): string | null {
  const viewerRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
  const viewerMatch = viewerRegex.exec(url);
  if (viewerMatch) return viewerMatch[1];

  const openRegex = /drive\.google\.com\/open\?id=([^&]+)/;
  const openMatch = openRegex.exec(url);
  if (openMatch) return openMatch[1];

  const ucRegex = /drive\.google\.com\/uc\?id=([^&]+)/;
  const ucMatch = ucRegex.exec(url);
  if (ucMatch) return ucMatch[1];

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const gdriveId = extractGoogleDriveId(fileUrl);

  if (gdriveId) {
    const apiKey = env.GOOGLE_DRIVE_API_KEY;

    try {
      const metaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${gdriveId}?fields=mimeType,name&key=${apiKey}`
      );

      if (!metaRes.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch file metadata from Google Drive' },
          { status: metaRes.status }
        );
      }

      const meta = await metaRes.json();
      const contentType = (meta.mimeType as string) ?? 'application/octet-stream';

      const fileRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${gdriveId}?alt=media&key=${apiKey}`
      );

      if (!fileRes.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch file content from Google Drive' },
          { status: fileRes.status }
        );
      }

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', 'inline');
      headers.set('Cache-Control', 'public, max-age=3600');

      return new NextResponse(fileRes.body, {
        status: 200,
        headers,
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to proxy Google Drive file' },
        { status: 500 }
      );
    }
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', 'inline');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to proxy file' },
      { status: 500 }
    );
  }
}
