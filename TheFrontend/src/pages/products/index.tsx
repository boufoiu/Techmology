import { Manager } from '@/lib';
import { Products } from '@/lib/types';
import { RequestContext } from 'next/dist/server/base-server';

export async function getServerSideProps({ req: { headers: { cookie } } }: RequestContext) {
    const manager = new Manager();
    try {
        const res = await manager.api.showfilter.Product.get({
            headers: { Cookie: cookie }
        });
        return { props: { data: res } };
    }
    catch (err) {
        return { props: { data: [] } };
    }
}

export default function ViewProducts({ data }: { data: Products }) {
    console.log(data);
    return (
        <>View All products</>
    );
}
