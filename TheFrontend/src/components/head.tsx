import Head from 'next/head';

export interface HeadProps {
    title: string;
}

export const PageHead = ({ title }: HeadProps) => (
    <Head>
        <title>{title}</title>
        <meta name="description" content="Online platform to learn electronics, and buy electronics kits." />
        <meta name="keywords" content="Arduino, Electronics, Programming" />
        <meta name="author" content="Kim Dokja's Company" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3b69b1" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="apple-touch-icon" href="/icons/logo-96x96.png" />
        <meta name="apple-mobile-web-app-status-bar" content="#3b69b1" />
    </Head>
);
