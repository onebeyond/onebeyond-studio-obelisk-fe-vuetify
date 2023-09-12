export type CrudAction = (id: string) => void;

export interface Command {
    buttonIcon: string;
    buttonLabel: string;
    action: CrudAction;
}

export class Column {
    title: string = "";
    key: string = "";
    sortable: boolean = false;
    align?: "start" | "end";
    allowFiltering?: boolean = false;
    filterType?: FilterType = FilterType.NoFilter;
    valueAccessor?: any = [];
    dataType: string | null = null;
}

export interface Query {
    limit: number;
    page: number;
    orderBy: OrderBy[];
}

export interface OrderBy {
    key: string;
    order?: boolean | "asc" | "desc";
}

export interface VuetifyGrid {
    page: number;
}

export enum FilterType {
    NoFilter = 0,
    SimpleText = 1,
    SimpleNumber = 2,
    SimpleDropdown = 3,
    SimpleBoolean = 4,
    SimpleMultiSelectCheckbox = 5,
    SimpleDate = 6,
    SimpleDateTime = 7,
    SimpleDateOnly = 8,
    ComplexText = 9,
    ComplexNumber = 10,
    ComplexDropdown = 11,
    ComplexBoolean = 12,
    ComplexMultiSelectCheckbox = 13,
    ComplexNumberRange = 14,
    ComplexDate = 15,
    ComplexDateTime = 16,
    ComplexDateOnly = 17,
    ComplexDateRange = 18,
    ComplexDateTimeRange = 19,
}

export enum StringOperators {
    Contains = "Contains",
    Equals = "Equals",
    StartsWith = "Starts With",
    EndsWith = "Ends With",
    Not = "Not",
}

export enum NumberOperators {
    Equals = "Equals",
    GreaterOrEqual = "Greater then or equal",
    LessOrEqual = "Less then or equal",
}
