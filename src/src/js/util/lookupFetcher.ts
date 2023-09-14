import OBApiClient from "@js/api/obApiClient";
import type ILookupItem from "@js/dataModels/commons/ILookupItem";
import { plainToInstance, type ClassConstructor } from "class-transformer";

/**
 * This class replaces the previous JS npm package
 * Use it to fetch static lookups from your WebApi
 */
export default class LookupFetcher<T extends ILookupItem<string> | ILookupItem<number>> extends OBApiClient {
    private apiEndpoint = "";
    private urlParams: object = {};
    private failureCallback: ((error: unknown) => void) | null = null;
    private afterFetchCallback: ((data: T[]) => void) | null = null;
    private lookups: T[] = [];
    private responsePropName?: string = undefined;
    private entity: ClassConstructor<T> | null = null;

    constructor(entity: ClassConstructor<T> | null = null, responsePropName?: string) {
        super(`${OBApiClient.WebApiRoot}api`);
        this.entity = entity;
        this.responsePropName = responsePropName;
    }

    public setEndpoint(apiEndpoint: string, urlParams?: object): this {
        if (!apiEndpoint.startsWith("/")) {
            apiEndpoint = `/${apiEndpoint}`;
        }

        if (!apiEndpoint.endsWith("/")) {
            apiEndpoint += "/";
        }

        this.apiEndpoint = apiEndpoint;
        this.urlParams = urlParams ?? {};
        return this;
    }

    public setFailureCallback(callback: (error: unknown) => void): this {
        this.failureCallback = callback;
        return this;
    }

    public setAfterFetchCallback(callback: (data: T[]) => void): this {
        this.afterFetchCallback = callback;
        return this;
    }

    public async executeFetch(): Promise<this> {
        let query = Object.keys(this.urlParams)
            .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(this.urlParams[k])}`)
            .join("&");

        if (query !== "") query = "?" + query;

        try {
            const response = await this.get(`${this.apiEndpoint}${query}`);
            const body = await response.json();
            const items: T[] = this.responsePropName ? body[this.responsePropName] : body;

            this.lookups = this.entity ? plainToInstance(this.entity, items) : items;

            this.onReadSuccess(this.lookups);
        } catch (error: unknown) {
            this.onReadFailure(error);
        }

        return this;
    }

    public getAll(): T[] {
        return this.lookups;
    }

    private onReadFailure(error: unknown): void {
        if (this.failureCallback) {
            this.failureCallback(error);
        }
    }

    private onReadSuccess(lookups: T[]): void {
        if (this.afterFetchCallback) {
            this.afterFetchCallback(lookups);
        }
    }
}
