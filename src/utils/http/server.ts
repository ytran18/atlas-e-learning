import { cookies as getCookies } from "next/headers";

import { Http, HttpResponse } from "./type";

// import { AuthCookies } from "@/types";

type RequestInterceptor = (
    request: RequestInfo | string,
    options: RequestInit
) => {
    request: RequestInfo | string;
    options: RequestInit;
};

type ResponseInterceptor = (response: Response) => Response;

class Server implements Http {
    public requestInterceptors: Record<string, RequestInterceptor> = {};

    public responseInterceptors: Record<string, ResponseInterceptor> = {};

    async get<R = any, O = RequestInit>(url: string, options?: O): Promise<HttpResponse<R>> {
        const response = await this.execute(url, {
            ...options,
        });

        return response;
    }

    async post<R = any, D = any, O = RequestInit>(
        url: string,
        data: D,
        options?: O
    ): Promise<HttpResponse<R>> {
        const response = await this.execute(url, {
            method: "POST",
            body: JSON.stringify(data),
            ...options,
        });
        return response;
    }

    async put<R = any, D = any, O = RequestInit>(
        url: string,
        data: D,
        options?: O
    ): Promise<HttpResponse<R>> {
        const response = await this.execute(url, {
            method: "PUT",
            body: JSON.stringify(data),
            ...options,
        });
        return response;
    }

    async patch<R = any, D = any, O = RequestInit>(
        url: string,
        data: D,
        options?: O
    ): Promise<HttpResponse<R>> {
        const response = await this.execute(url, {
            method: "PATCH",
            body: JSON.stringify(data),
            ...options,
        });
        return response;
    }

    async delete<R = any, O = RequestInit>(url: string, options?: O): Promise<HttpResponse<R>> {
        const response = await this.execute(url, {
            method: "DELETE",
            ...options,
        });
        return response;
    }

    public clone(): Server {
        const server = new Server();
        server.requestInterceptors = { ...this.requestInterceptors };
        server.responseInterceptors = { ...this.responseInterceptors };
        return server;
    }

    private async execute(request: RequestInfo | string, options: RequestInit) {
        let interceptedRequest = request;
        let interceptedOptions = options;

        Object.entries(this.requestInterceptors).forEach(([_name, interceptor]) => {
            const result = interceptor(interceptedRequest, interceptedOptions);
            interceptedRequest = result.request;
            interceptedOptions = result.options;
        });

        let response = await fetch(interceptedRequest, interceptedOptions);

        Object.entries(this.responseInterceptors).forEach(([_name, interceptor]) => {
            response = interceptor(response);
        });

        return response;
    }

    public addRequestInterceptor(name: string, interceptor: RequestInterceptor) {
        if (this.requestInterceptors[name]) {
            throw new Error(`Request interceptor with name '${name}' already exists.`);
        }
        this.requestInterceptors[name] = interceptor;
    }

    public addResponseInterceptor(name: string, interceptor: ResponseInterceptor) {
        if (this.responseInterceptors[name]) {
            throw new Error(`Response interceptor with name '${name}' already exists.`);
        }
        this.responseInterceptors[name] = interceptor;
    }

    public async removeRequestInterceptor(name: string) {
        delete this.requestInterceptors[name];
    }

    public async removeResponseInterceptor(name: string) {
        delete this.responseInterceptors[name];
    }
}

const http = new Server();

http.addRequestInterceptor("baseURL", (request, options) => {
    return {
        request: `${process.env.NEXT_PUBLIC_API_BASE_URL}${request}`,
        options,
    };
});

http.addRequestInterceptor("defaultHeaders", (request, options) => {
    const headers = new Headers(options.headers);

    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    // Add Cloudflare header for server-side requests
    if (process.env.NEXT_CLOUDFLARE_WHITELIST_SECRET) {
        headers.set("X-Cloudflare-Whitelist-Secret", process.env.NEXT_CLOUDFLARE_WHITELIST_SECRET);
    }

    return { request, options: { ...options, headers } };
});

http.addRequestInterceptor("auth", (request, options) => {
    const headers = new Headers(options.headers);

    const cookies = getCookies();
    // const idToken = cookies.get(AuthCookies.ID_TOKEN)?.value;

    // if (idToken) {
    //     headers.set("Authorization", idToken);
    // }
    return { request, options: { ...options, headers } };
});

http.addResponseInterceptor("json", (response) => {
    return response;
});

export default http;
