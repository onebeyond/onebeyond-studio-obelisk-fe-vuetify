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
