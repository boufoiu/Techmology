import { ChakraProvider } from '@chakra-ui/react';
import { RequestContext } from 'next/dist/server/base-server';

import { Footer, NavBar, PageHead } from '@/components';
import { Manager } from '@/lib';
import { Product } from '@/lib/types';

export async function getServerSideProps({
    query: { pid },
    req: {
        headers: { cookie }
    }
}: RequestContext) {
    const manager = new Manager();
    try {
        const res = await manager.api.showfilter.Product.get({
            headers: { Cookie: cookie }
        });
        const metadata = res.data.find((data) => data.id == (pid as any)) ?? null;
        const images = res.images.find((image) => image.ID == (pid as any))?.Data ?? null;
        return { props: { data: { data: metadata, images } } };
    } catch (err) {
        return { props: { data: {} } };
    }
}

export default function ViewProduct({ data }: { data: Product }) {
    console.log(data);
    return (
        <>
            <ChakraProvider>
                <PageHead title={`Products | ${data.data.Title}`} />
                <NavBar />
                View Product
                <Footer />
            </ChakraProvider>
        </>
    );
}
