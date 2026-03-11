import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    type?: string;
    image?: string;
    keywords?: string;
    jsonLd?: Record<string, unknown>;
}

const BASE_KEYWORDS = 'KCET, KCET 2026, KCET 2025, Karnataka CET, KEA, Karnataka Examination Authority, KCET cutoff, KCET rank predictor, KCET college finder, KCET counseling, engineering colleges Karnataka';

export function SEO({
    title,
    description,
    url = 'https://kcet-coded2.vercel.app',
    type = 'website',
    image = 'https://kcet-coded2.vercel.app/icon-512x512.png',
    keywords = '',
    jsonLd,
}: SEOProps) {
    const fullTitle = `${title} | KCET Coded`;
    const allKeywords = keywords ? `${keywords}, ${BASE_KEYWORDS}` : BASE_KEYWORDS;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="author" content="KCET Coded" />
            {url && <link rel="canonical" href={url} />}

            {/* Open Graph / Facebook */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="KCET Coded" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify({ '@context': 'https://schema.org', ...jsonLd })}
                </script>
            )}
        </Helmet>
    );
}
