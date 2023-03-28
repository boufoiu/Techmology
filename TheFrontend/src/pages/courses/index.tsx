import { RequestContext } from 'next/dist/server/base-server';

import { Manager } from '@/lib';
import { Courses } from '@/lib/types';

export async function getServerSideProps({
    req: {
        headers: { cookie }
    }
}: RequestContext) {
    const manager = new Manager();
    try {
        const res = await manager.api.showfilter.Course.get({
            headers: { Cookie: cookie }
        });
        return { props: { data: res } };
    } catch (err) {
        return { props: { data: [] } };
    }
}

export default function ViewCourses({ data }: { data: Courses }) {
    console.log(data);
    return <>Show all courses</>;
}
