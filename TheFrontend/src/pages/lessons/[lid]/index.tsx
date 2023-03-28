import { RequestContext } from 'next/dist/server/base-server';

import { Manager } from '@/lib';
import { LessonDataResponse, Response } from '@/lib/types';

export async function getServerSideProps({ query: { lid }, req }: RequestContext) {
    const manager = new Manager();

    try {
        const res = await manager.api.lessons(lid as any).get({
            headers: {
                Cookie: req.headers.cookie
            }
        });
        return { props: { data: res } };
    } catch (err) {
        return { props: { data: 'error' } };
    }
}

export default function Lesson({ data }: { data: Response<LessonDataResponse> }) {
    console.log(data);
    return <>View Lesson</>;
}
