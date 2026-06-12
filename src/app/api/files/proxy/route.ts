import { type NextRequest, NextResponse } from 'next/server';

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

function extractFilename(fileUrl: string, contentType: string): string {
  try {
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split('/');
    const raw = pathParts[pathParts.length - 1] ?? '';
    const decoded = decodeURIComponent(raw);
    const cleaned = decoded.replace(/-[a-z0-9]{12,}(\.\w+)?$/, '$1').replace(/\?.*$/, '');
    if (cleaned && cleaned.includes('.')) return cleaned;
  } catch {}

  const extMap: Record<string, string> = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
  };
  const ext = extMap[contentType] ?? '';
  return `document${ext}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const gdriveId = extractGoogleDriveId(fileUrl);

  if (gdriveId) {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    if (!apiKey) {
      console.error('[proxy] GOOGLE_DRIVE_API_KEY is not set');
      return NextResponse.json(
        { error: 'Google Drive API key is not configured' },
        { status: 500 }
      );
    }

    try {
      const metaUrl = `https://www.googleapis.com/drive/v3/files/${gdriveId}?fields=mimeType,name&key=${apiKey}`;
      const metaRes = await fetch(metaUrl);

      if (!metaRes.ok) {
        const metaError = await metaRes.json().catch(() => null);
        console.error('[proxy] Drive API metadata error:', metaRes.status, metaError);
        return NextResponse.json(
          { error: `Google Drive API error: ${metaRes.status}`, details: metaError },
          { status: metaRes.status }
        );
      }

      const meta = await metaRes.json();
      const contentType = (meta.mimeType as string) ?? 'application/octet-stream';
      const filename = (meta.name as string) ?? 'document';

      const fileUrlApi = `https://www.googleapis.com/drive/v3/files/${gdriveId}?alt=media&key=${apiKey}`;
      const fileRes = await fetch(fileUrlApi);

      if (!fileRes.ok) {
        const fileError = await fileRes.json().catch(() => null);
        console.error('[proxy] Drive API content error:', fileRes.status, fileError);
        return NextResponse.json(
          { error: `Google Drive API error: ${fileRes.status}`, details: fileError },
          { status: fileRes.status }
        );
      }

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', `inline; filename="${filename}"`);
      headers.set('Cache-Control', 'public, max-age=3600');

      return new NextResponse(fileRes.body, {
        status: 200,
        headers,
      });
    } catch (error) {
      console.error('[proxy] Failed to proxy Google Drive file:', error);
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
    const filename = extractFilename(fileUrl, contentType);

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `inline; filename="${filename}"`);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[proxy] Failed to proxy file:', error);
    return NextResponse.json(
      { error: 'Failed to proxy file' },
      { status: 500 }
    );
  }
}
