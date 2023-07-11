import ObApiClient from "@js/api/obApiClient";
import {
    type Query,
    type OrderBy,
    FilterType,
    StringOperators,
    NumberOperators
} from "@js/grids/vuetify/types";
import { DateTime } from "@js/util/dateTime";
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
                else if (filter.type == FilterType.SimpleDate 
                    || filter.type == FilterType.ComplexDate) {
                    if (filter.value != null) {
                        const utcFlag = filter.dataType == null ? true : false;
                        const startDate = DateTime.getConvertedDate(filter.value,utcFlag); 
                        const endDate = DateTime.getConvertedDate(DateTime.getEndOfDay(filter.value), utcFlag); 
                        filters.push(`${filterKey}=${startDate}%26${endDate}`);
                    }
                }
                else if (filter.type == FilterType.SimpleDateTime 
                    || filter.type == FilterType.ComplexDateTime) {
                    if (filter.value != null) {
                        const utcFlag = filter.dataType == null ? true : false;
                        const startDate = DateTime.getConvertedDate(filter.value,utcFlag); 
                        filters.push(`${filterKey}=${startDate}`);
                    }
                }
                else if (filter.type == FilterType.SimpleDateOnly
                    || filter.type == FilterType.ComplexDateOnly) { 
                    if (filter.value != null) {
                           filters.push(`${filterKey}=${DateTime.getDateOnly(filter.value)}`);
                    }
                }
                else if (filter.type == FilterType.ComplexDateRange 
                    || filter.type == FilterType.ComplexDateTimeRange) {
                        const utcFlag = filter.dataType == null ? true : false;
                        const startDate = filter.primaryValue != undefined && filter.primaryValue != null
                            ? DateTime.getConvertedDate(filter.primaryValue,utcFlag)
                            : null;
                        const endDate = filter.secondaryValue != null && filter.secondaryValue != undefined 
                            ?  filter.type == FilterType.ComplexDateRange 
                                ? DateTime.getConvertedDate(DateTime.getEndOfDay(filter.secondaryValue), utcFlag)
                                : DateTime.getConvertedDate(filter.secondaryValue, utcFlag)
                            : null;

                        if (startDate != null && endDate != null) {
                           filters.push(`${filterKey}=${startDate}%26${endDate}`);
                        }
                        else if (startDate != null && endDate == null) {
                            filters.push(`${filterKey}=${startDate}%26`);
                        }
                        else if (startDate == null && endDate != null) {
                            filters.push(`${filterKey}=%26${endDate}`);
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
                    const start = filter.primaryValue != undefined && filter.primaryValue != ''
                        ? filter.primaryValue
                        : null;
                    const end = filter.secondaryValue != undefined && filter.secondaryValue != ''
                        ? filter.secondaryValue
                        : null;
                    if (start != null && end != null) {
                        filters.push(`${filterKey}=${start}%26${end}`);
                    }
                    else if (start != null && end == null) {
                        filters.push(`${filterKey}=${start}%26`);
                    }
                    else if (start == null && end != null) {
                        filters.push(`${filterKey}=%26${null}`);
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

        sortQuery += columns.map((x) => `${x.key}:${x.order}`).join(",");

        return sortQuery;
    }

}