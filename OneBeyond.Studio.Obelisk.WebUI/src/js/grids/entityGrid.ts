export abstract class EntityGrid {
    constructor() {}
    abstract initDataAdaptor(apiUrl: string, errorCallback: Function): void;
    abstract rememberCurrentPageBeforeGridAction(action: any): void;
    abstract restoreCurrentPage(): Promise<void>;
    abstract setInstance(gridRef: any): void;
    abstract refresh(): Promise<void>;
}

export enum EntityGridAction {
    EntityAdd = 1,
    EntityEdit = 2,
    EntityDelete = 3
}
