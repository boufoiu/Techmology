import { ChakraProvider } from '@chakra-ui/react';
import { RequestContext } from 'next/dist/server/base-server';

import { Body, NavBar, PageHead } from '@/components';
import { Footer } from '@/components';

export async function getServerSideProps({
    req: {
        headers: { cookie }
    }
}: RequestContext) {
    return { props: {} };
}

export default function Home() {
    return (
        <>
            <ChakraProvider>
                <PageHead title="Mobot" />
                <NavBar />
                <Body />
                <Footer />
            </ChakraProvider>
        </>
    );
}
