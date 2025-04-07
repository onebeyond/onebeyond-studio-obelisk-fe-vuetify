import type IRequestInterceptor from "@js/api/interceptors/request/iRequestInterceptor";
import type IResponseInterceptor from "@js/api/interceptors/response/iResponseInterceptor";
import { JwtResult } from "@js/dataModels/auth/jwtResult";

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
        const authHeaders = this.getJwtCookie();
        return this.fetch(endpoint, WebApiClient.buildRequest("POST", body ? JSON.stringify(body) : null, authHeaders?.bearerToken));
    }

    protected async put(endpoint?: string, body?: unknown): Promise<Response> {
        const authHeaders = this.getJwtCookie();
        return this.fetch(endpoint, WebApiClient.buildRequest("PUT", body ? JSON.stringify(body) : null, authHeaders?.bearerToken));
    }

    protected async get(endpoint?: string, body?: unknown): Promise<Response> {
        const authHeaders = this.getJwtCookie();
        return this.fetch(endpoint, WebApiClient.buildRequest("GET", body ? JSON.stringify(body) : null, authHeaders?.bearerToken));
    }

    protected async delete(endpoint?: string, body?: unknown): Promise<Response> {
        const authHeaders = this.getJwtCookie();
        return this.fetch(endpoint, WebApiClient.buildRequest("DELETE", body ? JSON.stringify(body) : null, authHeaders?.bearerToken));
    }

    protected async refresh(refreshToken: string): Promise<Response> {
        return this.fetch("refresh", WebApiClient.buildRequest("PUT", JSON.stringify(refreshToken)), `${WebApiClient.WebApiRoot}api/account/jwt/refreshToken/v1/`, false);
    }

    protected async fetch(endpoint?: string, request?: RequestInit, overriddenBaseUrl?: string, canBeAuthenticated: boolean = true): Promise<Response> {
        const fullUrl = `${overriddenBaseUrl || this.apiBaseUrl}${endpoint ?? ""}`;

        // Call request interceptors, if any
        const suppressResponseErrorFromRequest = await this.callRequestInterceptors(fullUrl, request);

        // Store the fetch function in a variable so that it can be passed to interceptors
        let fetchFunction = () => fetch(new Request(fullUrl, request));

        let response: Response | null = null;

        try {
            // Make the request
            response = await fetchFunction();

            // JWT for auth means we need to handle 401
            if (canBeAuthenticated && response.status === 401) {
                const jwtCookies = this.getJwtCookie();
                if (jwtCookies !== null) {
                    const jwtResponse = await this.refresh(jwtCookies.refreshToken!);
                    if (!jwtResponse.ok){
                        this.clearJwtCookies();
                        const errorMessage = await response.text();
                        return Promise.reject(new WebApiError(errorMessage, response.status, request));
                    }
                }
            }
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
        bearer?: string | null,
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

        if (bearer){
            defaultHeaders["Authorization"] = `Bearer ${bearer}`;
        }

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

    private BEARER_COOKIE = "obeliskBearer";
    private REFRESH_COOKIE = "obeliskRefresh";
    private LOGIN_COOKIE = "obeliskLogin";

    protected getJwtCookie(): JwtResult | null {
        let bearer = this.getCookie(this.BEARER_COOKIE);
        const refresh = this.getCookie(this.REFRESH_COOKIE);
        const user = this.getCookie(this.LOGIN_COOKIE);

        if (bearer === null) {
            if (refresh === null){
                return null;
            }

            bearer = "";
        }

        return {
            bearerToken: bearer!,
            refreshToken: refresh!,
            loginId: user!
        };
    }

    protected setJwtCookie(result: JwtResult) {
        // The cookie expiry time should exceed the token expiry time. Stale tokens have no value.
        this.setCookie(this.BEARER_COOKIE, result.bearerToken!, 1);
        this.setCookie(this.REFRESH_COOKIE, result.refreshToken!, 8);
        this.setCookie(this.LOGIN_COOKIE, result.loginId!, 1);
    }

    protected clearJwtCookies(){
        this.clearCookie(this.BEARER_COOKIE);
        this.clearCookie(this.REFRESH_COOKIE);
        this.clearCookie(this.LOGIN_COOKIE);
    }

    protected getCookie(name: string) : string | null {
        const nameEq = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++){
            let cookie = cookies[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
                if (cookie.indexOf(nameEq) == 0){
                    return cookie.substring(nameEq.length, cookie.length);
                }
            }
        }
        return null;
    }

    protected setCookie(name: string, value: string, days: number) : void{
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }

        document.cookie = `${name}=${value || ""}${expires}; path=/`;        
    }

    protected clearCookie(name: string){
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
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
