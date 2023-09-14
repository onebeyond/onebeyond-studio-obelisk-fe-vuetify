import ObApiClient from "@js/api/obApiClient";
import PagedList from "@js/dataModels/pagedList";
import {
    type Query,
    type OrderBy,
    FilterType,
    StringOperators,
    NumberOperators,
    Filter,
} from "@js/grids/vuetify/types";
import { DateTime } from "@js/util/dateTime";

export class DataAdaptor extends ObApiClient {
    private readonly errorCallback: Function;

    constructor(apiBaseUrl: string, errorCallback: Function) {
        super(apiBaseUrl);
        this.errorCallback = errorCallback;
    }

    public async executeApi(query: Query, search: string, extraFilters: Filter[]): Promise<PagedList<unknown>> {
        const filters: string[] = [];

        if (search) {
            filters.push(`search=${search}`);
        }
        if (extraFilters) {
            extraFilters.forEach((filter) => {
                const filterKey = filter.key;
                switch (filter.type) {
                    case FilterType.SimpleText:
                    case FilterType.SimpleNumber:
                        if (this.isNotEmpty(filter.primaryValue)) {
                            filters.push(`${filterKey}=${filter.primaryValue}`);
                        }
                        break;
                    case FilterType.SimpleDate:
                    case FilterType.ComplexDate:
                        if (filter.primaryValue != null) {
                            const startDate = DateTime.getConvertedDate(filter.primaryValue, filter.isDateTimeOffset);
                            const endDate = DateTime.getConvertedDate(
                                DateTime.getEndOfDay(filter.primaryValue),
                                filter.isDateTimeOffset,
                            );
                            filters.push(`${filterKey}=${startDate}%26${endDate}`);
                        }
                        break;
                    case FilterType.SimpleDateTime:
                    case FilterType.ComplexDateTime:
                        if (filter.primaryValue != null) {
                            const startDate = DateTime.getConvertedDate(filter.primaryValue, filter.isDateTimeOffset);
                            filters.push(`${filterKey}=${startDate}`);
                        }
                        break;
                    case FilterType.SimpleDateOnly:
                    case FilterType.ComplexDateOnly:
                        if (filter.primaryValue != null) {
                            filters.push(`${filterKey}=${DateTime.getDateOnly(filter.primaryValue)}`);
                        }
                        break;
                    case FilterType.ComplexText:
                        if (filter.operator != null && this.isNotEmpty(filter.primaryValue)) {
                            const indexOfStringOp = Object.values(StringOperators).indexOf(
                                filter.operator as unknown as StringOperators,
                            );
                            const stringOp = Object.keys(StringOperators)[indexOfStringOp];
                            filters.push(`${filterKey}=${stringOp}(${filter.primaryValue})`);
                        }
                        break;
                    case FilterType.ComplexNumber:
                        if (filter.operator != null && this.isNotEmpty(filter.primaryValue)) {
                            if (filter.operator == NumberOperators.GreaterOrEqual) {
                                filters.push(`${filterKey}=${filter.primaryValue}%26`);
                            } else if (filter.operator == NumberOperators.LessOrEqual) {
                                filters.push(`${filterKey}=%26${filter.primaryValue}`);
                            } else {
                                filters.push(`${filterKey}=${filter.primaryValue}`);
                            }
                        }
                        break;
                    case FilterType.SimpleDropdown:
                    case FilterType.ComplexBoolean:
                    case FilterType.ComplexDropdown:
                        if (filter.primaryValue != null) {
                            filters.push(`${filterKey}=${filter.primaryValue}`);
                        }
                        break;
                    case FilterType.SimpleMultiSelectCheckbox:
                    case FilterType.ComplexMultiSelectCheckbox:
                    case FilterType.SimpleBoolean:
                        if (Array.isArray(filter.primaryValue)) {
                            for (let i = 0; i < filter.primaryValue.length; i++) {
                                if (filter.primaryValue[i] != undefined) {
                                    filters.push(`${filterKey}[${i}]=${filter.primaryValue[i]}`);
                                }
                            }
                        } else {
                            if (filter.primaryValue != undefined) {
                                filters.push(`${filterKey}=${filter.primaryValue}`);
                            }
                        }
                        break;
                    case FilterType.ComplexNumberRange: {
                        const start =
                            filter.primaryValue != undefined && filter.primaryValue != "" ? filter.primaryValue : null;
                        const end =
                            filter.secondaryValue != undefined && filter.secondaryValue != ""
                                ? filter.secondaryValue
                                : null;
                        if (start != null && end != null) {
                            filters.push(`${filterKey}=${start}%26${end}`);
                        } else if (start != null && end == null) {
                            filters.push(`${filterKey}=${start}%26`);
                        } else if (start == null && end != null) {
                            filters.push(`${filterKey}=%26${end}`);
                        }
                        break;
                    }
                    case FilterType.ComplexDateRange:
                    case FilterType.ComplexDateTimeRange: {
                        const startDate =
                            filter.primaryValue != undefined && filter.primaryValue != null
                                ? DateTime.getConvertedDate(filter.primaryValue, filter.isDateTimeOffset)
                                : null;
                        const endDate =
                            filter.secondaryValue != null && filter.secondaryValue != undefined
                                ? filter.type == FilterType.ComplexDateRange
                                    ? DateTime.getConvertedDate(
                                          DateTime.getEndOfDay(filter.secondaryValue),
                                          filter.isDateTimeOffset,
                                      )
                                    : DateTime.getConvertedDate(filter.secondaryValue, filter.isDateTimeOffset)
                                : null;

                        if (startDate != null && endDate != null) {
                            filters.push(`${filterKey}=${startDate}%26${endDate}`);
                        } else if (startDate != null && endDate == null) {
                            filters.push(`${filterKey}=${startDate}%26`);
                        } else if (startDate == null && endDate != null) {
                            filters.push(`${filterKey}=%26${endDate}`);
                        }
                        break;
                    }
                }
            });
        }
        filters.push(`page=${query.page}`);
        filters.push(`limit=${query.limit}`);
        filters.push(this.constructSortQuery(query.orderBy));

        const finalQuery = `?${filters.join("&")}`;

        try {
            const response = await this.get(finalQuery);
            return await response.json();
        } catch (e) {
            if (this.errorCallback) {
                this.errorCallback(e);
            }
        }

        return new PagedList();
    }

    public constructSortQuery(columns: OrderBy[]): string {
        let sortQuery = "orderBy=";

        sortQuery += columns.map((x) => `${x.key}:${x.order}`).join(",");

        return sortQuery;
    }

    private isNotEmpty(value: string): boolean {
        return value != null && value.trim() != "" && value != undefined;
    }
}
