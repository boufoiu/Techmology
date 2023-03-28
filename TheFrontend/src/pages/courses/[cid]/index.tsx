import { RequestContext } from 'next/dist/server/base-server';

import { Manager } from '@/lib';
import { Course } from '@/lib/types';

export async function getServerSideProps({
    query: { cid },
    req: {
        headers: { cookie }
    }
}: RequestContext) {
    const manager = new Manager();
    try {
        const res = await manager.api.showfilter.Course.get({
            headers: { Cookie: cookie }
        });
        const metadata = res.data.find((data) => data.id == (cid as any)) ?? null;
        const images = res.images.find((data) => data.ID == (cid as any))?.Data ?? null;
        return { props: { data: { data: metadata, images } } };
    } catch (err) {
        return { props: { data: {} } };
    }
}

export default function ViewCourse({ data }: { data: Course }) {
    console.log(data);
    return <>View Course Content</>;
}
