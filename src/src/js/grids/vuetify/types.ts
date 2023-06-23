export type CrudAction = (id: any) => void;

export interface Command {
    buttonIcon: string,
    buttonLabel: string,
    action: CrudAction,
}

export class Column {
    title: string = "";
    key: string = "";
    sortable: boolean = false;
    align?: 'start' | 'end';
    allowFiltering?: boolean = false;
    filterType?: FilterType = FilterType.NoFilter;
    valueAccessor?: any = [];
    dataType: string | null = null;
}

export interface Query {
    limit: number,
    page: number,
    orderBy: OrderBy[],
}

export interface OrderBy {
    key: string;
    order?: boolean | 'asc' | 'desc';
}

export enum FilterType {
    NoFilter = 0,
    SimpleText = 1,
    SimpleNumber = 2,
    SimpleDropdown = 3,
    SimpleBoolean = 4,
    SimpleMultiSelectCheckbox = 5,
    SimpleDate = 6,
    SimpleDateOnly = 7,
    ComplexText = 8,
    ComplexNumber = 9,
    ComplexDropdown = 10,
    ComplexBoolean = 11,
    ComplexMultiSelectCheckbox = 12,
    ComplexNumberRange = 13,
    ComplexDate = 14,
    ComplexDateOnly = 15,
    ComplexDateRange = 16
}

export enum StringOperators {
    Contains = "Contains",
    Equals = "Equals",
    StartsWith = "Starts With",
    EndsWith = "Ends With",
    Not = "Not"
}

export enum NumberOperators {
    Equals = "Equals",
    GreaterOrEqual = "Greater then or equal",
    LessOrEqual = "Less then or equal",
}