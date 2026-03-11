import { ImageResponse } from '@vercel/og';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const hasTitle = searchParams.has('title');
        const title = hasTitle
            ? searchParams.get('title')?.slice(0, 100)
            : 'KCET Coded - The Ultimate KCET Guide';

        const hasSubtitle = searchParams.has('subtitle');
        const subtitle = hasSubtitle
            ? searchParams.get('subtitle')?.slice(0, 100)
            : 'Check your rank, cutoffs, and college reviews!';

        return new ImageResponse(
            (
                <div
                    style={{
                        backgroundColor: '#09090b',
                        backgroundSize: '150px 150px',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        flexWrap: 'nowrap',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            justifyItems: 'center',
                        }}
                    >
                        <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 10, color: '#3b82f6' }}>KCET Coded</h1>
                    </div>
                    <div
                        style={{
                            fontSize: 60,
                            fontWeight: 700,
                            fontStyle: 'normal',
                            letterSpacing: '-0.025em',
                            color: 'white',
                            marginTop: 20,
                            padding: '0 80px',
                            lineHeight: 1.4,
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {title}
                    </div>
                    {hasSubtitle && (
                        <div
                            style={{
                                fontSize: 32,
                                color: '#a1a1aa',
                                marginTop: 30,
                                padding: '0 80px',
                                lineHeight: 1.4,
                            }}
                        >
                            {subtitle}
                        </div>
                    )}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            fontSize: 24,
                            color: '#3b82f6',
                            fontWeight: 'bold',
                            opacity: 0.8,
                        }}
                    >
                        kcet-coded2.vercel.app
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
