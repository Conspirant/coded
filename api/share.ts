export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    const url = new URL(req.url);
    const title = url.searchParams.get('title') || 'KCET Coded';
    const subtitle = url.searchParams.get('subtitle') || 'Check out my result on KCET Coded!';
    const redirectPath = url.searchParams.get('path') || '/';

    const baseUrl = url.origin;
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`;
    const finalRedirectUrl = `${baseUrl}${redirectPath}`;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | KCET Coded</title>
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${subtitle}" />
      <meta property="og:image" content="${ogImageUrl}" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${subtitle}" />
      <meta name="twitter:image" content="${ogImageUrl}" />
      
      <meta name="theme-color" content="#3b82f6" />
      
      <meta http-equiv="refresh" content="0; url=${finalRedirectUrl}">
      <script>
        window.location.href = "${finalRedirectUrl}";
      </script>
    </head>
    <body style="background-color: #09090b; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
      <p>Redirecting to <a href="${finalRedirectUrl}" style="color: #3b82f6;">${title}</a>...</p>
    </body>
    </html>
  `;

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
