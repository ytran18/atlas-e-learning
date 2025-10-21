export interface HttpResponse<R> extends Response {
    json(): Promise<R>;
}

export interface Http {
    get<R = any, O = any>(url: string, options?: O): Promise<HttpResponse<R>>;

    post<R = any, D = any, O = any>(url: string, data: D, options?: O): Promise<HttpResponse<R>>;

    put<R = any, D = any, O = any>(url: string, data: D, options?: O): Promise<HttpResponse<R>>;

    patch<R = any, D = any, O = any>(url: string, data: D, options?: O): Promise<HttpResponse<R>>;

    delete<R = any, O = any>(url: string, options?: O): Promise<HttpResponse<R>>;
}
