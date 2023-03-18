import { APIEndpoints, Options, RequestMethod } from './types';
import { router } from './builder';
import { Request } from './request';

export class Manager {
    public get api(): APIEndpoints {
        return router(this);
    }

    public async request(method: RequestMethod, url: string, options: Options & { routes: string[] }) {
        const request = new Request(method, url, options);
        const res = await request.make();

        if (res.status >= 500) { 
            throw new Error('Internal server error');
        }
        else if (res.status >= 400) {
            throw new Error(`Request failed, http status ${res.status}`)
        }

        return await res.json();
    }
}