import ObeliskApiClient from "@js/api/obeliskApiClient";
import type {
    Query,
    OrderBy
} from "@js/grids/vuetify/types";

export class DataAdaptor extends ObeliskApiClient {
    private readonly errorCallback: Function;

    constructor(apiBaseUrl: string, errorCallback: Function) {
        const apiUrl = `${ObeliskApiClient.WebApiRoot}${apiBaseUrl}`;
        super(apiUrl);
        this.errorCallback = errorCallback;
    }

    public async executeApi(query: Query, search: string): Promise<any> {
        let filters: string[] = [];

        if (search) {
            filters.push(`search=${search}`);
        }

        filters.push(`page=${query.page}`);
        filters.push(`limit=${query.limit}`);
        filters.push(this.constructSortQuery(query.orderBy));

        const finalQuery = `?${filters.join("&")}`;

        try {
            let response = await this.get(finalQuery);
            return await response.json();
        } catch (e) {
            if (!!this.errorCallback) {
                this.errorCallback(e);
            }
        }
    }

    public constructSortQuery(columns: OrderBy[]): string {
        let sortQuery = "orderBy=";

        sortQuery += columns
            .map((x) => `${x.key}:${x.order}`)
            .join(",");

        return sortQuery;
    }
}
