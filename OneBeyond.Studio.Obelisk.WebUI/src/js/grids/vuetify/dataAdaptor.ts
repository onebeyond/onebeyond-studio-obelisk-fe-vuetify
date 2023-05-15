import ObeliskApiClient from "@js/api/obeliskApiClient";

export class DataAdaptor extends ObeliskApiClient {
    private readonly errorCallback: Function;

    constructor(apiBaseUrl: string, errorCallback: Function) {
        super(apiBaseUrl);
        this.errorCallback = errorCallback;
    }

    public async executeApi(pagination: any, search: any): Promise<any> {
        let filters: string[] = [];

        // Search box
        if (typeof search === "string" && search.length > 0) {
            filters.push(`search=${search}`);
        } else {
            // Column filter
            const columnFilters = Object.keys(search)
                .filter((key) => search[key])
                .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(search[k])}`);

            filters = filters.concat(columnFilters);
        }

        // OrderBy/Limit/Page/etc.
        const otherParams = Object.keys(pagination)
            .filter((k) => pagination[k] != null) // clean-up null values, if any
            .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(pagination[k])}`);

        const finalQuery = `?${otherParams.concat(filters).join("&")}`;

        try {
            let response = await this.get(finalQuery);
            return await response.json();
        } catch (e) {
            if (!!this.errorCallback) {
                this.errorCallback(e);
            }
        }
    }
}
