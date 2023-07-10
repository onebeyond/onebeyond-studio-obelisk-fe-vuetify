export abstract class EntityGrid {
    constructor() {}

    abstract rememberCurrentPageBeforeGridAction(action: any);
    abstract restoreCurrentPage();
    abstract setInstance(gridRef: any);
}

export enum EntityGridAction {
    EntityAdd = 1,
    EntityEdit = 2,
    EntityDelete = 3,
}
