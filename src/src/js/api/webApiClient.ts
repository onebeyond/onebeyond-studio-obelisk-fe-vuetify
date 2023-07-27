import type IRequestInterceptor from "@js/api/interceptors/request/iRequestInterceptor";
import type IResponseInterceptor from "@js/api/interceptors/response/iResponseInterceptor";

/**
 *  WebAPI client based on FetchApi:
 *  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
export default abstract class WebApiClient {
    public static WebApiRoot = "";

    public readonly apiBaseUrl: string;

    protected readonly requestInterceptors: IRequestInterceptor[] = [];
    protected readonly responseInterceptors: IResponseInterceptor[] = [];

    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    protected async post(endpoint?: string, body?: unknown): Promise<Response> {
        return this.fetch(endpoint, WebApiClient.buildRequest("POST", body ? JSON.stringify(body) : null));
    }

    protected async put(endpoint?: string, body?: unknown): Promise<Response> {
        return this.fetch(endpoint, WebApiClient.buildRequest("PUT", body ? JSON.stringify(body) : null));
    }

    protected async get(endpoint?: string, body?: unknown): Promise<Response> {
        return this.fetch(endpoint, WebApiClient.buildRequest("GET", body ? JSON.stringify(body) : null));
    }

    protected async delete(endpoint?: string, body?: unknown): Promise<Response> {
        return this.fetch(endpoint, WebApiClient.buildRequest("DELETE", body ? JSON.stringify(body) : null));
    }

    protected async fetch(endpoint?: string, request?: RequestInit, overriddenBaseUrl?: string): Promise<Response> {
        const fullUrl = `${overriddenBaseUrl || this.apiBaseUrl}${endpoint ?? ""}`;

        // Call request interceptors, if any
        const suppressResponseErrorFromRequest = await this.callRequestInterceptors(fullUrl, request);

        // Store the fetch function in a variable so that it can be passed to interceptors
        const fetchFunction = () => fetch(new Request(fullUrl, request));

        let response: Response | null = null;

        try {
            // Make the request
            response = await fetchFunction();
        } catch (err: unknown) {
            return Promise.reject(
                new WebApiError((err as Error).message, WebApiError.UnreachableServerHttpCode, request),
            );
        }

        // Call response interceptors, if any
        const suppressResponseErrorFromResponse = await this.callResponseInterceptors(response, fetchFunction);

        if (!response.ok && !suppressResponseErrorFromRequest && !suppressResponseErrorFromResponse) {
            const errorMessage = await response.text();
            return Promise.reject(new WebApiError(errorMessage, response.status, request));
        }
        return response;
    }

    protected static buildRequest(
        method: string,
        body?: BodyInit | null,
        headers?: HeadersInit | null,
        contentTypeOverride?: string,
    ): RequestInit {
        let contentType: string = "application/json;charset=utf-8";
        if (contentTypeOverride) {
            contentType = contentTypeOverride;
        } else if (method === "GET") {
            contentType = "";
        }

        const defaultHeaders: HeadersInit = {
            Accept: "application/json, text/plain, */*",
            "Content-Type": contentType,
            "X-Requested-With": "XMLHttpRequest", // force server to return a 401 in case of authorization errors
        };

        return {
            body: body,
            method: method,
            credentials: "include", // change this to "omit" if you do not exchange cookies with the server
            headers: headers ?? defaultHeaders,
        };
    }

    private async callRequestInterceptors(url: string, request?: RequestInit): Promise<boolean> {
        let suppressResponseError = false;
        for (const interceptor of this.requestInterceptors) {
            if (interceptor) {
                const result = await interceptor.run(url, request);
                suppressResponseError ||= result.suppressResponseError;
                if (!result.canContinue) {
                    if (result.errorMessage) {
                        throw new WebApiError(result.errorMessage, 0, request);
                    }

                    break;
                }
            }
        }

        return suppressResponseError;
    }

    private async callResponseInterceptors(response: Response, request: () => Promise<Response>): Promise<boolean> {
        let suppressResponseError = false;
        for (const interceptor of this.responseInterceptors) {
            if (interceptor) {
                const result = await interceptor.run(response, request);
                suppressResponseError ||= result.suppressResponseError;
                if (!result.canContinue) {
                    if (result.errorMessage) {
                        throw new WebApiError(result.errorMessage, 0);
                    }

                    break;
                }
            }
        }

        return suppressResponseError;
    }
}

export class WebApiError extends Error {
    public static UnexpectedErrorRequestInterceptorHttpCode = -1;
    public static UnexpectedErrorResponseInterceptorHttpCode = -2;
    public static UnreachableServerHttpCode = -100;

    public readonly httpCode: number;
    public readonly request: RequestInit | undefined;

    constructor(message: string, httpCode: number, request?: RequestInit) {
        super(message);
        this.httpCode = httpCode;
        this.request = request;
    }

    // Overrides default toString
    public toString = (): string => {
        return this.message;
    };
}
