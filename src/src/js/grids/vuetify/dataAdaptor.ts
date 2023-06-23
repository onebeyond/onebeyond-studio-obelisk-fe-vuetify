import ObApiClient from "@js/api/obApiClient";
import {
    type Query,
    type OrderBy,
    FilterType,
    StringOperators,
    NumberOperators
} from "@js/grids/vuetify/types";
export class DataAdaptor extends ObApiClient {
    private readonly errorCallback: Function;

    constructor(apiBaseUrl: string, errorCallback: Function) {
        super(apiBaseUrl);
        this.errorCallback = errorCallback;
    }

    public async executeApi(query: Query, search: string, extraFilters: any): Promise<any> {
        let filters: string[] = [];

        if (search) {
            filters.push(`search=${search}`);
        }
        if (extraFilters) {
            extraFilters.forEach(filter => {
                const filterKey = filter.key;
                if (filter.type == FilterType.SimpleText
                    || filter.type == FilterType.SimpleNumber) {
                    if (filter.value.trim() != ''
                        && filter.value != undefined) {
                        filters.push(`${filterKey}=${filter.value}`);
                    }
                }
                else if (filter.type == FilterType.ComplexText) {
                    if (filter.operator != ''
                        && filter.operator != undefined
                        && filter.value != ''
                        && filter.value != undefined) {
                        const indexOfStringOp = Object.values(StringOperators).indexOf(filter.operator as unknown as StringOperators);
                        const stringOp = Object.keys(StringOperators)[indexOfStringOp];
                        filters.push(`${filterKey}=${stringOp}(${filter.value})`);
                    }
                }
                else if (filter.type == FilterType.ComplexNumber) {
                    if (filter.operator != ''
                        && filter.operator != undefined
                        && filter.value != ''
                        && filter.value != undefined) {
                        if (filter.operator == NumberOperators.GreaterOrEqual) {
                            filters.push(`${filterKey}=${filter.value}%26`);
                        }
                        else if (filter.operator == NumberOperators.LessOrEqual) {
                            filters.push(`${filterKey}=%26${filter.value}`);
                        }
                        else {
                            filters.push(`${filterKey}=${filter.value}`);
                        }
                    }
                }
                else if (filter.type == FilterType.SimpleDropdown
                    || filter.type == FilterType.ComplexDropdown
                    || filter.type == FilterType.ComplexBoolean) {
                    if (filter.value != undefined) {
                        filters.push(`${filterKey}=${filter.value}`);
                    }
                }
                else if (filter.type == FilterType.SimpleMultiSelectCheckbox
                    || filter.type == FilterType.ComplexMultiSelectCheckbox
                    || filter.type == FilterType.SimpleBoolean) {
                    if (Array.isArray(filter.value)) {
                        for (let i = 0; i < filter.value.length; i++) {
                            if (filter.value[i] != undefined) {
                                filters.push(`${filterKey}[${i}]=${filter.value[i]}`);
                            }
                        }
                    }
                    else {
                        if (filter.value != undefined) {
                            filters.push(`${filterKey}=${filter.value}`);
                        }
                    }
                }
                else if (filter.type == FilterType.ComplexNumberRange) {
                    if (filter.primaryValue != undefined
                        && filter.primaryValue != ''
                        && filter.secondaryValue != ''
                        && filter.secondaryValue != undefined) {
                        filters.push(`${filterKey}=${filter.primaryValue}%26${filter.secondaryValue}`);
                    }
                    else if (filter.primaryValue != undefined
                        && filter.primaryValue != ''
                        && (filter.secondaryValue == undefined || filter.secondaryValue == '')) {
                        filters.push(`${filterKey}=${filter.primaryValue}%26`);
                    }
                    else if (filter.secondaryValue != undefined
                        && filter.secondaryValue != ''
                        && (filter.primaryValue == undefined || filter.primaryValue == '')) {
                        filters.push(`${filterKey}=%26${filter.secondaryValue}`);
                    }
                }
            });
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