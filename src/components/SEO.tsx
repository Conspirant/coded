import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    type?: string;
    image?: string;
}

export function SEO({
    title,
    description,
    url = 'https://kcet-coded.vercel.app',
    type = 'website',
    image = 'https://kcet-coded.vercel.app/icon-512x512.png',
}: SEOProps) {
    const fullTitle = `${title} | KCET Coded`;

    return (
        <Helmet>
            {/* Search Engine */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {url && <link rel="canonical" href={url} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="KCET Coded" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
