import { ChakraProvider } from '@chakra-ui/react';
import { RequestContext } from 'next/dist/server/base-server';

import { Footer, NavBar, PageHead, ProductDetails } from '@/components';
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
        const images = res.images.filter((image) => image.ID == (pid as any)) ?? null;
        return { props: { data: { data: metadata, images } } };
    } catch (err) {
        return { props: { data: {} } };
    }
}

export default function ViewProduct({ data }: { data: Product }) {
    return (
        <>
            <ChakraProvider>
                <PageHead title={`Products | ${data.data.Title}`} />
                <NavBar />
                <ProductDetails {...data.data} images={data.images} />
                <Footer />
            </ChakraProvider>
        </>
    );
}
