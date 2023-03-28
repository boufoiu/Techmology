import { URLSearchParams } from 'url';

import { Options, RequestMethod } from './types';

export class Request {
    public constructor(private method: RequestMethod, private url: string, private options: Options) {
        if (options.query) {
            const query = Object.entries(options.query as never)
                .filter(([, value]) => value != null)
                .flatMap(([key, value]) => (Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]));
            const queryString = new URLSearchParams(query as never).toString();
            this.url = `${url}${queryString ?? `?${queryString}`}`;
        }
    }

    public make(): Promise<Response> {
        const url = `http://127.0.0.1:8000/${this.url}/`;
        const headers: any = {};

        if (this.options.headers)
            Object.entries(this.options.headers).forEach(([key, value]) => (headers[key] = value));

        let body: any;
        if (this.options.files != null) {
            body = new FormData();
            body.append('data', JSON.stringify(this.options.data));
            this.options.files.forEach((file) => body.append('Ressources', file));
        } else if (this.options.data != null) {
            body = JSON.stringify(this.options.data);
        }
        headers['Content-type'] = 'application/json';

        return fetch(url, {
            method: this.method,
            body,
            headers,
            credentials: 'include'
        });
    }
}
